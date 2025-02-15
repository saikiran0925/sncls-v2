from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import uuid

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shared_data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class SharedJSON(db.Model):
    id = db.Column(db.String(36), primary_key=True, unique=True)
    json_data = db.Column(db.Text, nullable=False)

with app.app_context():
    db.create_all()

@app.route('/share', methods=['POST'])
def share_json():
    data = request.json.get("data")
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    share_id = str(uuid.uuid4())
    new_entry = SharedJSON(id=share_id, json_data=data)
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"shareId": share_id})

@app.route('/shared/<share_id>', methods=['GET'])
def get_shared_json(share_id):
    entry = SharedJSON.query.get(share_id)
    if entry:
        return jsonify({"data": entry.json_data})
    return jsonify({"error": "Not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)

