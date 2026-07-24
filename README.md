# Phool with Love — Website + Admin Panel

## What's in this folder

| File | What it's for |
|---|---|
| `index.html` | Your public website — what customers see. |
| `admin.html` | Your private admin panel — log in to add, edit, or delete products. **Don't link to this from your public site or share the URL publicly**; it's meant to be a bookmark only you use. |
| `firebase-config.js` | The one file you edit to connect everything to your own free Firebase project. |
| `firestore.rules` | Paste into Firebase Console so only you can change product data. |
| `storage.rules` | Paste into Firebase Console so only you can upload/delete photos. |
| `supabase-config.js` | The one file you edit to connect the chat assistant (bottom-right bubble) to your Supabase project. |
| `supabase/functions/chatbot/` | The server-side code for the chat assistant — deployed to Supabase, keeps your Gemini API key private. |

Until you complete the setup below, `index.html` still works perfectly on its own —
it shows the same 10 products it does today. The admin panel simply won't be able
to log in yet. Nothing breaks in the meantime.

## Setup (about 10–15 minutes, no coding)

1. **Create a free Firebase project**
   Go to [console.firebase.google.com](https://console.firebase.google.com) → "Add project" →
   name it anything (e.g. `phool-with-love`) → you can skip Google Analytics → Create.

2. **Turn on email/password login**
   Left sidebar → Build → **Authentication** → Get Started → "Sign-in method" tab →
   enable **Email/Password**.

3. **Create your own admin login**
   Still in Authentication → "Users" tab → **Add user** → enter the email and
   password *you* want to log into `admin.html` with. There's no public sign-up —
   only accounts you create here can log in.

4. **Turn on the database**
   Build → **Firestore Database** → Create database → "Start in production mode" →
   pick a region (anything in/near India is fine).

5. **Turn on photo storage**
   Build → **Storage** → Get started → "production mode".

6. **Get your project's connection details**
   Click the ⚙️ gear icon (top left) → **Project settings** → scroll to "Your apps" →
   click the `</>` (web) icon → give the app any nickname → **you do not need
   Firebase Hosting checked** → Register app. It will show you a block of code
   with values like `apiKey`, `authDomain`, etc. — copy those.

7. **Paste your details into `firebase-config.js`**
   Open that file in any text editor, replace the six `PASTE_YOUR_...` placeholders
   with the real values from step 6, and save.

8. **Lock down the rules**
   - Firestore Database → "Rules" tab → delete what's there → paste the contents
     of `firestore.rules` → Publish.
   - Storage → "Rules" tab → delete what's there → paste the contents of
     `storage.rules` → Publish.

9. **Upload all five files to your web host**, keeping them in the same folder
   together (they refer to each other by filename).

10. **Open `admin.html` in your browser**, log in with the email/password from
    step 3, and click **"Import Existing Catalog"** once — this brings your
    current 10 products (with their real photos) into the new database.
    From then on, anything you add, edit, or delete in `admin.html` updates
    `index.html` automatically — no re-uploading files, no messaging me.

## Newsletter signups

The "Get first look at new bouquets" email form on the site now saves each
email into a `subscribers` collection in your Firestore database (once you've
completed the setup above) instead of just showing a thank-you message. You
can view collected emails anytime in the Firebase Console under Firestore
Database → subscribers. The rules in `firestore.rules` let visitors add their
own email but not read or download the list — only you (logged in) can.

## Chat assistant

There's a chat bubble in the bottom-right of the site that answers customer
questions (prices, delivery, customisation, policies) using Groq and only the
company info baked into `supabase/functions/chatbot/index.ts` (the same
details from this site — products, story, process, policies, contact). It
never invents products or prices that aren't listed there.

**Important: your Groq API key must never be pasted into any file in this
project or shared in chat/email.** It's kept entirely on Supabase's servers,
set as a secret — the website itself never sees it.

This project is currently deployed on Supabase as a function named
`phool-with-love-chatbot` (project ref `yygbgthbxikboxwrhriy`). To update it
after changing `supabase/functions/chatbot/index.ts`:

1. Go to the [Supabase dashboard](https://supabase.com/dashboard/project/yygbgthbxikboxwrhriy/functions) →
   **Edge Functions** → `phool-with-love-chatbot` → open its code editor.
2. Replace the code with the updated contents of
   `supabase/functions/chatbot/index.ts` and click **Deploy**.
3. Make sure **"Enforce JWT Verification"** is switched **off** for this
   function (it needs to answer anonymous site visitors, not logged-in users).
4. Get an API key from [console.groq.com/keys](https://console.groq.com/keys),
   then under **Settings → Edge Functions → Manage secrets**, set:
   - `GROQ_API_KEY` — your key
   - `GROQ_MODEL` *(optional)* — only needed if the default model stops
     working; check [console.groq.com/docs/models](https://console.groq.com/docs/models)
     for current model names.
5. The chat bubble already points at
   `https://yygbgthbxikboxwrhriy.supabase.co/functions/v1/phool-with-love-chatbot`
   via `supabase-config.js` — no further changes needed once the above is done.

If you ever move this to a brand new Supabase project instead, repeat the
steps above there and update the URL in `supabase-config.js` to match.

To update what the assistant knows (e.g. new products, updated prices), edit
the `KNOWLEDGE_BASE` text in `supabase/functions/chatbot/index.ts` and re-run
step 5 to redeploy.

## A note on security

Nothing in `firebase-config.js` is secret — Firebase's web config is designed to
be public. What actually protects your data is the two `.rules` files: they tell
Firebase "anyone can *look*, only a logged-in admin can *change*." As long as you
paste those rules in and don't share your `admin.html` password, only you can
edit products.

## If something doesn't work

Open your browser's console (right-click → Inspect → Console tab) on whichever
page is misbehaving — Firebase always prints a clear error there (usually a
rules issue or a typo'd config value). Send me a screenshot of that error and
I can tell you exactly what to fix.

## Hosting

This still needs somewhere to live on the internet. Firebase itself offers free
hosting that pairs naturally with what you've just set up (Build → Hosting in
the same console), or any host that serves plain HTML files works too.
