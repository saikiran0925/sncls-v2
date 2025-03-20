from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import uuid
import pymysql
from datetime import datetime, timedelta
from flask_apscheduler import APScheduler
import json

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:inrev%40123@127.0.0.1/shared_data'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class SharedJSON(db.Model):
    id = db.Column(db.String(36), primary_key=True, unique=True)
    json_data = db.Column(db.Text, nullable=False)
    type = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Feedback(db.Model):
    id = db.Column(db.String(36), primary_key=True, unique=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    feedback = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'feedback' or 'bug'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

@app.route('/share', methods=['POST'])
def share_json():
    if not request.is_json:
        return jsonify({"error": "Invalid JSON format"}), 400

    data = request.json.get("data")
    type = request.json.get("path")

    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    # Convert dict to string if necessary
    if isinstance(data, dict):
        data = json.dumps(data)  # Ensure it's stored as a string

    share_id = str(uuid.uuid4())
    new_entry = SharedJSON(id=share_id, json_data=data, type=type)
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"shareId": share_id})

@app.route('/shared/<share_id>', methods=['GET'])
def get_shared_json(share_id):
    entry = SharedJSON.query.get(share_id)
    if entry:
        return jsonify({"data": entry.json_data, "type": entry.type})
    return jsonify({"error": "Not found"}), 404

@app.route('/feedback', methods=['POST'])
def submit_feedback():
    if not request.is_json:
        return jsonify({"error": "Invalid JSON format"}), 400

    data = request.json
    name = data.get("name")
    email = data.get("email")
    feedback_text = data.get("feedback")
    type = data.get("type", "feedback") 

    if not feedback_text:
        return jsonify({"error": "Feedback is mandatory"}), 400

    feedback_id = str(uuid.uuid4())
    new_feedback = Feedback(id=feedback_id, name=name, email=email, feedback=feedback_text, type=type)
    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted successfully", "feedbackId": feedback_id})

def delete_old_entries():
    with app.app_context():
        time_threshold = datetime.utcnow() - timedelta(hours=24)
        deleted_rows = SharedJSON.query.filter(SharedJSON.created_at < time_threshold).delete()
        db.session.commit()
        print(f"Deleted {deleted_rows} old entries.")  # Log cleanup

scheduler = APScheduler()
scheduler.add_job(id="delete_old_entries", func=delete_old_entries, trigger="interval", hours=1)
scheduler.start()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
