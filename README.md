# 🐾 EchoSoft

EchoSoft is a **production-ready web application** used by veterinary professionals to manage ultrasound consultations, generate clinical reports, and store medical images in the cloud.

> 🚀 This is not a demo project — EchoSoft is actively used by real clients and generates recurring revenue.

---

## 📌 Overview

EchoSoft is designed specifically for **veterinary sonographers** (ultrasound specialists). It allows them to:

- Manage clinics, veterinarians, and patients (pets)
- Create and edit ultrasound consultations
- Generate structured clinical reports efficiently
- Upload and organise large volumes of ultrasound images
- Export professional PDF reports
- Store all data securely in the cloud

The system is built with scalability and real-world workflows in mind.

---

## ✨ Key Features

- 🧾 **Structured Report Builder**
  - Organ-based input system (liver, kidneys, spleen, etc.)
  - Dynamic report generation with templates

- ⚡ **Quick Mode**
  - Fast workflow for generating reports using pre-defined templates

- 🖼 **Ultrasound Image Management**
  - Upload multiple images per consultation
  - Grid view with zoom functionality
  - Cloud storage with metadata

- 📄 **PDF Export**
  - Generate professional clinical reports using Puppeteer

- 🧠 **State Management**
  - Global state handled with Zustand for performance and simplicity

- ☁️ **Cloud Integration**
  - Supabase (PostgreSQL + Storage)

---

## 🛠 Tech Stack

**Frontend**

- React 19
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MUI (DataGrid)

**Backend / Services**

- Next.js API Routes
- Supabase (PostgreSQL database)
- Supabase Storage (image handling)

**Other Tools**

- Zustand (state management)
- Puppeteer (PDF generation)
- Vercel (deployment)

---

## 🏗 Architecture Highlights

- Modular and scalable folder structure
- Separation between:
  - UI components
  - Hooks (business logic)
  - Queries (data layer)
- Custom hooks for data fetching and mutations
- Reusable and composable components
- Clean mapping layer for domain logic (organs → database fields)

---

## 📂 Project Structure (Simplified)

```
app/
  consultations/
  dashboard/
  home/

components/
hooks/
lib/
  queries/
  services/
reports/
types/
```

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/eco-soft.git
cd eco-soft
npm install
npm run dev
```

## 🔐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key


```

## 💡 What Makes This Project Stand Out

- ✅ Built for real users and real business needs
- ✅ Handles complex domain logic (medical reporting)
- ✅ Manages large datasets and media files
- ✅ Uses modern production stack
- ✅ Demonstrates full-stack capabilities
- ✅ Focus on performance and UX

---

## 📈 Future Improvements

- Role-based access control
- Advanced image tools (annotations, tagging)
- Report versioning
- Analytics dashboard

---

## 👨‍💻 About Me

I'm a **Front-End Developer based in London**, currently working and open to new opportunities.

- Strong focus on React, Next.js, and modern UI development
- Experience building real-world, production applications
- Currently seeking Front-End Developer roles in London
- Interested in growing into a Full-Stack Developer role

---

## 📬 Contact

Feel free to reach out:

- LinkedIn: https://www.linkedin.com/in/eduardo-lulo/
- Portfolio: https://eduardo-lulo-portfolio.netlify.app/
- GitHub: https://github.com/edujlulo
- Email: eduardo.lulo.m@gmail.com

---

## ⭐ Final Note

EchoSoft represents my ability to build **real, scalable, production-level applications** — not just tutorials or prototypes.
