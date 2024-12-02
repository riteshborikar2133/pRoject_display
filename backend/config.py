import urllib.parse
from pymongo import MongoClient

# MongoDB credentials
username = "riteshborikar2133"
password = "Password123"

# URL-encode the username and password
encoded_username = urllib.parse.quote_plus(username)
encoded_password = urllib.parse.quote_plus(password)

# MongoDB Atlas connection string
MONGO_URI = f"mongodb+srv://{encoded_username}:{encoded_password}@cluster0.y5ctwtu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# MongoDB configuration
client = MongoClient(MONGO_URI)
db = client['NOtICE']  # Replace with your database name
