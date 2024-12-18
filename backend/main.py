from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
from bson.json_util import dumps
from db_operations import create_circular, get_all_circulars, find_user_by_email, create_user
from importance_predictor import predict_importance  # Import the ML model function
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Enable CORS
socketio = SocketIO(app, cors_allowed_origins="*")  # Initialize Socket.IO

@app.route('/api/circulars', methods=['POST'])
def create_circular_route():
    try:
        importance = "Lowest"
        data = request.get_json()
        print(data)
        types = data['type']
        message = data['message']
        print(types)
        # Use the ML model to predict the importance of the message
        if types == "text":
            importance = predict_importance(data["message"])
            data["importance"] = importance  # Add predicted importance level to data

        if types == 'image':
            importance = 'Lowest'
            data["importance"] = importance  # Add predicted importance level to data
            
        # Insert the circular into MongoDB
        result = create_circular(data)

        # Emit a real-time event to all connected clients
        socketio.emit('new_circular', {
            'id': str(result.inserted_id),
            'title': data.get('title', 'No Title'),
            'message': data["message"],
            'importance': importance,
            'type': types
        })

        return jsonify({'status': 'success', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

# Other route handlers remain the same
@app.route('/api/circulars', methods=['GET'])
def get_all_circulars_route():
    try:
        circulars = get_all_circulars()  # Fetch all circulars from MongoDB
        return jsonify({'status': 'success', 'data': dumps(circulars)}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        em = data['email'] 
        pswd = data['password']
        print(em)
        # Validate input
        if "email" not in data or "password" not in data:
            return jsonify({'status': 'error', 'message': 'Email and Password are required!'}), 400

        # Find the user by email
        user = find_user_by_email(em)
        if user is None:
            return jsonify({'status': 'error', 'message': 'User not found!'}), 404

        # Check the password
        if user["password"] != pswd:
            return jsonify({'status': 'error', 'message': 'Invalid password!'}), 401

        return jsonify({'status': 'success', 'message': 'Login successful!', 'user': {'id': str(user["_id"]), 'email': user["email"]}}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        print(data)
        # Validate input
        if "email" not in data or "password" not in data:
            return jsonify({'status': 'error', 'message': 'Email and Password are required!'}), 400

        # Create the user
        user_data = {
            "email": data["email"],
            "password": data["password"]
        }
        result = create_user(user_data)

        return jsonify({'status': 'success', 'message': 'User registered successfully!', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    socketio.run(app, debug=True)  # Use so  cketio.run instead of app.run
