# webhook_server.py  --> Run this on port 3000
from flask import Flask, request
import requests
import os

app = Flask(__name__)

# === CONFIGURATION ===
VERIFY_TOKEN = "sanjay"  # Must match what you set in Meta dashboard
WHATSAPP_TOKEN = "EAAjdxmX0ZA78BQLnZCLsZAiO9rr6yjbfEb9Vt6F4JRmhnORtqJglH5xk9HAsxvBKfbHg5fuEOwrgDZCnpYQqZAdsxgZBLnZCXGdZAMl4hZCJPg6NpUiVcyEso6yXeviZAYEz7sWwR60oxQx8q8NPlU6ECqHWvYK4F4cGJae2a1Tz9zee8r75cUJkCclFhx48WPKGVvjgD3TZCT0QIcpthnZAs1cEuvy4wTVSZBGUYb7DwXirZAZAiYTV774q5x24NX6zRuVRCm6ZC1hSM2NeXN1AZAaZBgBBOd"
PHONE_NUMBER_ID = "929139663615397"

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

            # === ENHANCED MESSAGE FORMATTING ===
            
            # Severity Emoji
            severity = bot_data.get('severity', 'MEDIUM').upper()
            severity_emoji = "🔴" if severity == "HIGH" else ("🟡" if severity == "MEDIUM" else "🟢")
            
            # Format Law References
            law_references = bot_data.get('law_reference', [])
            formatted_laws = []
            for doc in law_references:
                if isinstance(doc, dict):
                    formatted_laws.append(f"⚖️ *{doc.get('act', '')}* ({doc.get('section', '')})\n   _{doc.get('description', '')}_")
                else:
                    formatted_laws.append(f"⚖️ {doc}")
            
            # Format Threat Prediction
            what_happens_next = bot_data.get('what_happens_next', {})
            attacker_steps = what_happens_next.get('attacker_next_steps', [])
            risk_timeline = what_happens_next.get('risk_timeline', {})
            risk_stats = what_happens_next.get('risk_statistics', {})
            immediate_actions = what_happens_next.get('immediate_actions_recommended', [])
            warning_signs = what_happens_next.get('warning_signs_to_watch', [])
            
            # Format Complaint Portals
            complaint_portals = bot_data.get('complaint_portals', [])
            formatted_portals = []
            for portal in complaint_portals:
                if isinstance(portal, dict):
                    formatted_portals.append(f"🌐 *{portal.get('name', '')}*\n   {portal.get('url', '')}")
            
            # Build the main message
            reply_text = (
                f"━━━━━━━━━━━━━━━━━━━━\n"
                f"🚨 *CYBERCRIME ANALYSIS* 🚨\n"
                f"━━━━━━━━━━━━━━━━━━━━\n\n"
                
                f"🎯 *DETECTED CRIME*\n"
                f"```{bot_data.get('primary_category', 'Unknown').upper()}```\n\n"
                
                f"{severity_emoji} *SEVERITY:* {severity}\n\n"
                
                f"🧠 *AI REASONING*\n"
                f"_{bot_data.get('reasoning', 'No reasoning available.')}_\n\n"
            )
            
            # Add Required Documents
            req_docs = bot_data.get('required_documents', [])
            if req_docs:
                reply_text += f"📋 *REQUIRED DOCUMENTS*\n"
                reply_text += "\n".join([f"  • {doc}" for doc in req_docs]) + "\n\n"
            
            # Add Government Submissions
            gov_docs = bot_data.get('gov_documents_to_submit', [])
            if gov_docs:
                reply_text += f"🏛️ *GOVERNMENT SUBMISSIONS*\n"
                reply_text += "\n".join([f"  • {doc}" for doc in gov_docs]) + "\n\n"
            
            # Add Law References
            if formatted_laws:
                reply_text += f"📚 *APPLICABLE LAWS*\n"
                reply_text += "\n".join(formatted_laws) + "\n\n"
            
            # === THREAT PREDICTION SECTION ===
            if attacker_steps or risk_timeline:
                reply_text += (
                    f"━━━━━━━━━━━━━━━━━━━━\n"
                    f"🔮 *WHAT HAPPENS NEXT?*\n"
                    f"━━━━━━━━━━━━━━━━━━━━\n\n"
                )
                
                # Attacker Next Steps
                if attacker_steps:
                    reply_text += f"⚠️ *ATTACKER'S LIKELY MOVES:*\n"
                    for step in attacker_steps:
                        reply_text += f"  🔸 {step}\n"
                    reply_text += "\n"
                
                # Risk Timeline
                if risk_timeline:
                    reply_text += f"⏰ *RISK TIMELINE:*\n"
                    if risk_timeline.get('24_hours'):
                        reply_text += f"  🟡 *24 HRS:* {risk_timeline['24_hours']}\n"
                    if risk_timeline.get('48_hours'):
                        reply_text += f"  🟠 *48 HRS:* {risk_timeline['48_hours']}\n"
                    if risk_timeline.get('7_days'):
                        reply_text += f"  🔴 *7 DAYS:* {risk_timeline['7_days']}\n"
                    reply_text += "\n"
                
                # Risk Statistics
                if risk_stats:
                    reply_text += f"📊 *RISK ASSESSMENT:*\n"
                    if risk_stats.get('financial_loss_probability'):
                        reply_text += f"  💰 Financial Loss: {risk_stats['financial_loss_probability']}\n"
                    if risk_stats.get('reputation_damage_probability'):
                        reply_text += f"  😰 Reputation Damage: {risk_stats['reputation_damage_probability']}\n"
                    if risk_stats.get('escalation_probability'):
                        reply_text += f"  📈 Escalation Risk: {risk_stats['escalation_probability']}\n"
                    reply_text += "\n"
                
                # Warning Signs
                if warning_signs:
                    reply_text += f"👁️ *WARNING SIGNS TO WATCH:*\n"
                    for sign in warning_signs:
                        reply_text += f"  ⚡ {sign}\n"
                    reply_text += "\n"
            
            # === IMMEDIATE ACTIONS ===
            if immediate_actions:
                reply_text += (
                    f"━━━━━━━━━━━━━━━━━━━━\n"
                    f"✅ *TAKE ACTION NOW*\n"
                    f"━━━━━━━━━━━━━━━━━━━━\n"
                )
                for action in immediate_actions:
                    reply_text += f"  ✓ {action}\n"
                reply_text += "\n"
            
            # === COMPLAINT PORTALS ===
            if formatted_portals:
                reply_text += (
                    f"━━━━━━━━━━━━━━━━━━━━\n"
                    f"🔗 *FILE COMPLAINT HERE*\n"
                    f"━━━━━━━━━━━━━━━━━━━━\n"
                )
                reply_text += "\n".join(formatted_portals) + "\n\n"
            
            # Footer
            reply_text += (
                f"━━━━━━━━━━━━━━━━━━━━\n"
                f"💡 _This is an AI analysis. Please verify with authorities._\n"
                f"🆘 *Emergency:* cybercrime.gov.in | 1930"
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