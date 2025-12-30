# ⏰ Time Capsule

A web application for creating digital time capsules that deliver your messages to the future.

---

## ✨ Features

- Create time capsules with future delivery dates
- Email delivery notifications
- Dashboard to view pending and sent capsules
- Template library for quick message creation
- MongoDB-backed data storage

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)

### Installation

1. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

2. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

3. **Configure Environment**

   Create `backend/.env`:

   ```env
   PORT=4000
   CLIENT_ORIGIN=http://localhost:5173
   MONGODB_URI=mongodb://127.0.0.1:27017/timecapsule

   # Scheduler (optional, disabled by default)
   START_SCHEDULER=false

   # Email Configuration
   MAIL_DRIVER=console  # Use "smtp" for real emails
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_pass
   SMTP_FROM="Time Capsule <no-reply@example.com>"
   ```

4. **Start Development Servers**

   Terminal 1 - Backend:

   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 - Frontend:

   ```bash
   cd frontend
   npm run dev
   ```

   Open browser: `http://localhost:5173`

---

## 🛠 Tech Stack

### Frontend

- React 18 + Vite
- Tailwind CSS
- React Router

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Nodemailer
- node-cron

---

## ⚙️ Configuration

### Environment Variables

| Variable          | Description                 | Default               | Required |
| ----------------- | --------------------------- | --------------------- | -------- |
| `PORT`            | Backend server port         | 4000                  | No       |
| `CLIENT_ORIGIN`   | Frontend URL for CORS       | http://localhost:5173 | Yes      |
| `MONGODB_URI`     | MongoDB connection string   | -                     | Yes      |
| `START_SCHEDULER` | Enable automatic delivery   | false                 | No       |
| `MAIL_DRIVER`     | Email method (console/smtp) | console               | Yes      |
| `SMTP_HOST`       | SMTP server host            | -                     | If smtp  |
| `SMTP_PORT`       | SMTP server port            | 587                   | If smtp  |
| `SMTP_USER`       | SMTP username               | -                     | If smtp  |
| `SMTP_PASS`       | SMTP password               | -                     | If smtp  |
| `SMTP_FROM`       | Email sender address        | -                     | If smtp  |

### Email Configuration Options

#### Console Mode (Development)

```env
MAIL_DRIVER=console
```

Emails are logged to console instead of being sent.

#### SMTP Mode (Production)

```env
MAIL_DRIVER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Time Capsule <noreply@yourdomain.com>"
```

---

## Project Structure

```
mini-project/
├── backend/
│   ├── src/
│   │   ├── server.js           # Express app entry point
│   │   ├── models/
│   │   │   └── Capsule.js      # Capsule data model
│   │   ├── routes/
│   │   │   └── capsules.js     # API endpoints
│   │   └── services/
│   │       ├── mailer.js       # Email service
│   │       └── scheduler.js    # Automated delivery
│   ├── Dockerfile
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Root component
    │   ├── main.jsx             # Application entry
    │   ├── components/
    │   │   ├── Countdown.jsx    # Countdown timer
    │   │   └── PreviewCard.jsx  # Capsule preview
    │   ├── pages/
    │   │   ├── Landing.jsx      # Landing page
    │   │   ├── SignIn.jsx       # Authentication
    │   │   ├── SignUp.jsx       # Registration
    │   │   ├── CreateCapsule.jsx # Capsule creation
    │   │   ├── Dashboard.jsx    # User dashboard
    │   │   └── Home.jsx         # Main page
    │   └── lib/
    │       ├── api.js           # API client
    │       └── utils.js         # Helper functions
    ├── Dockerfile
    └── package.json
```

---

## 🔧 Development

### Backend Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

<div align="center">

**[⬆ Back to Top](#-time-capsule)**

Made with ❤️ for preserving memories

</div>
