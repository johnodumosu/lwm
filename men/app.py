"""
Living Word Ministry – Men's Ministry Membership Form
Python (Flask) Backend  ·  MySQL Database
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
import re
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)   # Allow all origins; restrict in production (see config below)

# ── DATABASE CONFIG ──────────────────────────────────────────────────────────
DB_CONFIG = {
    "host":     os.getenv("DB_HOST",     "localhost"),
    "port":     int(os.getenv("DB_PORT", 3306)),
    "user":     os.getenv("DB_USER",     "lwm_user"),
    "password": os.getenv("DB_PASSWORD", "change_me"),
    "database": os.getenv("DB_NAME",     "living_word_ministry"),
}


def get_db():
    """Return a fresh MySQL connection."""
    return mysql.connector.connect(**DB_CONFIG)


# ── VALIDATION HELPERS ───────────────────────────────────────────────────────
def is_valid_dob(value: str) -> bool:
    """Accepts DD/MM or DD-MM formats."""
    value = value.strip()
    return bool(re.match(r"^\d{1,2}[\/\-]\d{1,2}$", value))


def is_valid_phone(value: str) -> bool:
    stripped = re.sub(r"[\s\-]", "", value)
    return bool(re.match(r"^\+?\d{7,15}$", stripped))


def is_valid_email(value: str) -> bool:
    if not value:
        return True   # optional
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", value))


REQUIRED_FIELDS = [
    "full_name", "dob", "marital_status", "phone",
    "address", "date_joined",
    "emergency_name", "emergency_number", "member_signature",
]


# ── ROUTES ───────────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Living Word Ministry API"}), 200


@app.route("/submit", methods=["POST"])
def submit_membership():
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"success": False, "message": "No data received."}), 400

    # ── Required field check
    missing = [f for f in REQUIRED_FIELDS if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({
            "success": False,
            "message": f"Missing required fields: {', '.join(missing)}"
        }), 422

    # ── Field-level validation
    errors = {}
    if not is_valid_dob(data.get("dob", "")):
        errors["dob"] = "Date of birth must be in DD/MM format."
    if not is_valid_phone(data.get("phone", "")):
        errors["phone"] = "Invalid phone number."
    if not is_valid_email(data.get("email", "")):
        errors["email"] = "Invalid email address."
    if not is_valid_phone(data.get("emergency_number", "")):
        errors["emergency_number"] = "Invalid emergency contact number."
    if errors:
        return jsonify({"success": False, "message": "Validation errors.", "errors": errors}), 422

    # ── Parse / sanitise values
    def clean(key, max_len=255):
        return str(data.get(key, "")).strip()[:max_len]

    # ── Parse date_joined safely
    date_joined_raw = clean("date_joined")
    try:
        date_joined = datetime.strptime(date_joined_raw, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"success": False, "message": "Invalid date_joined format (expected YYYY-MM-DD)."}), 422

    # ── Parse signature_date safely
    sig_date_raw = clean("signature_date")
    signature_date = None
    if sig_date_raw:
        try:
            signature_date = datetime.strptime(sig_date_raw, "%Y-%m-%d").date()
        except ValueError:
            signature_date = None

    # ── Insert into database
    sql = """
        INSERT INTO members (
            full_name, date_of_birth, marital_status,
            phone, email, residential_address,
            occupation, church_department,
            date_joined, emergency_contact_name, emergency_contact_number,
            member_signature, signature_date,
            approved_by, approver_signature,
            submitted_at
        ) VALUES (
            %s, %s, %s,
            %s, %s, %s,
            %s, %s,
            %s, %s, %s,
            %s, %s,
            %s, %s,
            NOW()
        )
    """
    values = (
        clean("full_name"),
        clean("dob"),
        clean("marital_status"),
        clean("phone"),
        clean("email"),
        clean("address", 1000),
        clean("occupation"),
        clean("department"),
        date_joined,
        clean("emergency_name"),
        clean("emergency_number"),
        clean("member_signature"),
        signature_date,
        clean("approved_by"),
        clean("approver_signature"),
    )

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(sql, values)
        conn.commit()
        member_id = cursor.lastrowid
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        app.logger.error("DB error: %s", err)
        return jsonify({"success": False, "message": "Database error. Please try again later."}), 500

    return jsonify({
        "success": True,
        "message": "Membership application submitted successfully.",
        "member_id": member_id,
    }), 201


@app.route("/members", methods=["GET"])
def list_members():
    """Admin endpoint — protect with auth in production!"""
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM members ORDER BY submitted_at DESC")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        # Convert date/datetime to strings for JSON
        for r in rows:
            for k, v in r.items():
                if hasattr(v, "isoformat"):
                    r[k] = v.isoformat()
        return jsonify({"success": True, "count": len(rows), "data": rows}), 200
    except mysql.connector.Error as err:
        app.logger.error("DB error: %s", err)
        return jsonify({"success": False, "message": "Database error."}), 500


# ── ENTRY POINT ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
