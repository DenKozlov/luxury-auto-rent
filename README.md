🏎️ Luxury Auto Rent
A comprehensive, scalable management system for high-end vehicle rentals. This platform provides seamless booking experiences for clients and powerful administrative tools for employees, featuring a robust, security-first architecture.

🏗 Architecture
The project follows a split-repository structure designed for high performance and strict separation of concerns:

Frontend: A modern, reactive web application built with Next.js 16 (App Router).

Backend: A high-performance, modular API server built with NestJS 11.

🚀 Key Features
Advanced Access Control: Implemented a Resource-Based Access Control (ReBAC) system. While RBAC manages role-level access (Clients vs. Employees), the ReBAC layer ensures granular, object-level security, guaranteeing that users can only interact with their own resources unless granted administrative privileges.

Secure Authentication: Integrated better-auth for seamless session management and identity verification.

Event-Driven Notifications: A decoupled notification system using RabbitMQ for processing background tasks, such as automated user invitations and account lifecycle management (e.g., deletions).

Data Integrity: Built on PostgreSQL with Prisma ORM for type-safe database interactions and complex relational integrity.

🛠 Tech Stack
Frontend
Framework: Next.js 16

UI/UX: Tailwind CSS, Shadcn UI, Lucide React

State & Data: TanStack Query, React Hook Form, Zod

Backend
Framework: NestJS 11

Database: PostgreSQL + Prisma ORM

Security: better-auth, @thallesp/nestjs-better-auth, Custom Guard-based ReBAC

Infrastructure: RabbitMQ (Message Broker), AWS S3 (Media), Nodemailer (Email)

📋 Prerequisites
Node.js (v22+)

Docker & Docker Compose
