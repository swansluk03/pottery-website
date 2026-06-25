#!/usr/bin/env node

console.log(`
Resend setup for Barn Owl Pottery
=================================

Your site is already configured to:
  • Send FROM:  Barn Owl Pottery <hello@barnowlpottery.com>
  • Deliver TO: barnowlpottery@gmail.com

Follow these steps in order.

Step 1 — Create a Resend account
--------------------------------
1. Go to https://resend.com/signup
2. Sign up with barnowlpottery@gmail.com (important for testing)
3. Confirm your email

Step 2 — Create an API key
--------------------------
1. Open https://resend.com/api-keys
2. Click "Create API Key"
3. Name it "Pottery Website"
4. Permission: "Sending access" is enough
5. Copy the key (starts with re_)

Step 3 — Add the API key to this project
----------------------------------------
Local (.env.local):
  RESEND_API_KEY=re_your_key_here

Vercel (Production + Preview):
  npx vercel env update RESEND_API_KEY production --value "re_your_key_here" --yes
  npx vercel env update RESEND_API_KEY preview --value "re_your_key_here" --yes

Then verify:
  npm run check:email

Step 4 — Verify barnowlpottery.com in Resend
--------------------------------------------
Required before hello@barnowlpottery.com can send mail.

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter: barnowlpottery.com
4. Resend shows DNS records (SPF + DKIM). Add them wherever you manage DNS
   (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.)
5. Click "Verify DNS Records" in Resend
6. Wait until status shows "Verified" (often 5–30 minutes)

Tip: If your website DNS is on Vercel, you can add the Resend records there too
under Project → Settings → Domains → barnowlpottery.com → DNS.

Step 5 — Deploy and test
------------------------
1. Redeploy on Vercel (env changes need a new deployment)
2. Open your live site → /contact
3. Submit a test message
4. Check barnowlpottery@gmail.com (and spam folder)

Optional — Test before domain verification
------------------------------------------
If you want to test immediately while DNS propagates:
1. Temporarily set in .env.local and Vercel:
     EMAIL_FROM="Barn Owl Pottery <onboarding@resend.dev>"
   (Keep CONTACT_EMAIL=barnowlpottery@gmail.com)
2. Resend only allows this test sender to deliver to your signup email
3. After the domain is verified, switch EMAIL_FROM back to:
     Barn Owl Pottery <hello@barnowlpottery.com>

Need help after you create the API key?
Paste it here (or add it to .env.local yourself) and ask to verify the setup.
`);
