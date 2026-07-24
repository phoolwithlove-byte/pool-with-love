// Phool with Love — chat assistant Edge Function
// =================================================
// Proxies chat messages to Groq, grounded only in this company's own info
// (products, story, policies, contact). The Groq API key is read from an
// environment secret and never appears in this file or in the browser.
//
// Deploy via the Supabase dashboard (Edge Functions → phool-with-love-chatbot → editor),
// or with the CLI:
//   supabase functions deploy phool-with-love-chatbot --no-verify-jwt
// Set the key with (in the dashboard, under Manage secrets — never in this file):
//   GROQ_API_KEY = your real key from https://console.groq.com/keys
// Optional: GROQ_MODEL to override the default model (check https://console.groq.com/docs/models
// for the current list if the default below stops working).

const KNOWLEDGE_BASE = `
Company: Phool with Love
Location: HSR 27th Main, Bengaluru, India. Ships pan-India.
Hours: Mon-Sun, 10:00 AM - 8:00 PM
Contact: WhatsApp +91 96065 25054, email shabrinakmal17@gmail.com
Established: 2026

About: Phool with Love makes handcrafted pipe-cleaner and plush fabric flower bouquets,
gift hampers, and custom floral arrangements, designed to last for years instead of
wilting like fresh flowers. Every piece is hand-shaped stem by stem in a small HSR
Layout studio, so no two are ever quite identical. Good for birthdays, weddings,
anniversaries, graduations, or any everyday gift.

How ordering works:
1. Pick a ready-made bouquet from the shop, or start a custom order (colours, occasion, budget).
2. It is hand-crafted to order, usually within 2-5 business days.
3. Packed carefully for shipping, no water or refrigeration needed.
4. Shipped pan-India; delivery timelines vary by location.
Custom orders may require full or partial advance payment.

Products (10 items):
- Lilies Bouquet - Rs.160 (Bouquet, colours customisable)
- Sunflowers Bouquet - Rs.190 (Bouquet)
- Mini Tulips Bouquet - Rs.100 (Bouquet, colours customisable)
- Gerbera Mini Pot - Rs.250 (Mini Pot, colours customisable)
- Sunflower Mini Pot - Rs.250 (Mini Pot, colours customisable)
- Lily Mini Pot - Rs.330 (Mini Pot, colours customisable)
- Flower Sleeve - Rs.150 (Gift, colours customisable)
- Flower Card - Rs.150 (Gift, colours customisable)
- Lily Keychain - Rs.79 (Keychain, colours customisable)
- Flower Keychain - Rs.100 (Keychain, colours customisable)

Policies:
- Ships across India, 2-5 day processing before shipping.
- Handmade items are non-returnable unless damaged; damage must be reported within
  24 hours of delivery.
- Advance payment may apply to custom orders.
- Colours may vary slightly by screen.
- Checkout happens via WhatsApp: customers add items to the cart on the site, then
  tap "Order via WhatsApp" to confirm with the team.
`.trim();

const SYSTEM_INSTRUCTION = `You are the friendly shop assistant for Phool with Love, a handmade flower bouquet business in Bengaluru, India. Answer customer questions using ONLY the company information provided below. Be warm, concise (a few sentences at most), and helpful. If asked something you can't answer from this information (e.g. real-time order status, live stock levels), say so honestly and point them to WhatsApp (+91 96065 25054) or email (shabrinakmal17@gmail.com). Never invent prices, policies, or products that aren't listed below.

COMPANY INFORMATION:
${KNOWLEDGE_BASE}`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ChatTurn {
  role: string;
  text: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Chatbot is not configured yet." }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { message?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return new Response(JSON.stringify({ error: "Missing 'message'." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const history: ChatTurn[] = Array.isArray(body.history) ? body.history : [];
  const messages = [
    { role: "system", content: SYSTEM_INSTRUCTION },
    ...history.slice(-10).map((turn) => ({
      role: turn.role === "bot" ? "assistant" : "user",
      content: String(turn.text || "").slice(0, 2000),
    })),
    { role: "user", content: message.slice(0, 2000) },
  ];

  const model = Deno.env.get("GROQ_MODEL") || "llama-3.3-70b-versatile";

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    if (!groqRes.ok) {
      console.error("Groq error:", await groqRes.text());
      return new Response(JSON.stringify({ error: "Could not reach the assistant right now." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await groqRes.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't come up with an answer to that — try WhatsApp for a quick reply!";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
