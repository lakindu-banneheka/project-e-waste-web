# ♻️ E-Waste Inventory Management System

A full-stack inventory and project management platform designed for **Project E-Waste** at the University of Kelaniya. This system enables efficient tracking of recovered electronic materials, collaborative project management, and role-based access for contributors and administrators.

<img width="1895" height="873" alt="image" src="https://github.com/user-attachments/assets/374de46a-e2e2-4a6a-84a2-8263817b4073" />


## 🌱 Overview

The platform serves as a centralized system for:
- Managing recovered inventory and electronic components.
- Tracking student and staff contributions to sustainability projects.
- Promoting hands-on learning experiences with recycled components.

It is currently being tested in a closed environment within the university to collect feedback and iterate based on real-world usage.

---

## 🧩 Features

### 🔐 Role-Based Access

- **Admin**:
  - Manage projects and contributors.
  - Approve/decline work contributions.
  - Add/edit inventory and recovered component types.
  - Promote/demote users.

- **Contributor**:
  - Join projects, log daily work hours.
  - View inventory and add recovered items.
  - Track their own contribution history and performance.

### 📦 Inventory & Component Recovery

- Track source, condition, and status of received materials.
- Add recovered items with detailed specifications.
- Real-time count of available components with recovery logs.

### 📁 Project Management

- Create projects with details (start/end date, status, member limit).
- Join and track work hours.
- Admin review flow for approving contributions.

### 📊 Dashboards

- Visual summaries (using `recharts`) of user contributions and project data.

### 🧾 Forms & Validation

- Dynamic forms powered by `react-hook-form` and validated via `zod`.
- Only institutional emails are allowed during sign-up.

### 🔎 Tables & Filtering

- Reusable tables with search, filtering, pagination, and loading states.

### 🌘 Theming

- Support for light and dark themes.

---

## 🛠️ Tech Stack

| Layer         | Tech Used                                     |
|---------------|-----------------------------------------------|
| **Frontend**  | Next.js (TypeScript), ShadCN UI, Tailwind CSS |
| **Backend**   | Next.js API Routes, Mongoose (MongoDB ODM)    |
| **Database**  | MongoDB Atlas                                 |
| **Auth**      | NextAuth (email + role-based)                 |
| **Forms**     | React Hook Form, Zod                          |
| **State**     | TanStack Query (React Query)                  |
| **Icons**     | Lucide                                         |
| **Charts**    | Recharts                                      |
| **Deployment**| Vercel (CI/CD from GitHub)                    |

---

## 🚀 Deployment

The project is deployed on Vercel:
🔗 [Live Demo](https://ewaste-web.vercel.app/)

---

## 📁 Project Structure

/app → Next.js app directory (pages, layouts, routing)
/dashboard → Role-specific dashboards
/auth → Signin/Signup with NextAuth
/api → Backend API routes (project, inventory, auth)
/components → Reusable UI components (tables, forms, cards)
/lib → Utility functions (auth, db, validation)
/schemas → Zod schemas for form validation
/models → Mongoose models
/styles → Tailwind & global styling


---

## 🧠 Development & Git Strategy

- **Git Workflow**: Feature-branch model with 18 branches and 86 commits (and counting).
- **CI/CD**: Vercel auto-deploys from GitHub on each push to `main`.
- **Version Control Philosophy**: Each new feature is tested independently before merging to main, allowing isolated troubleshooting and safe rollback if needed.

---

## 🤝 Collaborators

- 👨‍💻 **Lakindu Banneheka** – Full-stack Developer  
- 🎨 **Pasindu Waidyarathna** – UI/UX Designer  
- 👨‍🏫 **Dr. J. A. Seneviratne** – Supervisor, Senior Lecturer (Physics & Electronics department, University of Kelaniya)

---

## 📚 Lessons Learned

- Schema design in MongoDB for semi-structured data.
- Managing authentication logic with dynamic roles.
- Clean coding practices and importance of inline documentation.
- Handling state consistency using React Query.
- Building a scalable, maintainable, full-stack app using modern technologies.

---

## 📌 License

This project is currently being tested in an academic setting. Licensing will be decided post-evaluation phase.

---

## 🧪 Future Improvements

- Real-time updates using WebSockets (e.g., for work approval status).
- Automated email notifications.
- Mobile responsiveness enhancements.
- Test coverage with Jest and Cypress.
- Admin analytics dashboard with deeper insights.

---

## 📷 Screenshots

<img width="1900" height="868" alt="image" src="https://github.com/user-attachments/assets/60568cd2-a9e6-4555-8ec7-186f252e55bf" />

<img width="1896" height="868" alt="image" src="https://github.com/user-attachments/assets/043f1f4d-40c1-48a5-adcd-b6099b1b1f87" />

<img width="1897" height="868" alt="image" src="https://github.com/user-attachments/assets/fb317a6f-c8be-4a6a-88c8-5c5f311ecc02" />

---

## 💬 Feedback & Contributions

Since this is currently a university prototype, external contributions are not open yet. However, feedback is welcome! Please open an issue or contact the author.

---
