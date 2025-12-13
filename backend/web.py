# webhook_server.py  --> Run this on port 3000
from flask import Flask, request
import requests
import os

app = Flask(__name__)

# === CONFIGURATION ===
VERIFY_TOKEN = "sanjay"  # Must match what you set in Meta dashboard
WHATSAPP_TOKEN = "EAAjdxmX0ZA78BQFakg9MmOduZCiD9miOZCG80JlmZCiDA4Mc2KjjtJkL9JMGhy6BPB67mkJq5oLH1wXaew7ISa0ZA8atSl2tkBGvbmpz6XCuhY5ZCefOYrQkHkSrMWGBiZAjaBO0j3UGN61bE1vv7nb0jGofxYy4QYktM1XZCDJ6DvUYm30tie9bi4nIexfdZA4DYJU8dSoTtwt68nPqvuHqROClY99KEnCeO13jrT5V4mkbXLRzQMNHcFY0obiFGAos5ygZC3B4LI1nwiiZC0M2ZCgf"

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
            # Format Law References
            law_references = bot_data.get('law_reference', ['Not available'])
            formatted_laws = []
            for doc in law_references:
                if isinstance(doc, dict):
                    # Act/Section in Bold, Description in Italics on next line
                    formatted_laws.append(f"⚖️ *{doc.get('act', '')} {doc.get('section', '')}*\n_{doc.get('description', '')}_")
                else:
                    formatted_laws.append(f"⚖️ {doc}")

            reply_text = (
                f"🚨 *DETECTED CRIME* 🚨\n"
                f"``` {bot_data.get('primary_category', 'Unknown').upper()} ```\n\n"
                
                f"🧐 _Reasoning_\n"
                f"> {bot_data.get('reasoning', 'Unknown')}\n\n"
                
                f"� *REQUIRED DOCUMENTS*\n" +
                "\n".join([f"• {doc}" for doc in bot_data.get('required_documents', ['Not available'])]) +
                "\n\n" +
                
                f"🏛️ *GOV. SUBMISSIONS*\n" +
                "\n".join([f"• {doc}" for doc in bot_data.get('gov_documents_to_submit', ['Not available'])]) +
                "\n\n" +
                
                f"� *REALISTIC EXAMPLES*\n" +
                "\n".join([f"• _{doc}_" for doc in bot_data.get('realistic_examples', ['Not available'])]) +
                "\n\n" +
                
                f"� *LAW REFERENCES*\n" +
                "\n".join(formatted_laws)
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
    app.run(host="0.0.0.0", port=3000, debug=True)