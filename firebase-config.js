/*
  Phool with Love — Firebase configuration
  =========================================
  This is the ONLY file you need to edit to connect your website to your
  own Firebase project. Nothing in here is secret — Firebase's web config
  is meant to be public; your data is protected by the Security Rules you
  set up in the Firebase Console instead.

  HOW TO GET THESE VALUES (about 10 minutes, no coding):
  1. Go to https://console.firebase.google.com and click "Add project".
     Name it anything, e.g. "phool-with-love". You can skip Google Analytics.
  2. In the left sidebar: Build > Authentication > Get Started >
     "Sign-in method" tab > enable "Email/Password".
  3. Still in Authentication: go to the "Users" tab > "Add user" >
     enter the email + password YOU (the shop owner) will log in with.
     This is your admin login — there is no public sign-up page.
  4. Build > Firestore Database > Create database > Start in
     "production mode" > pick any region close to India.
  5. Build > Storage > Get started > "production mode".
  6. Click the gear icon (top left) > Project settings > scroll to
     "Your apps" > click the </> (web) icon > register an app (any nickname,
     you do NOT need Firebase Hosting) > copy the "firebaseConfig" object
     it shows you > paste the values below, replacing the placeholders.
  7. In Firestore, go to the "Rules" tab and paste the rules from
     firestore.rules (included alongside this file), then Publish.
  8. In Storage, go to the "Rules" tab and paste the rules from
     storage.rules (included alongside this file), then Publish.

  Once this file has your real values, both index.html (the public site)
  and admin.html (your control panel) will connect automatically.
*/

window.FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT_ID_HERE.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_PROJECT_ID_HERE.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};
