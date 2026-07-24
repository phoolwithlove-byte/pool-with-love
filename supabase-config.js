/*
  Phool with Love — Chat assistant configuration
  =================================================
  This connects the website's chat widget (bottom-right bubble) to a Supabase Edge
  Function that talks to Gemini on the server side. Nothing in this file is secret —
  it's just the public URL of your deployed function. Your actual Gemini API key is
  NEVER put in this file or anywhere in this website's code; it lives only inside
  Supabase, set via the CLI (see below).

  SETUP (about 10 minutes):
  1. Create a free project at https://supabase.com if you don't have one yet.
  2. Install the Supabase CLI: https://supabase.com/docs/guides/cli
  3. From a terminal, inside this folder's `supabase/` directory:
       supabase login
       supabase link --project-ref YOUR_PROJECT_REF   (find this in your project's URL/settings)
  4. Set your Gemini API key as a server-side secret — replace with your real key,
     and get a fresh one from https://aistudio.google.com/apikey if you're not sure
     the one you have is still private:
       supabase secrets set GEMINI_API_KEY=your_real_key_here
  5. Deploy the function:
       supabase functions deploy chatbot --no-verify-jwt
  6. Your function URL will look like:
       https://YOUR_PROJECT_REF.supabase.co/functions/v1/chatbot
     Paste that below, replacing the placeholder.
*/

window.SUPABASE_CHATBOT_URL = "https://yygbgthbxikboxwrhriy.supabase.co/functions/v1/phool-with-love-chatbot";
