# 🏨 LuxuryStay Hotel Management System (HMS)

A complete **Hotel Management System** designed to automate and manage hotel operations including guest management, room management, reservations, billing, payments, housekeeping, and reporting.

The system provides a centralized platform for hotel administrators and staff to efficiently manage daily operations and improve guest experiences.

---

# 📌 Project Overview

LuxuryStay Hotel Management System is a web-based ERP solution developed to simplify hotel operations.

The system allows:

- Admins to manage users and permissions
- Staff to manage guests and bookings
- Receptionists to handle check-in/check-out
- Housekeeping staff to update room status
- Management to view reports and analytics

---

# 🎯 Project Objectives

The main objectives of this project are:

- Automate hotel management processes
- Reduce manual paperwork
- Improve booking efficiency
- Maintain guest records securely
- Provide real-time room availability
- Generate accurate billing and reports
- Improve communication between hotel departments

---

# 🚀 Features

## 👥 User Management

- Admin dashboard
- Role-based access control
- Staff account management
- User authentication
- Permission management

Supported Roles:

- Super Admin
- Admin
- Manager
- Receptionist
- Housekeeping
- Accountant
- Guest


---

# 🛏️ Room Management

Features:

- Add and manage rooms
- Room categories
- Room pricing
- Availability tracking
- Room status updates


Room Status:

- Available
- Occupied
- Reserved
- Cleaning
- Maintenance


---

# 👤 Guest Management

Manage guest information:

- Name
- Contact details
- CNIC/Passport
- Address
- Preferences
- Booking history


---

# 📅 Reservation Management

Features:

- Room booking
- Availability checking
- Guest reservation
- Check-in process
- Check-out process
- Booking cancellation
- Booking history


---

# 💳 Billing & Payment

Features:

- Automatic bill generation
- Room charges
- Additional service charges
- Payment tracking
- Invoice generation


Payment Methods:

- Cash
- Card
- Bank Transfer
- Online Payment


---

# 🧹 Housekeeping Management

Features:

- View room status
- Assign cleaning tasks
- Update cleaning progress
- Report maintenance issues


Workflow:

```
Guest Checkout
       |
       ↓
Room Cleaning
       |
       ↓
Inspection
       |
       ↓
Room Available
```

---

# 🛎 Additional Services

The system supports:

- Food service
- Laundry
- Room service
- Transportation
- Other hotel facilities


---

# 📊 Reports & Analytics

Management reports:

- Occupancy reports
- Revenue reports
- Booking reports
- Guest history
- Payment reports


---

# 🏗️ Technology Stack

## Frontend

- React.js
- React Router
- Axios
- Tailwind CSS / CSS


## Backend

- Node.js
- Express.js


## Database

- MongoDB
- Mongoose ODM


## Authentication

- JWT Authentication
- Password Encryption using bcrypt


---

# 📂 Project Structure

```
Hotel-Management-System

│
├── frontend
│
│   ├── src
│   │
│   ├── components
│   ├── pages
│   ├── services
│   └── utils
│
│
├── backend
│
│   ├── models
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── config
│   └── server.js
│
│
└── README.md

```

---

# 🗄️ Database Models

## User Model

Stores:

- Username
- Email
- Password
- Role
- Contact


## Room Model

Stores:

- Room Number
- Room Type
- Price
- Status
- Availability


## Guest Model

Stores:

- Guest Information
- Contact Details
- Preferences


## Booking Model

Stores:

- Guest
- Room
- Check-in Date
- Check-out Date
- Booking Status


## Payment Model

Stores:

- Booking
- Amount
- Payment Method
- Payment Status


## Service Model

Stores:

- Service Name
- Category
- Price
- Booking Reference


---

# ⚙️ Installation Guide

## 1. Clone Repository

```
git clone https://github.com/yourusername/Hotel-Management.git
```

---

# Backend Setup

Navigate to backend folder:

```
cd backend
```

Install dependencies:

```
npm install
```

Create environment file:

```
.env
```

Add:

```
PORT=5000

MONGO_URI=your_database_connection

JWT_SECRET=your_secret_key
```

Run backend:

```
npm start
```

Server will run:

```
http://localhost:5000
```

---

# Frontend Setup

Navigate to frontend:

```
cd frontend
```

Install packages:

```
npm install
```

Run application:

```
npm start
```

Frontend will run:

```
http://localhost:3000
```

---

# 🔐 Authentication

The system uses JWT-based authentication.

Flow:

```
Login

↓

Validate User

↓

Generate JWT Token

↓

Access Protected Routes

```

---

# 🔌 API Modules

## Authentication

```
POST /api/auth/login
POST /api/auth/register
```


## Rooms

```
GET    /api/rooms
POST   /api/rooms
PUT    /api/rooms/:id
DELETE /api/rooms/:id
```


## Guests

```
GET    /api/guests
POST   /api/guests
PUT    /api/guests/:id
DELETE /api/guests/:id
```


## Booking

```
GET    /api/bookings
POST   /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id
```

---

# 🛡️ Security Features

- JWT Authentication
- Password hashing
- Role-based authorization
- Protected APIs
- Input validation


---

# 📸 Screenshots

Add application screenshots here:

## Login Page

(Add Screenshot)


## Dashboard

(Add Screenshot)


## Room Management

(Add Screenshot)


## Booking Module

(Add Screenshot)


## Billing Module

(Add Screenshot)


---

# 🎥 Demo Video

Complete application working video:

(Add Video Link)


---

# 👨‍💻 Developer

**Project Name:**
LuxuryStay Hotel Management System

**Developer:**

Your Name

**Technology:**

MERN Stack


---

# 📄 License

This project is developed for educational and commercial purposes.
