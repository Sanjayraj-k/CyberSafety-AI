# webhook_server.py  --> Run this on port 3000
from flask import Flask, request
import requests
import os

app = Flask(__name__)

# === CONFIGURATION ===
VERIFY_TOKEN = "shimal"  # Must match what you set in Meta dashboard
WHATSAPP_TOKEN = "EAAvtZBzAoysYBQHl71ZBDIz6jkXp57OJBdEaZCWJ4oNBwQTsaqmodnOQZBcJOzH9TYoF7tkfF4ZCze6btpo1QloB8qniZCfNZB0mcoNlEYK0nuQG6nXpIZBzLOlFG1mXqx3naaCC3S8ysheb41aH9Xa7IdjYsEUvxTItryJgrQRxGMt1JzzieR6PuOw5sQvIt0DQ4NjXXZCghsB4owyYmMMO8gVszV9v0ZA3aE3Ec56pPV7HNiVK5YFcjhcvQ3M8c3bL4VDwKy62IrIFb3VtcvsaSrIQZDZD"
PHONE_NUMBER_ID = "811439952063416"

# 🔑 IMPORTANT: Change this to your actual public URL or ngrok URL
# Example: "https://your-app.onrender.com" or "https://abc123.ngrok.io"
CHATBOT_API_URL = "http://localhost:5000/classify"   # Change this when deploying!

@app.route("/webhook", methods=["GET"])
def verify_webhook():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        print("✅ Webhook verified!")
        return challenge, 200
    return "Forbidden", 403


@app.route("/webhook", methods=["POST"])
def receive_message():
    try:
        data = request.get_json()
        
        # Extract message
        if not data.get("entry"):
            return "OK", 200
            
        messages = data["entry"][0]["changes"][0]["value"].get("messages", [])
        
        if not messages:
            return "OK", 200
            
        message = messages[0]
        from_number = message["from"]
        msg_body = message.get("text", {}).get("body", "")

        if not msg_body:
            return "OK", 200

        print(f"📩 Received from {from_number}: {msg_body}")

        # === Forward to your AI chatbot on port 5000 ===
        try:
            response = requests.post(
                CHATBOT_API_URL,
                json={"complaint": msg_body},
                headers={"Content-Type": "application/json"},
                timeout=45
            )
            response.raise_for_status()
            bot_data = response.json()

            # Extract the reply text — customize based on your response structure
            # You can make this smarter later (e.g., format lists nicely)
            reply_text = (
                f"🚨 *Detected Crime:* {bot_data.get('primary_category', 'Unknown')}\n\n"
                f"📋 *Required Documents:*\n" +
                "\n".join([f"• {doc}" for doc in bot_data.get('required_documents', ['Not available'])]) +
                "\n\n" +
                f"📄 *Government Documents to Submit:*\n" +
                "\n".join([f"• {doc}" for doc in bot_data.get('gov_documents_to_submit', ['Not available'])]) +
                "\n\n" +
                f"📄 *Realistic Examples:*\n" +
                "\n".join([f"• {doc}" for doc in bot_data.get('realistic_examples', ['Not available'])]) +
                "\n\n" +
                f"📄 *Law Reference:*\n" +
                "\n".join([f"• {doc}" for doc in bot_data.get('law_reference', ['Not available'])])
            )

            if bot_data.get("error"):
                reply_text = "Sorry, I couldn't process your complaint right now. Please try again later."

        except Exception as e:
            print("❌ Error calling chatbot API:", e)
            reply_text = "I'm having trouble processing your message. Please try again in a few minutes."

        # === Send reply back to WhatsApp ===
        whatsapp_url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
        headers = {
            "Authorization": f"Bearer {WHATSAPP_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": from_number,
            "type": "text",
            "text": {"body": reply_text}
        }

        wa_response = requests.post(whatsapp_url, json=payload, headers=headers)
        if wa_response.status_code == 200:
            print("🤖 Reply sent successfully")
        else:
            print("❌ Failed to send WhatsApp message:", wa_response.text)

        return "OK", 200

    except Exception as e:
        print("❌ Error:", str(e))
        return "Error", 500


if __name__ == "__main__":
    # Use port 3000 for webhook
    app.run(host="0.0.0.0", port=4000, debug=True)