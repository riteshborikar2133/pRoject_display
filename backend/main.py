from bson import ObjectId
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.json_util import dumps, loads
import urllib.parse

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from different origins


username = "riteshborikar2133"
password = "riteshborikar2133"

# URL-encode the username and password
encoded_username = urllib.parse.quote_plus(username)
encoded_password = urllib.parse.quote_plus(password)

# MongoDB Atlas connection string with encoded credentials
# Replace <cluster-url> with your MongoDB Atlas cluster URL, and <database> with your database name
MONGO_URI = f"mongodb+srv://riteshborikar2133:riteshborikar$2133@cluster0.y5ctwtu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



# MongoDB configuration
client = MongoClient(MONGO_URI)
if client:
    print("Connected to DB")
db = client['DataBase']  # Replace with your database name
circulars_collection = db['circulars']  # Collection for circulars
reports_collection = db['reports']  # Collection for reports

@app.route('/api/circulars', methods=['POST'])
def create_circular():
    try:
        # Extract JSON data from the request
        data = request.get_json()
        result = circulars_collection.insert_one({
            "title": request.json["title"],
            "message": request.json["message"],
            "type": request.json["type"],
        })
        return jsonify({'status': 'success', 'id': str(result.inserted_id)})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/circulars', methods=['GET'])
def get_circulars():
    try:
        # Fetch all documents from the circulars collection
        data = circulars_collection.find()
        return dumps(data)  # Use dumps to serialize MongoDB data to JSON
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/reports', methods=['POST'])
def create_report():
    try:
        # Extract JSON data from the request
        data = request.get_json()
        result = reports_collection.insert_one(data)
        return jsonify({'status': 'success', 'id': str(result.inserted_id)})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        # Fetch all documents from the reports collection
        data = reports_collection.find()
        return dumps(data)  # Use dumps to serialize MongoDB data to JSON
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500



@app.route('/api/circulars/<id>',methods=['DELETE']) #@app.route('/api/delete/reports/<name>',methods=['DELETE'])
def delete_reports(id: str): #def delete_reports(name):
    '''To make the delete with name, we need to change the <id> into name and use delete_one({'name':name})'''
    try:
        # Convert the string ID to ObjectId
        object_id = ObjectId(id)
        # print(object_id)
        # Name = str(name)
    except Exception as e:
        return jsonify({'error': 'Invalid ID format'}), 400
    
    # Delete the document from the 'reports' collection
    # reports_collection = db.reports
    result = circulars_collection.delete_one({'_id': ObjectId(id)})
    # result = reports_collection.delete_one({'name': Name})
    
    if result.deleted_count > 0:
        return jsonify({'message': 'Document deleted successfully'})
    else:
        return jsonify({'error': 'Document not found'}), 404







if __name__ == '__main__':
    app.run(debug=True)