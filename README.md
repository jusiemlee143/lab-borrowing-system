# 🧪 Laboratory Borrowing Management System

A web-based **Laboratory Borrowing Management System** designed to streamline the process of borrowing laboratory tools and equipment. The system allows students to submit borrowing requests, while Laboratory-In-Charge personnel can manage requests, tools, and borrowing history. An administrator can manage system users and laboratory-related records.

The system provides a centralized platform for managing laboratory equipment, monitoring borrowing activities, and maintaining an organized record of transactions.

---

## ✨ Features

### 👨‍🎓 Student

* Submit laboratory tool borrowing requests
* Provide borrower and borrowing details
* View the status of submitted requests
* Receive updates on request approval
* Generate/manage borrowing information through the system

### 🧑‍🔬 Laboratory-In-Charge (LIC)

* Secure LIC login
* Dashboard with laboratory statistics
* View and manage borrowing requests
* Approve borrowing requests
* Reject borrowing requests with a reason
* Release approved laboratory tools
* Process returned tools
* Monitor tool availability
* Monitor low-stock laboratory tools
* View borrowing history
* Track actions performed by LIC personnel
* Search and filter borrowing history

### 👨‍💼 Administrator

* Secure administrator login
* Admin dashboard
* Create Laboratory-In-Charge accounts
* Manage LIC accounts
* Manage teacher records
* View system information
* Delete/manage records
* Password generation for newly created LIC accounts
* Forgot-password and password-reset functionality
* Manage system users

### 📊 Dashboard & Monitoring

The system provides dashboard statistics including:

* Total laboratory tools
* Available tools
* Low-stock tools
* Unavailable tools
* Pending requests
* Approved requests
* Released requests
* Returned requests
* Rejected requests
* Borrowed tools today
* Returned tools today

### 📝 History & Audit Trail

The system maintains a history of laboratory borrowing activities.

Recorded information includes:

* LIC personnel who performed an action
* Employee ID
* Action performed
* Related borrowing request
* Date and time
* Rejection reason when applicable

This provides an audit trail for laboratory transactions and helps improve accountability.

---

## 🛠️ Technologies Used

### Frontend

* **Next.js**
* **React.js**
* **TypeScript / JavaScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide React**

### Backend

* **Next.js App Router**
* **Next.js API Routes**
* **Mongoose**
* **MongoDB Atlas**
* **JWT Authentication**
* **bcryptjs**
* **Nodemailer**

### Deployment

* **Vercel**
* **MongoDB Atlas**

### Development Tools

* Git
* GitHub
* Visual Studio Code
* npm

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Students       │
                    │                     │
                    │ Submit Borrowing    │
                    │ Requests            │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Next.js App     │
                    │                     │
                    │  Frontend + API     │
                    │      Routes         │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌────────────┐ ┌────────────┐ ┌────────────┐
        │   Admin    │ │    LIC     │ │   Student  │
        │ Dashboard  │ │ Dashboard  │ │ Interface  │
        └────────────┘ └────────────┘ └────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MongoDB Atlas    │
                    │                     │
                    │ Users               │
                    │ Tools               │
                    │ Requests            │
                    │ History / Audit     │
                    └─────────────────────┘
```

---

## 👥 User Roles

The system consists of three primary user roles.

| Role                     | Main Responsibilities                                  |
| ------------------------ | ------------------------------------------------------ |
| **Admin**                | Manage LIC accounts, teachers, and system records      |
| **Laboratory-In-Charge** | Manage tools, requests, releases, returns, and history |
| **Student**              | Submit and monitor borrowing requests                  |

---

## 🔐 Authentication & Security

The system implements authentication and authorization using:

* JWT-based authentication
* HTTP cookies
* Password hashing using bcryptjs
* Role-based access control
* Protected dashboard routes
* Separate authentication flows for Admin and LIC users
* Password reset functionality
* Temporary password generation for newly created LIC accounts

Users cannot access protected dashboards without valid authentication.

---

## 📦 Laboratory Tool Management

Laboratory tools are monitored based on their current quantity.

The system automatically determines tool availability:

```text
Quantity = 0
        ↓
Unavailable

Quantity < 5
        ↓
Low Stock

Quantity >= 5
        ↓
Available
```

When an approved borrowing request is processed, the corresponding tool quantity is updated automatically.

When tools are returned, the available quantity is restored.

---

## 🔄 Borrowing Request Workflow

The general borrowing process follows this workflow:

```text
Student submits request
          │
          ▼
       PENDING
          │
     ┌────┴────┐
     │         │
     ▼         ▼
  APPROVED   REJECTED
     │
     ▼
  RELEASED
     │
     ▼
   BORROWED
     │
     ▼
   RETURNED
```

Each important action can be recorded in the system history.

---

## 🗂️ Project Structure

A simplified project structure:

```text
lab-borrowing-system/
│
├── app/
│   ├── admin/
│   │   └── dashboard/
│   │
│   ├── lab-in-charge/
│   │   └── dashboard/
│   │
│   ├── student/
│   │   └── borrow/
│   │
│   └── api/
│       ├── admin/
│       ├── auth/
│       ├── lab-in-charge/
│       └── student/
│
├── components/
│   ├── ui/
│   ├── AdminHeader
│   ├── AdminSidebar
│   ├── RequestsManager
│   ├── HistoryManager
│   └── ToolList
│
├── models/
│   ├── User
│   ├── Teacher
│   ├── Tool
│   ├── Request
│   └── utils/
│       ├── db
│       └── sendEmail
│
├── public/
│
├── proxy.ts
│
├── .env.local
├── package.json
├── tailwind.config
└── README.md
```

> The exact folder and file structure may change as the system continues to be developed.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 2. Navigate to the project

```bash
cd lab-borrowing-system
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

> Never commit `.env.local` or other files containing credentials to GitHub.

### 5. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🌐 Deployment

The application can be deployed using **Vercel**.

### Environment Variables

Before deploying, configure the required environment variables in the Vercel project settings.

Example:

```text
MONGODB_URI
JWT_SECRET
EMAIL_USER
EMAIL_PASS
```

### MongoDB Atlas

The application uses MongoDB Atlas as its cloud database.

For a Vercel deployment, MongoDB Atlas must allow connections from the deployed application.

The project's current configuration uses:

```text
0.0.0.0/0
```

in MongoDB Atlas Network Access.

> For production systems, consider using a more restrictive network/security configuration when practical.

---

## 🗄️ Database

The system uses **MongoDB Atlas** with **Mongoose** for database management.

Main data models include:

### User

Stores account information for:

* Administrators
* Laboratory-In-Charge personnel
* Students

### Teacher

Stores teacher information used by the laboratory borrowing system.

### Tool

Stores laboratory equipment information such as:

* Tool name
* Quantity
* Availability status

### Request

Stores laboratory borrowing requests and their current status.

### History / Audit Records

Stores actions performed during the borrowing process for accountability and tracking.

---

## 📧 Password Reset

The administrator account supports a password recovery process.

General workflow:

```text
Forgot Password
       │
       ▼
Enter Email
       │
       ▼
Reset Email
       │
       ▼
Reset Link
       │
       ▼
Create New Password
       │
       ▼
Password Updated
```

Email delivery is handled using **Nodemailer**.

---


---

## 🚀 Future Improvements

Possible future enhancements include:

* Email notifications for borrowing requests
* Automated return reminders
* PDF borrowing slips
* Printable reports
* Advanced audit logs
* Data export
* Inventory reports
* Analytics and charts
* Student borrowing history
* QR code-based tool identification
* QR code-based borrowing/return process
* More granular administrator permissions
* Automated database backups

---

## 🎓 Project Purpose

The Laboratory Borrowing Management System was developed to provide a more organized and efficient way of handling laboratory equipment borrowing.

Instead of relying entirely on manual records, the system provides a centralized digital platform for:

* Managing laboratory tools
* Processing borrowing requests
* Monitoring equipment availability
* Recording borrowing transactions
* Tracking returned equipment
* Maintaining an audit trail
* Managing authorized personnel

The goal is to improve **efficiency, accountability, accessibility, and accuracy** in laboratory equipment management.

---

## 👨‍💻 Developer

**Jusiem Lee P. Pontejon**

Computer Engineering Graduate

### Technologies & Skills

* C
* C#
* JavaScript
* React.js
* Next.js
* HTML
* CSS
* Tailwind CSS
* MongoDB
* Mongoose
* Firebase
* JWT
* Git & GitHub
* Arduino
* ESP8266
* ESP32

---

## 📄 License

This project was developed for educational and project purposes.

All rights reserved unless otherwise stated.
