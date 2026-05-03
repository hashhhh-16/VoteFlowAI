from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_response(user_input):
    text = user_input.lower()

    if "first" in text:
        return """I understand you are voting for the first time.

Step 1: Check if you are registered on the voter list  
Step 2: If not, apply using Form 6 on the official voter portal  
Step 3: Keep ID proof ready for polling day  

You’re all set to begin your voting journey confidently."""

    elif "missing" in text and "name" in text:
        return """I understand your name is missing from the voter list.

Step 1: Re-check your status using your EPIC number  
Step 2: If not found, submit Form 6 or correction request  
Step 3: Contact your BLO for faster resolution  

This issue can be resolved before the next election cycle."""

    elif "id" in text:
        return """I understand your voter ID is missing.

Step 1: Check if your name is on the voter list  
Step 2: Carry alternate ID (Aadhaar, Passport, Driving License)  
Step 3: Visit your assigned polling booth  

You can still vote even without your physical voter ID."""

    elif "candidate" in text:
        return """I understand you want to evaluate candidates.

Step 1: Check their affidavit (Form 26)  
Step 2: Review criminal records and financial details  
Step 3: Compare education and background  

Use official Election Commission sources to make an informed decision."""

    elif "complaint" in text:
        return """I understand you want to report an election issue.

Step 1: Identify the issue clearly  
Step 2: Use the cVIGIL app for quick reporting  
Step 3: Contact BLO or call voter helpline (1950)  

Your complaint will be directed to the appropriate authority."""

    elif "booth" in text or "polling" in text:
        return """I understand you want to find your polling booth.

Step 1: Visit the official voter portal  
Step 2: Enter your EPIC number  
Step 3: Note your booth address and details  

You must vote at your assigned polling station only."""

    else:
        return """I understand you need help with the election process.

I can assist you with:
• voter registration  
• missing voter list issues  
• lost voter ID  
• polling booth details  
• candidate understanding  
• complaint filing  

Tell me your situation and I’ll guide you step-by-step."""

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")
    reply = get_response(user_input)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(port=5000, debug=True)