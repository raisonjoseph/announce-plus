// AnnouncePlus Bar — announceplus-bar.js
// AnnouncePlus by Makerbase — makerbase.app

(function () {
  'use strict';

  var STORAGE_PREFIX = 'ap_bar_closed_';
  var POLL_INTERVAL = 3000;
  var DEFAULT_THRESHOLD = 5000;

  var lastCartTotal = null;
  var pollTimer = null;
  var shippingBars = [];

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

  async function init() {
    var bars = document.querySelectorAll('.announceplus-bar');
    if (!bars.length) return;

    console.log('[AnnouncePlus] Found', bars.length, 'bar(s). Initialising...');

    bars.forEach(function (bar) {
      if (isBarClosed(bar)) {
        bar.classList.add('ap-hidden');
        return;
      }

      setupCloseButton(bar);

      var settings = readSettings(bar);
      if (settings.type === 'shipping_goal') {
        shippingBars.push(bar);
      } else if (settings.type === 'topbar') {
        setupRotatingMessages(bar);
      }

      bar.setAttribute('data-ap-ready', 'true');
      trackView(bar);
    });

    // If there are shipping bars, fetch cart and start listeners
    if (shippingBars.length > 0) {
      var cart = await fetchCart();
      if (cart) {
        lastCartTotal = cart.total_price;
        updateAllShippingBars(cart.total_price);
      }

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
