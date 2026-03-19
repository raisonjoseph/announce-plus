# AnnouncePlus Deployment Checklist

## Pre-deploy
- [ ] fly apps create announceplus
- [ ] fly volumes create announceplus_data --region sin --size 1
- [ ] fly secrets set (all secrets)
- [ ] Update shopify.app.toml with production URLs
- [ ] Commit all changes to git

## Deploy
- [ ] fly deploy --remote-only
- [ ] fly status (confirm running)
- [ ] fly logs (check for errors)

## Post-deploy
- [ ] Update Shopify Partner dashboard URLs
- [ ] Visit https://announceplus.fly.dev
- [ ] Install app on dev store using new URL
- [ ] Test creating an announcement
- [ ] Test the bar shows on storefront
- [ ] Test view tracking
- [ ] Test setup guide embed verification

## Go live
- [ ] Submit app listing on Partner dashboard
- [ ] Upload app icon (announceplus-icon.svg)
- [ ] Upload screenshots
- [ ] Set pricing plans
- [ ] Submit for Shopify review
