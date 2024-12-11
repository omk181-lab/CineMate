import os
from flask import Flask, render_template, request, jsonify
import pandas as pd
import pickle
import sqlite3
import uuid

app = Flask(__name__)

DATABASE = 'recommendation.db'

# Initialize database
def setup_database():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # Create Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Users (
            userId TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create Recommendations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Recommendations (
            recordId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            recommended_movies TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES Users(userId)
        )
    ''')

    conn.commit()
    conn.close()

setup_database()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate-user-id', methods=['GET'])
def generate_user_id():
    unique_id = str(uuid.uuid4())[:8]
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM Users WHERE userId = ?", (unique_id,))
    while cursor.fetchone()[0] > 0:
        unique_id = str(uuid.uuid4())[:8]

    cursor.execute("INSERT INTO Users (userId) VALUES (?)", (unique_id,))
    conn.commit()
    conn.close()

    return jsonify({"userId": unique_id})

@app.route('/fetch-history/<user_id>', methods=['GET'])
def fetch_history(user_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT recommended_movies FROM Recommendations WHERE userId = ?", (user_id,))
    rows = cursor.fetchall()

    recommendations = []
    for row in rows:
        recommendations.extend(row[0].split(','))

    conn.close()
    return jsonify({"recommendations": recommendations})

if __name__ == '__main__':
    # Use Render's PORT environment variable in production
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
