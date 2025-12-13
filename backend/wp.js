const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// 🔑 Replace with your credentials
const VERIFY_TOKEN = "shimal007"; // you choose
const WHATSAPP_TOKEN = "EAFd2n0s5wrUBPt316DQUKWJiPeQXc4C0cgb5AgWmLj9XLJ3AyvOMzsxRCgWfu1eodkJGNrM6Vi4FFDx6ceg8CDWnrYCBHqyXDjtVnyQ0B1abEEIECYe82lCwPxWteZBmf5HmD5fzbPEPDdxIZAJxqz7zPRA5KruppqW2cbreiExqyxvPFhKk2MXSHhk3LEwRlASZAoG8WxlRZC53uOZAxZCXZCMRnsZAvIalwtMOPY46vdEZD";
const PHONE_NUMBER_ID = "750497311482070";

// 🔑 Flask App URL (replace with your Flask app URL)
const FLASK_APP_URL = "http://localhost:5000";

// ✅ Webhook verification
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("✅ Webhook verified!");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// ✅ Handle incoming messages
app.post("/webhook", async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0]?.value?.messages?.[0];

        if (changes && changes.text) {
            const from = changes.from; // User's WhatsApp number
            const msgBody = changes.text.body;

            console.log("📩 User said:", msgBody);

            // 🔮 Step 1: Send user's message to Flask app chatbot
            const flaskRes = await axios.post(
                `${FLASK_APP_URL}/whatsapp-ask`,
                {
                    question: msgBody,
                    from: from  // Pass WhatsApp phone number for session management
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const botReply = flaskRes.data.answer;
            console.log("🤖 Bot reply:", botReply);

            // 🔮 Step 2: Send Flask app response back via WhatsApp API
            await axios.post(
                `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: from,
                    text: { body: botReply },
                },
                { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
            );
        }

        res.sendStatus(200);
    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);

        // Send error message to user via WhatsApp
        try {
            await axios.post(
                `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: changes?.from,
                    text: { body: "❌ Sorry, I'm experiencing technical difficulties. Please try again later or contact support." },
                },
                { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
            );
        } catch (whatsappErr) {
            console.error("❌ Failed to send error message:", whatsappErr.message);
        }

        res.sendStatus(500);
    }
});

// ✅ Start server
app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
