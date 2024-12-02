from bson import ObjectId
from config import db

# Collections
circulars_collection = db['circulars']
reports_collection = db['reports']
users_collection = db['users']

def determine_priority(content):
    author = content.get('author')
    if author == "HOD":
        return 0  # Highest priority for HOD
    elif author == "Department":
        return 1  # High priority for Department
    elif author == "Event Organizer":
        return 2  # Medium priority for events
    else:
        return 3  # Default priority

# Circulars operations
def create_circular(data):
    priority = determine_priority(data)
    return circulars_collection.insert_one({
        "title": data["title"],
        "message": data["message"],
        "type": data["type"],
        "priority": data["importance"]
    })

def get_all_circulars():
    return circulars_collection.find()

def delete_circular_by_id(id):
    return circulars_collection.delete_one({'_id': ObjectId(id)})

# Reports operations
def create_report(data):
    return reports_collection.insert_one(data)

def get_all_reports():
    return reports_collection.find().sort('priority', 1)

def find_user_by_email(email):
    return users_collection.find_one({"email": email})

def create_user(user_data):
    return users_collection.insert_one(user_data)