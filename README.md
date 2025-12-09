# LuxeMart - Premium E-commerce Application

## Project Context
LuxeMart is a modern, responsive e-commerce web application built with **Next.js 15**, **React 19**, **MongoDB**, and **Framer Motion**. It features a premium design aesthetic, server-side authentication, a scalable hybrid cart system, and a newsletter subscription service.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Frontend library**: React 19
- **Database**: MongoDB Atlas (with Mongoose)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Authentication**: Custom JWT-based Auth (HTTP-only cookies)
- **Icons**: Lucide React

## Core Features
1.  **Authentication**
    - Signup (`/api/auth/signup`) using bcryptjs for password hashing.
    - Login (`/api/auth/login`) generating secure JWTs.
    - Protected routes & user role management (User/Admin).

2.  **Shopping Cart System (Hybrid)**
    - **Guest Mode**: Cart stored in `localStorage` for non-logged-in users.
    - **Auth Mode**: Cart synced to MongoDB `User.cart` array when logged in.
    - **Seamless Experience**: Automatic state switching via `CartContext`.

3.  **Wishlist**
    - Dedicated page (`/wishlist`) to save items for later.
    - Currently local-only (future backend integration planned).

4.  **Newsletter**
    - Decoupled `Subscriber` collection for scalability.
    - Idempotent API (`/api/newsletter`) preventing duplicate records while giving positive user feedback.
    - Integrated directly into a reusable `Newsletter` component.

## Architecture

### Folder Structure
```
src/
├── app/                  
│   ├── api/              # Backend API Routes (Auth, Cart, Newsletter)
│   ├── cart/             # Cart Page
│   ├── shop/             # Product Listing & Details
│   └── ...
├── components/           # Reusable UI Components
│   ├── Navbar/           
│   ├── Footer/           
│   ├── Newsletter/       
│   └── ...               
├── context/              # Global State (CartContext)
├── lib/                  # Utilities (DB connection, formats)
├── models/               # Mongoose Schemas (User, Subscriber)
└── ...
```

## Data Models

### User (src/models/User.ts)
- `name`: String (Required)
- `email`: String (Unique, Required)
- `password`: String (Hashed)
- `role`: "user" | "admin"
- `cart`: Array of product items (Embedded for performance)

### Subscriber (src/models/Subscriber.ts)
- `email`: String (Unique, Indexed)
- `status`: "active" | "unsubscribed" | "pending"
- `source`: String (e.g., "footer")

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_super_secure_random_string
```

### 3. Installation
```bash
npm install
# Ensure backend deps are installed:
npm install mongoose bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

### 4. Running Locally
```bash
npm run dev
```
Visit `http://localhost:3000`.

## API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user | No |
| `POST` | `/api/auth/login` | Login & set cookie | No |
| `GET` | `/api/cart` | Get user's cart | Yes |
| `POST` | `/api/cart` | Add item to cart | Yes |
| `PUT` | `/api/cart` | Sync full cart | Yes |
| `POST` | `/api/newsletter` | Subscribe email | No |

## Design System
- **Colors**: Defined in `globals.css` (primary blue palette).
- **Typography**: Clean sans-serif.
- **Components**: Modular and self-contained in `src/components`.
