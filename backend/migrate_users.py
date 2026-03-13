import json
import os
from pymongo import MongoClient

# Configuration - Ensure these match your .env
MONGODB_URI = "mongodb://127.0.0.1:27017/tassia_school"
STORE_PATH = os.path.join(os.path.dirname(__file__), "store.json")

def migrate():
    try:
        # 1. Connect to MongoDB
        client = MongoClient(MONGODB_URI)
        db = client.get_database()
        mongo_users = list(db.users.find())
        print(f"📡 Found {len(mongo_users)} users in MongoDB.")

        # 2. Load existing store.json data (to preserve students/grades)
        if os.path.exists(STORE_PATH):
            with open(STORE_PATH, 'r') as f:
                store_data = json.load(f)
        else:
            store_data = {"users": [], "students": [], "grades": [], "subjects": [], "classes": []}

        # 3. Transform and Map Users
        new_user_list = []
        for mu in mongo_users:
            # We map MongoDB fields to the JSON structure Flask expects
            user_entry = {
                "id": str(mu.get("_id")),
                "email": mu.get("email"),
                "passwordHash": mu.get("password"), # Node.js bcrypt hash
                "role": mu.get("role", "teacher").lower(), # CRITICAL: Force lowercase 'admin'
                "name": mu.get("name", "User")
            }
            new_user_list.append(user_entry)

        # 4. Update the store and save
        store_data["users"] = new_user_list
        with open(STORE_PATH, 'w') as f:
            json.dump(store_data, f, indent=2)
        
        print(f"✅ Migration successful! {len(new_user_list)} users synced to store.json.")
        print("🚀 Tip: Your Admin user now has role: 'admin' (lowercase).")

    except Exception as e:
        print(f"❌ Migration failed: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    migrate()