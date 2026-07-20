# 🚀 ResumeAI - AI Resume & Portfolio Builder

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwind-css)
![Groq](https://img.shields.io/badge/Groq_AI-FF6600?style=for-the-badge&logo=data:image/svg+xml;base64,)

**Build Professional ATS-Friendly Resumes & Portfolio Websites with AI**

</div>

---
## 🌐 Live Demo

### 🚀 Live Application
https://resume-ai-alpha-beige.vercel.app

### ⚙️ Backend API
https://resumeai-qfs2.onrender.com

### 📂 GitHub Repository
https://github.com/sainiansh3004/ResumeAI

---

## 📖 Overview

ResumeAI is a modern full-stack AI-powered Resume & Portfolio Builder that helps users create professional resumes and personal portfolio websites in minutes.

The application provides real-time editing, AI-generated professional summaries, cover letter generation, ATS scoring, 8 premium templates, drag & drop section reordering, PDF export, portfolio website builder with custom subdomains, Razorpay billing, and an intuitive dashboard to manage everything.

---

# ✨ Features

### 🔐 Authentication

- User Registration & Secure Login
- JWT Authentication with Protected Routes
- Password Encryption using bcrypt

---

### 📝 Resume Builder

Create resumes with fully customizable sections:

- Personal Information (with photo upload)
- Professional Summary (AI-generated)
- Education
- Experience
- Skills
- Projects
- Certifications
- Achievements
- Languages
- Interests

---

### 🤖 AI Features (Powered by Groq — Llama 3.3 70B)

- **AI Resume Summary Generation** — One-click professional summary
- **Experience Bullet Optimizer** — Rewrite bullets with strong action verbs & metrics
- **Cover Letter Generator** — Tailored cover letters for any job description
- **Skill Recommender** — AI-suggested skills based on target job title
- **ATS Score Audit** — Real-time scoring with actionable recommendations

---

### 🎨 8 Resume Templates

| Free Templates | Pro Templates |
|---------------|---------------|
| Modern | Executive |
| ATS | Tech |
| Minimal | Academic |
| Creative | Sleek |

---

### ⚡ Live Editing & Customization

- Live Resume Preview
- Drag & Drop Section Reordering
- Hide/Show Sections
- Custom Section Titles
- Typography & Layout Controls (Font Family, Size, Line Height, Margins)
- 5 Theme Colors (Blue, Purple, Green, Black, Red)
- Undo/Redo Support
- Auto Save

---

### 🌐 Portfolio Website Builder

- Convert any resume into a live personal website
- Claim a custom subdomain (resumeai.app/yourname)
- Choose from 4 website themes (Modern, Sleek, Minimal, Creative)
- Accent color customization
- View counter & analytics
- Sections: Hero, Skills, Experience, Education, Projects, Contact

---

### 💳 Billing (Razorpay)

- Free tier with 4 standard templates
- Pro plan (₹999/year) unlocks all 8 templates, AI suite, and portfolio hosting
- Razorpay payment gateway integration
- Demo mode for local development

---

### 📄 Export

- High Quality PDF Export via browser print
- Print-optimized CSS (only resume prints, no sidebar)
- ATS Compatible output

---

# 🛠 Tech Stack

## Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Axios
- @dnd-kit (drag & drop)
- Lucide React (icons)

## Backend

- Node.js
- Express.js 5
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcrypt
- Groq AI (Llama 3.3 70B via OpenAI SDK)
- Razorpay Payment Gateway

## Tools

- Git & GitHub
- Vercel (Frontend hosting)
- Render (Backend hosting)

---

# 📂 Folder Structure

```
ResumeAI
│
├── client
│   ├── app
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── resume/[id]/       # Resume builder
│   │   ├── portfolio/[subdomain]/ # Public portfolio page
│   │   ├── not-found.tsx      # Custom 404 page
│   │   ├── globals.css        # Global styles + print CSS
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components
│   │   ├── Hero/              # Landing page hero
│   │   ├── Features/          # Features section
│   │   ├── Pricing/           # Pricing section
│   │   ├── Navbar/            # Navigation bar
│   │   ├── Footer/            # Footer
│   │   ├── portfolio/         # Portfolio customizer
│   │   └── resume/
│   │       ├── forms/         # Section form components
│   │       ├── templates/     # 8 resume templates
│   │       ├── ResumeForm.tsx
│   │       ├── ResumePreview.tsx
│   │       ├── TemplateSelector.tsx
│   │       ├── SectionOrderEditor.tsx
│   │       ├── LayoutStyleEditor.tsx
│   │       ├── AiSuite.tsx
│   │       └── A4Container.tsx
│   ├── services/              # API client services
│   ├── types/                 # TypeScript interfaces
│   └── utils/                 # Hooks (useUndoRedo)
│
├── server
│   └── src
│       ├── config/            # Database connection
│       ├── controllers/       # Route handlers
│       │   ├── authController.js
│       │   ├── resumeController.js
│       │   ├── aiController.js
│       │   ├── portfolioController.js
│       │   └── razorpayController.js
│       ├── middleware/         # Auth middleware
│       ├── models/            # Mongoose schemas
│       ├── routes/            # Express routes
│       ├── services/          # Groq AI service
│       └── server.js          # Entry point
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/sainiansh3004/ResumeAI.git
cd ResumeAI
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5001

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

GROQ_API_KEY=YOUR_GROQ_API_KEY

RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
```

> Get a free Groq API key at [console.groq.com](https://console.groq.com)

Run Backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
```

Run Frontend:

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# 📸 Screenshots

## Landing Page

![Landing Page](assets/landing.png)

---

## Login Page

![Login Page](assets/login.png)

---

## Dashboard

![Dashboard](assets/dashboard.png)

---

## Resume Builder

![Resume Builder](assets/builder.png)

---

## AI Summary Generation

![AI Summary Generation](assets/ai-summary.png)

---

# 🔑 REST API

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (protected) |

## Resume

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes` | Create resume |
| GET | `/api/resumes` | Get all user resumes |
| GET | `/api/resumes/:id` | Get resume by ID |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |
| POST | `/api/resumes/:id/duplicate` | Duplicate resume |

## AI (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-summary` | Generate AI resume summary |
| POST | `/api/ai/optimize-experience` | Optimize experience bullets |
| POST | `/api/ai/generate-cover-letter` | Generate cover letter |
| POST | `/api/ai/recommend-skills` | Get AI skill suggestions |

## Portfolio

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolios/me` | Get user portfolio (protected) |
| POST | `/api/portfolios` | Create/update portfolio (protected) |
| POST | `/api/portfolios/convert/:resumeId` | Convert resume to portfolio (protected) |
| GET | `/api/portfolios/subdomain/:subdomain` | Get public portfolio |

## Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/billing/razorpay-order` | Create Razorpay order (protected) |
| POST | `/api/billing/razorpay-verify` | Verify payment (protected) |

---

# 🌟 Highlights

- AI Powered Resume Generation (Groq — Llama 3.3 70B)
- 8 Premium ATS-Friendly Templates
- Portfolio Website Builder with Custom Subdomains
- Cover Letter Generator
- ATS Score Audit with Recommendations
- Experience Bullet Optimizer
- Skill Recommender
- Drag & Drop Section Reordering
- Typography & Layout Customization
- Razorpay Payment Integration
- Live Resume Preview
- PDF Export
- JWT Authentication
- Undo/Redo Support
- Responsive Design
- Auto Save

---

# 📈 Learning Outcomes

This project strengthened my understanding of:

- Full Stack Development (Next.js + Express)
- REST API Design
- JWT Authentication & Protected Routes
- MongoDB & Mongoose
- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- AI Integration using Groq (OpenAI-compatible SDK)
- Payment Gateway Integration (Razorpay)
- Drag & Drop (dnd-kit)
- PDF Generation & Print CSS
- Responsive UI Design

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

## Ansh Saini

📧 Email: sainiansh3004@gmail.com

🔗 LinkedIn: https://www.linkedin.com/in/ansh-saini-63b4322aa/

💻 GitHub: https://github.com/sainiansh3004

---

# ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub!

---

## 📜 License

This project is licensed under the MIT License.