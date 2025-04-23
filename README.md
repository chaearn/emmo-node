# Emmo Core Backend

A lightweight, modular backend for **Emmo**, a multichannel emotional support and training assistant. Supports LINE Messaging API, OpenAI GPT analysis, and Supabase storage.

---

## 🚀 Getting Started

### 1. Clone this repo
```bash
git clone https://github.com/your-username/emmo-core.git
cd emmo-core
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file using the provided template:
```bash
cp .env.example .env
```
Then edit the values in `.env` with your actual credentials.

### 4. Run the server
```bash
node server.js
```

---

## 🔌 Endpoints

| Method | Endpoint       | Description                      |
|--------|----------------|----------------------------------|
| POST   | `/webhook`     | LINE Messaging API webhook       |
| POST   | `/emmo-chat`   | Analyze user messages via GPT    |
| GET    | `/`            | Health check                     |

---

## 🧱 Project Structure
```
adapters/           → Platform-specific message handlers
api/                → Public API routes
services/           → GPT, Supabase, and message builders
utils/              → Response formatters and helpers
playground/         → Local test scripts
.env.example        → Environment variable template
server.js           → Main express app
```

---

## 💬 Powered By
- LINE Messaging API
- OpenAI GPT-4
- Supabase (Database & Auth)

---

## 🛠 Dev Tips
- Keep `.env` out of version control (already in `.gitignore`)
- Use `playground/` folder to test push message, prompt logic, or data fetch
- Add more platforms easily by creating new adapters like `telegram/`, `web/`, etc.

---

Feel free to fork, reuse, or scale this core for your emotional support app 💜
