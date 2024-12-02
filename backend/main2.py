from flask import Flask, jsonify, request
from flask_cors import CORS
from bson.json_util import dumps
from db_operations import create_circular, get_all_circulars, find_user_by_email, create_user
from importance_predictor import predict_importance  # Import the ML model function
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/api/circulars', methods=['POST'])
def create_circular_route():
    try:
        data = request.get_json()
        
        # Use the ML model to predict the importance of the message
        importance = predict_importance(data["message"])
        data["importance"] = importance  # Add predicted importance level to data

        result = create_circular(data)  # Insert the message into MongoDB
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
        print(data)
        # Validate input
        if "email" not in data or "password" not in data:
            return jsonify({'status': 'error', 'message': 'Email and Password are required!'}), 400

        # Find the user by email
        user = find_user_by_email(data["email"])
        if user is None:
            return jsonify({'status': 'error', 'message': 'User not found!'}), 404

        # Check the password
        # if not check_password_hash(user["password"], data["password"]):
        #     return jsonify({'status': 'error', 'message': 'Invalid password!'}), 401

        if user["password"] != data["password"]:
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

        passworddata = data['password']            
        # Hash the password
        # hashed_password = generate_password_hash(password=passworddata,method="sha256")

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
    app.run(debug=True)
