from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import os

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = "your_secret_key"  # change to something secure
DB_FILE = "placement.db"        #single db

# ---------- DB INIT ----------
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Topics table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        subject TEXT NOT NULL,
        topic_name TEXT NOT NULL,
        status TEXT CHECK(status IN ('pending','in-progress','completed')) DEFAULT 'pending',
        difficulty TEXT CHECK(difficulty IN ('easy','medium','hard')),
        notes TEXT,
        FOREIGN KEY (username) REFERENCES users(username)
    )
''')


    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# ---------- AUTH DECORATOR ----------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]  # Expect "Bearer <token>"

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = data["username"]
        except:
            return jsonify({"message": "Token is invalid!"}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# ---------- AUTH ROUTES ----------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)",
                       (username, generate_password_hash(password)))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({"message": "Username already exists"}), 400
    finally:
        conn.close()

    return jsonify({"message": "User registered successfully!"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user["password_hash"], password):
        token = jwt.encode(
            {"username": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )
        return jsonify({"token": token})
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# ---------- TOPICS CRUD (PROTECTED) ----------
@app.route("/")
def home():
    return "Placement Tracker Backend is running!"


@app.route("/add", methods=["POST"])
@token_required
def add_topic(current_user):
    data = request.get_json()
    subject = data.get("subject")
    topic_name = data.get("topic_name")
    status = data.get("status")
    difficulty = data.get("difficulty")
    notes = data.get("notes")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO topics (username, subject, topic_name, status, difficulty, notes)
    VALUES (?, ?, ?, ?, ?, ?)
''', (current_user, subject, topic_name, status, difficulty, notes))

    conn.commit()
    conn.close()

    return jsonify({"message": f"Topic added successfully by {current_user}!"}), 201

@app.route("/topics", methods=["GET"])
@token_required
def get_topics(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM topics WHERE username=?", (current_user,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route("/update/<int:id>", methods=["PUT"])
@token_required
def update_topic(current_user, id):
    data = request.get_json()
    subject = data.get("subject")
    topic_name = data.get("topic_name")
    status = data.get("status")
    difficulty = data.get("difficulty")
    notes = data.get("notes")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE topics
        SET subject = ?, topic_name = ?, status = ?, difficulty = ?, notes = ?
        WHERE id = ?
    ''', (subject, topic_name, status, difficulty, notes, id))
    conn.commit()
    conn.close()

    return jsonify({"message": f"Topic updated successfully by {current_user}!"}), 200

@app.route("/delete/<int:id>", methods=["DELETE"])
@token_required
def delete_topic(current_user, id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM topics WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Topic deleted successfully by {current_user}!"}), 200

#------------------------------ETL----------------------------------------------

@app.route("/user/topics", methods=["GET"])
@token_required   # ✅ ensures only logged-in users can access
def get_user_topics(current_user):
    conn = sqlite3.connect("placement.db")
    cursor = conn.cursor()
    
    # Extract: get topics of current user
    cursor.execute("SELECT subject, topic_name, status, difficulty FROM topics WHERE username=?", (current_user,))
    rows = cursor.fetchall()
    
    # Transform: count progress
    total = len(rows)
    completed = sum(1 for r in rows if r[2] == "completed")
    pending = total - completed
    
    data = {
        "total_topics": total,
        "completed": completed,
        "pending": pending,
        "topics": [{"subject": r[0], "topic": r[1], "status": r[2], "difficulty": r[3]} for r in rows]
    }
    
    conn.close()
    return jsonify(data)


# ---------- MAIN ----------
if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0",port=int(os.environ.get("PORT", 5000)))
