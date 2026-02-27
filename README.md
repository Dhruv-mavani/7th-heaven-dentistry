# 🦷 Smile Guru – Full-Stack Clinic Management System

A production-grade Clinic Management System built using **Next.js, Supabase, and PostgreSQL**, designed with performance, scalability, and real-world deployment standards in mind.

🔗 **Live Demo:** https://smileguru.vercel.app  
💻 **Source Code:** https://github.com/Dhruv-mavani/Smile-Guru-dentistry  

---

## 🚀 Project Overview

Smile Guru is a modern clinic management platform that includes:

- Public-facing responsive website
- Secure admin dashboard
- Patient and appointment management
- Real-time updates using Supabase
- Performance-optimized media handling
- Production deployment on Vercel

The system was engineered to balance **aesthetic design (cinematic UI)** with **high performance optimization**.

---

## ✨ Key Features

### 🌐 Public Website
- Cinematic hero section with optimized background video
- Service showcase
- Appointment booking form
- Contact form integration
- Fully responsive across devices
- Lighthouse Performance Score: **97**

### 🔐 Admin Dashboard
- Secure authentication (Supabase Auth)
- Dashboard overview
- Patient records management
- Appointment tracking system
- Real-time notification system
- Calendar-based appointment visualization
- Status toggle (completed / pending)
- Session-based logout system

---

## 🏗 Tech Stack

### Frontend
- Next.js (App Router)
- React.js
- Tailwind CSS
- Framer Motion

### Backend
- Supabase (PostgreSQL)
- Supabase Authentication
- Supabase Realtime Subscriptions

### Deployment & DevOps
- Vercel
- Environment Variable Management
- Production Optimization

---

## ⚡ Performance Engineering

Initial version performance score: **61**

After optimization:
- Reduced video payload from 24MB → 7MB
- Implemented `preload="none"` for non-blocking media
- Added poster image fallback for faster LCP
- Disabled heavy media for mobile devices
- Optimized images to WebP
- Eliminated layout shifts (CLS = 0)
- Achieved Lighthouse Performance Score: **97**

This project demonstrates real-world performance debugging and frontend optimization skills.

---

## 📁 Folder Structure


app/
├── admin/
│ ├── dashboard/
│ ├── login/
│ ├── reset-password/
│ ├── calendar/
│ └── patients/
├── components/
├── lib/
│ └── supabase.ts
├── public/
└── layout.tsx
└── page.tsx


---

## 🔑 Environment Variables

Create a `.env.local` file:


NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


---

## 🧪 Running Locally

```bash
git clone https://github.com/Dhruv-mavani/Smile-Guru-dentistry
cd Smile-Guru-dentistry
npm install
npm run dev

Open:

http://localhost:3000

 📈 Future Improvements

Role-based access (Doctor / Receptionist)

Payment gateway integration

Analytics dashboard

WhatsApp/SMS appointment reminders

Multi-clinic SaaS architecture

👨‍💻 Author

Dhruv Mavani
Full Stack Developer
B.Tech Computer Science Engineering

⭐ If you found this project interesting, consider starring the repository.
