# AnnouncePlus — Deployment Guide
# Vercel + Turso

## Step 1 — Create Turso database

Install Turso CLI:
  brew install tursodatabase/tap/turso

Login:
  turso auth login

Create database:
  turso db create announceplus

Get URL:
  turso db show announceplus --url

Get auth token:
  turso db tokens create announceplus

Push schema to Turso:
  TURSO_DATABASE_URL="libsql://YOUR_DB_URL" npx prisma db push

## Step 2 — Deploy to Vercel

Install Vercel CLI:
  npm i -g vercel

Login:
  vercel login

Deploy:
  vercel --prod

## Step 3 — Set environment variables on Vercel

Go to: vercel.com → announceplus → Settings → Environment Variables

Add these:
  SHOPIFY_API_KEY          = from Partner dashboard
  SHOPIFY_API_SECRET       = from Partner dashboard
  SHOPIFY_APP_URL          = https://announceplus.vercel.app
  DATABASE_URL             = libsql://YOUR_DB_URL (same as TURSO_DATABASE_URL)
  TURSO_DATABASE_URL       = from turso db show
  TURSO_AUTH_TOKEN         = from turso db tokens create
  SESSION_SECRET           = any random 32-char string
  SCOPES                   = read_products,write_metaobjects,read_metaobjects

## Step 4 — Update Shopify Partner dashboard

Go to: partners.shopify.com → Apps → AnnouncePlus → App setup → URLs

Change all URLs from localhost:3000 to:
  https://announceplus.vercel.app

App URL:
  https://announceplus.vercel.app

Redirect URLs:
  https://announceplus.vercel.app/auth/callback
  https://announceplus.vercel.app/auth/shopify/callback
  https://announceplus.vercel.app/api/auth/callback

## Step 5 — Update shopify.app.toml

  application_url = "https://announceplus.vercel.app"

  [auth]
    redirect_urls = [
      "https://announceplus.vercel.app/auth/callback",
      "https://announceplus.vercel.app/auth/shopify/callback",
      "https://announceplus.vercel.app/api/auth/callback"
    ]

Then run: shopify app deploy

## Step 6 — Redeploy with correct URL

After updating Partner dashboard:
  vercel --prod

## Step 7 — Test

Visit: https://announceplus.vercel.app
Install on dev store and verify everything works.
