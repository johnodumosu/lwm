# Living Word Ministry – Men's Ministry Membership Form
## Full-Stack Setup Guide (Python + MySQL)

---

## Files Included

| File | Description |
|---|---|
| `index.html` | Frontend – the membership form (open in any browser) |
| `app.py` | Backend – Flask API server |
| `schema.sql` | MySQL database + table creation script |
| `requirements.txt` | Python dependencies |
| `.env.example` | Environment variable template |

---

## Quick Start

### 1. Set up MySQL

```bash
mysql -u root -p < schema.sql
```

> Edit `schema.sql` first: change `'change_me'` to a strong password.

---

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your real DB credentials
```

---

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Run the Flask server

```bash
python app.py
```

The API will be available at: **http://localhost:5000**

---

### 5. Open the frontend

Open `index.html` in your browser directly, **or** serve it with:

```bash
python -m http.server 8080
# Then visit http://localhost:8080
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/submit` | Submit a membership form (JSON body) |
| `GET` | `/members` | List all members (admin – add auth!) |

### POST /submit – Example Body

```json
{
  "full_name": "John Smith",
  "dob": "15/03",
  "marital_status": "Married",
  "phone": "+27 82 000 0000",
  "email": "john@example.com",
  "address": "12 Church Street, Johannesburg, 2000",
  "occupation": "Engineer",
  "department": "Choir",
  "date_joined": "2024-01-15",
  "emergency_name": "Jane Smith",
  "emergency_number": "+27 83 000 0000",
  "member_signature": "John Smith",
  "signature_date": "2026-03-10",
  "approved_by": "Pastor David",
  "approver_signature": "Pastor David"
}
```

---

## Production Checklist

- [ ] Set `debug=False` in `app.py`
- [ ] Restrict CORS to your domain: `CORS(app, origins=["https://yourdomain.com"])`
- [ ] Use a strong `DB_PASSWORD`
- [ ] Protect `/members` with authentication
- [ ] Deploy behind Nginx/Apache with HTTPS
- [ ] Update `BACKEND_URL` in `index.html` to your server's URL
