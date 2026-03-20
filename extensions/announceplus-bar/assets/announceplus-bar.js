// AnnouncePlus Bar — announceplus-bar.js
// AnnouncePlus by Makerbase — makerbase.app

(function () {
  'use strict';

  var STORAGE_PREFIX = 'ap_bar_closed_';
  var POLL_INTERVAL = 3000;
  var DEFAULT_THRESHOLD = 5000;

  var VISITOR_KEY = 'ap_visitor';
  var lastCartTotal = null;
  var lastCartItemCount = null;
  var pollTimer = null;
  var shippingBars = [];
  var cartStateBars = [];

  // ─── Targeting Engine ───

  function checkPageTarget(bar) {
    var placement = (bar.dataset.placement || 'all_pages');
    if (placement.indexOf('all_pages') !== -1) return true;

    var template = bar.dataset.template || '';
    var path = window.location.pathname;

    var map = {
      homepage: function () { return template === 'index' || path === '/'; },
      collections: function () { return template === 'collection' || path.indexOf('/collections/') === 0; },
      products: function () { return template === 'product' || path.indexOf('/products/') === 0; },
      cart: function () { return template === 'cart' || path === '/cart'; },
      blog: function () { return template === 'blog' || template === 'article' || path.indexOf('/blogs/') === 0; },
    };

    var pages = placement.split(',');
    for (var i = 0; i < pages.length; i++) {
      var check = map[pages[i].trim()];
      if (check && check()) return true;
    }
    return false;
  }

  function checkVisitorTarget(bar) {
    var showTo = bar.dataset.showTo || 'all';
    if (showTo === 'all') return true;

    var isReturning = false;
    try {
      isReturning = !!localStorage.getItem(VISITOR_KEY);
      if (!isReturning) localStorage.setItem(VISITOR_KEY, '1');
    } catch (e) {}

    if (showTo === 'new') return !isReturning;
    if (showTo === 'returning') return isReturning;
    return true;
  }

  function checkDeviceTarget(bar) {
    var target = bar.dataset.device || 'all';
    if (target === 'all') return true;

    var isMobile = window.innerWidth < 768;
    if (target === 'mobile') return isMobile;
    if (target === 'desktop') return !isMobile;
    return true;
  }

  function checkCartState(bar, cart) {
    var state = bar.dataset.cartState || 'any';
    if (state === 'any') return true;
    if (!cart) return state === 'empty';

    if (state === 'empty') return cart.item_count === 0;
    if (state === 'non_empty') return cart.item_count > 0;
    return true;
  }

  function matchUrlPattern(path, pattern) {
    pattern = pattern.trim();
    if (!pattern) return false;
    if (pattern === path) return true;
    // Wildcard: /collections/* matches /collections/anything
    if (pattern.indexOf('*') !== -1) {
      var regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(path);
    }
    return false;
  }

  function checkUrlTarget(bar) {
    var targetUrls = bar.dataset.targetUrls || '';
    var excludeUrls = bar.dataset.excludeUrls || '';
    var path = window.location.pathname;

    // Check excludes first — always block
    if (excludeUrls) {
      var excludes = excludeUrls.split(',');
      for (var i = 0; i < excludes.length; i++) {
        if (matchUrlPattern(path, excludes[i])) return false;
      }
    }

    // If includes are set, path must match at least one
    if (targetUrls) {
      var includes = targetUrls.split(',');
      var matched = false;
      for (var j = 0; j < includes.length; j++) {
        if (matchUrlPattern(path, includes[j])) { matched = true; break; }
      }
      if (!matched) return false;
    }

    return true;
  }

  function checkCustomerStatus(bar) {
    var status = bar.dataset.customerStatus || 'any';
    if (status === 'any') return true;
    var loggedIn = bar.dataset.customerLoggedIn === 'true';
    if (status === 'logged_in') return loggedIn;
    if (status === 'guest') return !loggedIn;
    return true;
  }

  function checkCartValue(bar, cart) {
    var min = parseFloat(bar.dataset.cartValueMin) || 0;
    var max = parseFloat(bar.dataset.cartValueMax) || 0;
    if (min === 0 && max === 0) return true;
    if (!cart) return min === 0;

    var cartDollars = cart.total_price / 100;
    if (min > 0 && cartDollars < min) return false;
    if (max > 0 && cartDollars > max) return false;
    return true;
  }

  function checkCartItemCount(bar, cart) {
    var min = parseInt(bar.dataset.cartItemMin, 10) || 0;
    var max = parseInt(bar.dataset.cartItemMax, 10) || 0;
    if (min === 0 && max === 0) return true;
    if (!cart) return min === 0;

    if (min > 0 && cart.item_count < min) return false;
    if (max > 0 && cart.item_count > max) return false;
    return true;
  }

  function checkSchedule(bar) {
    var start = bar.dataset.startDate || '';
    var end = bar.dataset.endDate || '';
    if (!start && !end) return true;

    var now = new Date();
    if (start && new Date(start) > now) return false;
    if (end) {
      var endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      if (endDate < now) return false;
    }
    return true;
  }

  function checkActiveDays(bar) {
    var daysAttr = bar.dataset.activeDays || '';
    if (!daysAttr || daysAttr === '[]') return true;

    var days;
    try { days = JSON.parse(daysAttr); } catch (e) { return true; }
    if (!Array.isArray(days) || days.length === 0 || days.length === 7) return true;

    var today = new Date().getDay().toString();
    return days.indexOf(today) !== -1;
  }

  function checkCustomerTags(bar) {
    var required = bar.dataset.requiredTags || '';
    if (!required) return true;

    var customerTags = (bar.dataset.customerTags || '').toLowerCase().split(',').map(function (t) { return t.trim(); });
    var requiredTags = required.toLowerCase().split(',').map(function (t) { return t.trim(); });

    for (var i = 0; i < requiredTags.length; i++) {
      if (requiredTags[i] && customerTags.indexOf(requiredTags[i]) !== -1) return true;
    }
    return false;
  }

  function checkCountry(bar) {
    var target = bar.dataset.countryTarget || '';
    if (!target) return true;

    var visitorCountry = (bar.dataset.country || '').toUpperCase();
    if (!visitorCountry) return true; // Can't determine, allow

    var countries = target.toUpperCase().split(',').map(function (c) { return c.trim(); });
    return countries.indexOf(visitorCountry) !== -1;
  }

  function checkUtm(bar) {
    var reqSource = bar.dataset.utmSource || '';
    var reqMedium = bar.dataset.utmMedium || '';
    var reqCampaign = bar.dataset.utmCampaign || '';
    if (!reqSource && !reqMedium && !reqCampaign) return true;

    // Check URL params first, then sessionStorage (persisted from landing)
    var params = new URLSearchParams(window.location.search);
    var source = params.get('utm_source') || '';
    var medium = params.get('utm_medium') || '';
    var campaign = params.get('utm_campaign') || '';

    // Persist UTM on landing
    try {
      if (source) sessionStorage.setItem('ap_utm_source', source);
      if (medium) sessionStorage.setItem('ap_utm_medium', medium);
      if (campaign) sessionStorage.setItem('ap_utm_campaign', campaign);

      source = source || sessionStorage.getItem('ap_utm_source') || '';
      medium = medium || sessionStorage.getItem('ap_utm_medium') || '';
      campaign = campaign || sessionStorage.getItem('ap_utm_campaign') || '';
    } catch (e) {}

    if (reqSource && source.toLowerCase() !== reqSource.toLowerCase()) return false;
    if (reqMedium && medium.toLowerCase() !== reqMedium.toLowerCase()) return false;
    if (reqCampaign && campaign.toLowerCase() !== reqCampaign.toLowerCase()) return false;
    return true;
  }

  function checkMinPageViews(bar) {
    var min = parseInt(bar.dataset.minPageViews, 10) || 0;
    if (min <= 0) return true;

    var count = 1;
    try {
      count = parseInt(sessionStorage.getItem('ap_page_views') || '0', 10) + 1;
      sessionStorage.setItem('ap_page_views', count.toString());
    } catch (e) {}

    return count >= min;
  }

  function shouldShowBar(bar) {
    if (!checkPageTarget(bar)) return false;
    if (!checkVisitorTarget(bar)) return false;
    if (!checkDeviceTarget(bar)) return false;
    if (!checkUrlTarget(bar)) return false;
    if (!checkCustomerStatus(bar)) return false;
    if (!checkSchedule(bar)) return false;
    if (!checkActiveDays(bar)) return false;
    if (!checkCustomerTags(bar)) return false;
    if (!checkCountry(bar)) return false;
    if (!checkUtm(bar)) return false;
    if (!checkMinPageViews(bar)) return false;
    return true;
  }

  function setupScrollTrigger(bar, callback) {
    var trigger = parseInt(bar.dataset.scrollTrigger, 10) || 0;
    if (trigger <= 0) { callback(); return; }

    bar.style.display = 'none';
    var fired = false;

    function onScroll() {
      if (fired) return;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var pct = (scrollTop / docHeight) * 100;
      if (pct >= trigger) {
        fired = true;
        bar.style.display = '';
        callback();
        window.removeEventListener('scroll', onScroll);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function setupExitIntent(bar) {
    if (bar.dataset.exitIntent !== 'true') return;

    var fired = false;
    bar.style.display = 'none';

    document.addEventListener('mouseleave', function (e) {
      if (fired) return;
      if (e.clientY < 10) {
        fired = true;
        bar.style.display = '';
        bar.classList.remove('ap-hidden');
        try { sessionStorage.setItem('ap_exit_intent_' + (bar.id || 'default'), '1'); } catch (ex) {}
      }
    });

    // On mobile, use visibilitychange as a proxy
    document.addEventListener('visibilitychange', function () {
      if (fired) return;
      if (document.visibilityState === 'hidden') {
        fired = true;
        bar.style.display = '';
        bar.classList.remove('ap-hidden');
      }
    });
  }

  function applyDelay(bar, callback) {
    var delay = parseInt(bar.dataset.delay, 10) || 0;
    if (delay > 0) {
      bar.style.display = 'none';
      setTimeout(function () {
        bar.style.display = '';
        callback();
      }, delay * 1000);
    } else {
      callback();
    }
  }

  function readSettings(bar) {
    var threshold = parseInt(bar.dataset.threshold, 10);
    if (!threshold || threshold === 0) {
      console.warn('[AnnouncePlus] No threshold set, defaulting to $50.00');
      threshold = DEFAULT_THRESHOLD;
    }

    return {
      type: bar.dataset.type || 'topbar',
      threshold: threshold,
      message: bar.dataset.message || 'Spend {amount} more for free shipping!',
      success: bar.dataset.success || "You've unlocked free shipping!",
      currency: bar.dataset.currency || '$',
      showPercentage: bar.dataset.showPercentage === 'true',
    };
  }

  function formatAmount(cents, currency) {
    var dollars = cents / 100;
    return dollars % 1 === 0
      ? currency + dollars.toFixed(0)
      : currency + dollars.toFixed(2);
  }

  async function fetchCart() {
    try {
      var res = await fetch('/cart.js', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  function updateShippingBar(bar, cartTotal) {
    var settings = readSettings(bar);
    var threshold = settings.threshold;
    var remaining = Math.max(threshold - cartTotal, 0);
    var percentage = Math.min((cartTotal / threshold) * 100, 100);

    var textEl = bar.querySelector('.ap-bar-text');
    var fillEl = bar.querySelector('.ap-bar-fill');
    var trackEl = bar.querySelector('.ap-bar-track');

    if (!textEl || !fillEl || !trackEl) return;

    if (remaining === 0) {
      textEl.textContent = settings.success;
      fillEl.style.width = '100%';
      trackEl.classList.add('ap-track-hidden');
      bar.classList.add('ap-success');
      bar.classList.remove('ap-progress');
    } else {
      var formattedAmount = formatAmount(remaining, settings.currency);
      var msg = settings.message.replace('{amount}', formattedAmount);
      if (settings.showPercentage) {
        msg += ' (' + Math.round(percentage) + '% there)';
      }
      textEl.textContent = msg;
      fillEl.style.width = percentage.toFixed(1) + '%';
      trackEl.setAttribute('aria-valuenow', Math.round(percentage));
      trackEl.classList.remove('ap-track-hidden');
      bar.classList.remove('ap-success');
      bar.classList.add('ap-progress');
    }
  }

  function updateAllShippingBars(cartTotal) {
    shippingBars.forEach(function (bar) {
      updateShippingBar(bar, cartTotal);
    });
  }

  async function refreshCart() {
    var cart = await fetchCart();
    if (!cart) return;

    var total = cart.total_price;
    if (total === lastCartTotal) return;
    lastCartTotal = total;
    updateAllShippingBars(total);
  }

  function setupCloseButton(bar) {
    var closeBtn = bar.querySelector('.ap-bar-close');
    if (!closeBtn) return;

    var barId = bar.id || 'default';
    closeBtn.addEventListener('click', function () {
      bar.classList.add('ap-hidden');
      try {
        sessionStorage.setItem(STORAGE_PREFIX + barId, '1');
      } catch (e) {}
    });
  }

  function isBarClosed(bar) {
    var barId = bar.id || 'default';
    try {
      return sessionStorage.getItem(STORAGE_PREFIX + barId) === '1';
    } catch (e) {
      return false;
    }
  }

  function setupCartListeners() {
    var cartEvents = [
      'cart:updated',
      'cart:refresh',
      'cart:change',
      'theme:cart:updated',
      'cart-drawer:open',
    ];

    cartEvents.forEach(function (eventName) {
      document.addEventListener(eventName, refreshCart);
    });

    var observer = new MutationObserver(function (mutations) {
      var cartSelectors = [
        '[data-cart-count]',
        '[data-cart-item-count]',
        '.cart-count',
        '.cart__count',
        '#cart-icon-bubble',
      ];

      var changed = mutations.some(function (mutation) {
        return cartSelectors.some(function (sel) {
          return (
            (mutation.target.matches && mutation.target.matches(sel)) ||
            (mutation.target.querySelector && mutation.target.querySelector(sel))
          );
        });
      });

      if (changed) refreshCart();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  function startPolling() {
    pollTimer = setInterval(refreshCart, POLL_INTERVAL);
  }

  function setupRunningLine(bar) {
    bar.classList.add('ap-running');
    var speed = parseInt(bar.dataset.rotationSpeed, 10) || 15;
    var direction = bar.dataset.marqueeDirection || 'ltr';
    bar.style.setProperty('--ap-marquee-speed', speed + 's');
    if (direction === 'rtl') {
      bar.classList.add('ap-rtl');
    }

    var textEl = bar.querySelector('.ap-bar-text');
    var inner = bar.querySelector('.ap-bar-inner');
    if (!textEl || !inner) return;

    var original = textEl.textContent.trim();
    inner.innerHTML = '';

    // Create track
    var track = document.createElement('div');
    track.className = 'ap-marquee-track';

    // Measure one copy to know how many we need
    var measure = document.createElement('span');
    measure.className = 'ap-marquee-item';
    measure.textContent = original;
    measure.style.visibility = 'hidden';
    measure.style.position = 'absolute';
    inner.appendChild(measure);
    var itemWidth = measure.offsetWidth + 80; // 80 = 40px padding each side
    inner.removeChild(measure);

    // Need enough copies so total width >= 2x viewport
    var copies = Math.max(4, Math.ceil((window.innerWidth * 2) / itemWidth) + 2);

    for (var i = 0; i < copies; i++) {
      var span = document.createElement('span');
      span.className = 'ap-marquee-item';
      span.textContent = original;
      track.appendChild(span);
    }

    inner.appendChild(track);

    // Start animation after layout
    requestAnimationFrame(function () {
      bar.classList.add('ap-marquee-ready');
    });
  }

  function setupRotatingMessages(bar) {
    var messagesAttr = bar.dataset.rotatingMessages;
    if (!messagesAttr) return;

    var messages;
    try {
      messages = JSON.parse(messagesAttr);
    } catch (e) {
      return;
    }
    if (!Array.isArray(messages) || messages.length < 2) return;

    var speed = parseInt(bar.dataset.rotationSpeed, 10) || 4;
    var animation = bar.dataset.rotationAnimation || 'fade';
    var textEl = bar.querySelector('.ap-bar-text');
    if (!textEl) return;

    var index = 0;
    textEl.textContent = messages[0];

    setInterval(function () {
      index = (index + 1) % messages.length;

      if (animation === 'slide-up') {
        textEl.style.transition = 'opacity 0.3s, transform 0.3s';
        textEl.style.opacity = '0';
        textEl.style.transform = 'translateY(-10px)';
        setTimeout(function () {
          textEl.textContent = messages[index];
          textEl.style.transform = 'translateY(10px)';
          setTimeout(function () {
            textEl.style.opacity = '1';
            textEl.style.transform = 'translateY(0)';
          }, 50);
        }, 300);
      } else if (animation === 'slide-down') {
        textEl.style.transition = 'opacity 0.3s, transform 0.3s';
        textEl.style.opacity = '0';
        textEl.style.transform = 'translateY(10px)';
        setTimeout(function () {
          textEl.textContent = messages[index];
          textEl.style.transform = 'translateY(-10px)';
          setTimeout(function () {
            textEl.style.opacity = '1';
            textEl.style.transform = 'translateY(0)';
          }, 50);
        }, 300);
      } else {
        // fade (default)
        textEl.style.transition = 'opacity 0.4s';
        textEl.style.opacity = '0';
        setTimeout(function () {
          textEl.textContent = messages[index];
          textEl.style.opacity = '1';
        }, 400);
      }
    }, speed * 1000);
  }

  async function trackView(bar) {
    var shop = window.Shopify && window.Shopify.shop;
    var barId = bar.dataset.barId;
    var appUrl = bar.dataset.appUrl;

    console.log('[AnnouncePlus] trackView:', { shop: shop, barId: barId, appUrl: appUrl });
    if (!shop || !barId || !appUrl) {
      console.warn('[AnnouncePlus] trackView skipped — missing:', !shop ? 'shop' : '', !barId ? 'barId' : '', !appUrl ? 'appUrl' : '');
      return;
    }

    var storageKey = 'ap_tracked_' + barId + '_' +
      new Date().toISOString().slice(0, 10);

    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, '1');
    } catch (e) {}

    try {
      var res = await fetch(appUrl + '/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop: shop, barId: barId }),
      });

      var data = await res.json();

      if (data.reason === 'limit_reached') {
        bar.classList.add('ap-hidden');
        console.log('[AnnouncePlus] Monthly view limit reached');
      }
    } catch (e) {
      // silently fail — never break the storefront
    }
  }

  function updateCartStateBars(cart) {
    cartStateBars.forEach(function (bar) {
      var show = checkCartState(bar, cart) && checkCartValue(bar, cart) && checkCartItemCount(bar, cart);
      if (show) {
        bar.classList.remove('ap-hidden');
      } else {
        bar.classList.add('ap-hidden');
      }
    });
  }

  async function init() {
    var bars = document.querySelectorAll('.announceplus-bar');
    if (!bars.length) return;

    console.log('[AnnouncePlus] Found', bars.length, 'bar(s). Initialising...');

    // Fetch cart upfront for cart-based targeting
    var cart = await fetchCart();

    bars.forEach(function (bar) {
      // Check if bar was dismissed
      if (isBarClosed(bar)) {
        bar.classList.add('ap-hidden');
        return;
      }

      // Run targeting checks
      if (!shouldShowBar(bar)) {
        bar.classList.add('ap-hidden');
        return;
      }

      // Check cart-based targeting (state, value, item count)
      var needsCartWatch = false;
      var cartState = bar.dataset.cartState || 'any';
      var hasValueRule = (parseFloat(bar.dataset.cartValueMin) || 0) > 0 || (parseFloat(bar.dataset.cartValueMax) || 0) > 0;
      var hasItemRule = (parseInt(bar.dataset.cartItemMin, 10) || 0) > 0 || (parseInt(bar.dataset.cartItemMax, 10) || 0) > 0;

      if (cartState !== 'any' || hasValueRule || hasItemRule) {
        needsCartWatch = true;
        cartStateBars.push(bar);
        if (!checkCartState(bar, cart) || !checkCartValue(bar, cart) || !checkCartItemCount(bar, cart)) {
          bar.classList.add('ap-hidden');
          return;
        }
      }

      // Apply scroll trigger, then delay, then show
      var scrollTrigger = parseInt(bar.dataset.scrollTrigger, 10) || 0;

      var showBar = function () {
        applyDelay(bar, function () {
        setupCloseButton(bar);

        var settings = readSettings(bar);
        var subtype = bar.dataset.subtype || 'simple';

        if (settings.type === 'shipping_goal') {
          shippingBars.push(bar);
        } else if (settings.type === 'topbar') {
          if (subtype === 'running') {
            setupRunningLine(bar);
          } else if (subtype === 'rotating') {
            setupRotatingMessages(bar);
          }
        }

        bar.setAttribute('data-ap-ready', 'true');
        trackView(bar);
        });
      };

      // Exit intent bars stay hidden until triggered
      if (bar.dataset.exitIntent === 'true') {
        setupExitIntent(bar);
      } else if (scrollTrigger > 0) {
        setupScrollTrigger(bar, showBar);
      } else {
        showBar();
      }
    });

    // If there are shipping bars or cart-state bars, set up cart listeners
    if (shippingBars.length > 0 || cartStateBars.length > 0) {
      if (cart) {
        lastCartTotal = cart.total_price;
        lastCartItemCount = cart.item_count;
        updateAllShippingBars(cart.total_price);
      }

      // Override refreshCart to also update cart state bars
      var origRefreshCart = refreshCart;
      refreshCart = async function () {
        var c = await fetchCart();
        if (!c) return;

        var total = c.total_price;
        if (total !== lastCartTotal) {
          lastCartTotal = total;
          updateAllShippingBars(total);
        }

        if (c.item_count !== lastCartItemCount) {
          lastCartItemCount = c.item_count;
          updateCartStateBars(c);
        }
      };

      setupCartListeners();
      startPolling();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
