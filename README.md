# 🌀 KODA.AI

**Your AI-powered creative companion for building stunning websites.**

KODA.AI is a full-stack (MERN) AI website builder. Describe the site you want in
plain English and KODA generates a complete, production-grade, fully responsive
website using HTML, CSS, and JavaScript — ready to preview, edit, and deploy.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-Billing-635BFF?logo=stripe&logoColor=white" alt="Stripe" />
</p>

---

## ✨ Features

- 🤖 **AI Website Generation** — Turn a text prompt into a complete, responsive, multi-section website.
- 💬 **Conversational Editing** — Refine generated sites through follow-up chat messages.
- 🧠 **Multiple AI Models** — `Auto (Free)` for everyone and `DeepSeek V3` unlocked for Pro/Enterprise plans, powered by [OpenRouter](https://openrouter.ai/).
- 📝 **In-Browser Code Editor** — Tweak generated code directly with the Monaco editor.
- 👀 **Live Preview** — Instantly see your generated website.
- 🚀 **One-Click Deploy** — Publish any project to a shareable public URL with a unique slug.
- 🔐 **Google Authentication** — Secure sign-in via Firebase + JWT cookies.
- 💳 **Credits & Billing** — Plan-based credit system with Stripe checkout and webhooks.

## 💎 Plans

| Plan        | Price   | Credits | Models                       |
|-------------|---------|---------|------------------------------|
| Free        | ₹0      | 100     | Auto (Free)                  |
| Pro         | ₹249    | 500     | Auto, DeepSeek V3            |
| Enterprise  | ₹999    | 2200    | Auto, DeepSeek V3            |

---

## 🏗️ Tech Stack

**Frontend (`/client`)**
- React 19 + Vite 7
- Redux Toolkit (state management)
- Tailwind CSS 4
- React Router 7
- Monaco Editor
- Firebase Auth, Axios, Motion (animations)

**Backend (`/server`)**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT + cookie-parser (auth)
- OpenRouter API (AI generation)
- Stripe (payments & webhooks)

---

## 📁 Project Structure

```
KODA/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── pages/          # Home, Generate, Editor, Dashboard, Pricing, LiveSite
│       ├── components/     # Shared UI (e.g. LoginModal)
│       ├── redux/          # Store & user slice
│       ├── hooks/          # Custom hooks
│       └── firebase.js     # Firebase config
│
└── server/                 # Express backend
    ├── config/             # DB, OpenRouter, Stripe, plan definitions
    ├── controllers/        # auth, user, website, billing, stripe webhook
    ├── models/             # User & Website schemas
    ├── routes/             # API route definitions
    ├── middlewares/        # isAuth (JWT)
    └── index.js            # App entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB database (local or Atlas)
- API keys for: [OpenRouter](https://openrouter.ai/), [Stripe](https://stripe.com/), and a [Firebase](https://firebase.google.com/) project

### 1. Clone the repository
```bash
git clone https://github.com/debabrataswainiitp/koda.git
cd koda
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:5173
```

Run the server:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

> Note: The backend base URL is defined as `serverUrl` in `client/src/App.jsx`.
> Update it to `http://localhost:5000` for local development.

Run the client:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 API Reference

Base path: `/api`

### Auth
| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | `/auth/google`        | Sign in with Google          |
| GET    | `/auth/logout`        | Log out                      |

### User
| Method | Endpoint     | Description               |
|--------|--------------|---------------------------|
| GET    | `/user/me`   | Get current user profile  |

### Website
| Method | Endpoint                       | Description                      |
|--------|--------------------------------|----------------------------------|
| POST   | `/website/generate`            | Generate a new website from a prompt |
| POST   | `/website/update/:id`          | Apply conversational changes     |
| GET    | `/website/get-by-id/:id`       | Fetch a website by ID            |
| GET    | `/website/get-all`             | List the user's websites         |
| GET    | `/website/deploy/:id`          | Deploy a website (returns URL)   |
| GET    | `/website/get-by-slug/:slug`   | Fetch a deployed site by slug    |

### Billing
| Method | Endpoint     | Description                      |
|--------|--------------|----------------------------------|
| POST   | `/billing`   | Create a Stripe checkout session |
| POST   | `/stripe/webhook` | Stripe webhook handler      |

---

## 📜 Available Scripts

**Client**
- `npm run dev` — Start the Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint

**Server**
- `npm run dev` — Start the server with nodemon

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the ISC License.
