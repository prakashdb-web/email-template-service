# Dynamic Email Template Service (Node.js)

A backend microservice built using Node.js and Express.js that sends dynamic emails using templates stored in a MySQL database.

The service replaces template placeholders like `{{name}}` or `{{company}}` with real values before sending the email using Nodemailer.

---

# Tech Stack

* Node.js
* Express.js
* MySQL
* Nodemailer

---

# Features

✔ Dynamic email templates stored in database
✔ Email credentials managed through database configuration
✔ Template variable replacement
✔ Modular project structure
✔ Error handling for API responses
✔ Simple REST API for sending emails

---

# Project Structure

```
project
│
├── config
│   └── db.js
│
├── controllers
│   └── emailController.js
│
├── routes
│   └── emailRoutes.js
│
├── services
│   ├── templateService.js
│   └── emailConfigService.js
│
├── utils
│   └── emailUtil.js
│
├── app.js
├── server.js
└── package.json
```

---

# Installation

Clone the repository

```
git clone https://github.com/your-repository/email-template-service.git
```

Move into the project directory

```
cd email-template-service
```

Install dependencies

```
npm install
```

---

# Database Setup

Create database

```sql
CREATE DATABASE email_service;
```

Use database

```sql
USE email_service;
```

---

# Templates Table

Create table for storing email templates.

```sql
CREATE TABLE templates (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100),
 subject TEXT,
 body TEXT
);
```

Example template:

```sql
INSERT INTO templates (name, subject, body)
VALUES (
'welcome',
'Welcome {{name}}',
'Hello {{name}}, welcome to our platform.'
);
```

---

# Email Configuration Table

Create table for storing email credentials.

```sql
CREATE TABLE email_config (
 id INT AUTO_INCREMENT PRIMARY KEY,
 mail_user VARCHAR(255) NOT NULL,
 mail_pass VARCHAR(255) NOT NULL,
 service VARCHAR(100) DEFAULT 'gmail'
);
```

Insert email configuration.

```sql
INSERT INTO email_config (mail_user, mail_pass, service)
VALUES (
'your-email@gmail.com',
'your-app-password',
'gmail'
);
```

Note: When using Gmail, an **App Password** must be generated instead of the normal account password.

---

# Running the Server

Start the server

```
node server.js
```

Server runs on:

```
http://localhost:1000
```

---

# API Endpoint

Send Email

```
POST /email/send-email
```

Example request body:

```
{
 "to": "recipient@example.com",
 "subject": "Welcome",
 "template": "Hello {{name}}, welcome to {{company}}",
 "values": {
   "name": "User",
   "company": "Example Organization"
 }
}
```

---

# Example Output

Subject:

```
Welcome User
```

Body:

```
Hello User, welcome to Example Organization
```

---

# How It Works

```
Client Request
      ↓
Express Route
      ↓
Controller
      ↓
Email Utility
      ↓
Database (Email Config + Templates)
      ↓
Nodemailer sends email
```
