"""
EduManage Pro - Flask Backend (Robust Sync Fix)
RESTful API serving on port 18080
"""

import json
import uuid
import os
import fcntl
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import Flask, jsonify, request, g, make_response
from flask_cors import CORS

app = Flask(__name__)
# Crucial: This must match the JWT_SECRET in your .env
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET', 'dev-secret-key')

# Configure CORS
ALLOWED_ORIGINS = ["http://127.0.0.1:3000", "http://localhost:3000"]
CORS(app, origins=ALLOWED_ORIGINS, supports_credentials=True)

STORE_PATH = os.path.join(os.path.dirname(__file__), "store.json")

def read_store() -> dict:
    if not os.path.exists(STORE_PATH):
        return {"users": [], "students": [], "grades": [], "subjects": [], "classes": []}
    with open(STORE_PATH, "r") as f:
        fcntl.flock(f, fcntl.LOCK_SH)
        try:
            return json.load(f)
        finally:
            fcntl.flock(f, fcntl.LOCK_UN)

def write_store(data: dict) -> None:
    with open(STORE_PATH, "w") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        json.dump(data, f, indent=2)
        fcntl.flock(f, fcntl.LOCK_UN)

# ── IMPROVED AUTH DECORATOR ─────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Support both Cookie and Authorization Header
        token = request.cookies.get('token') or request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({"error": "No authorization token found"}), 401
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            # ROBUST FIX: Ensure user_id is a string for matching store.json
            user_id = str(payload.get("user_id"))
        except Exception:
            return jsonify({"error": "Invalid or expired session"}), 401

        store = read_store()
        # Find user by matching string IDs
        user = next((u for u in store.get("users", []) if str(u.get("id")) == user_id), None)
        
        if not user:
            return jsonify({"error": "User not synchronized in store.json"}), 401
        
        g.current_user = user
        return f(*args, **kwargs)
    return decorated

def admin_only(f):
    @wraps(f)
    @login_required
    def decorated(*args, **kwargs):
        if str(g.current_user.get("role", "")).lower() != "admin":
            return jsonify({"error": "Forbidden: Requires Admin role"}), 403
        return f(*args, **kwargs)
    return decorated

# ── ENDPOINTS ────────────────────────────────────────────────────────────

@app.route("/api/dashboard/summary", methods=["GET"])
@login_required
def dashboard_summary():
    store = read_store()
    return jsonify({
        "totalStudents": len(store.get("students", [])),
        "totalGradesEntered": len(store.get("grades", [])),
        "totalSubjects": len(store.get("subjects", [])),
        "totalClasses": len(store.get("classes", []))
    })

@app.route("/api/students", methods=["GET", "POST"])
@login_required
def handle_students():
    store = read_store()
    if request.method == "GET":
        return jsonify(store.get("students", []))
    
    # POST logic requires Admin
    if str(g.current_user.get("role", "")).lower() != "admin":
        return jsonify({"error": "Admin access required to add students"}), 403
        
    data = request.get_json()
    new_student = {"id": str(uuid.uuid4()), "name": data.get("name"), "classId": data.get("classId")}
    store["students"].append(new_student)
    write_store(store)
    return jsonify(new_student), 201

# ... other endpoints (grades, subjects, classes) follow same login_required pattern

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=18080, debug=True)