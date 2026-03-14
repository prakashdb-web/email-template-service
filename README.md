# Dynamic Email Template Service (Node.js)

A backend microservice built using Node.js and Express.js that sends dynamic emails using stored templates from a MySQL database.

The service replaces template variables like `{{customerName}}` with real values before sending emails.

---

# Tech Stack

* Node.js
* Express.js
* MySQL
* Nodemailer

---

# Features

* Dynamic email templates
* MySQL database integration
* Gmail email sending
* Template variable replacement
* Modular and scalable project structure
* Basic error handling

---

# Project Structure

```text
project
│
├── config
│   ├── db.js
│   └── mailConfig.js
│
├── controllers
│   └── emailController.js
│
├── routes
│   └── emailRoutes.js
│
├── services
│   └── templateService.js
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
git clone https://github.com/YOUR_USERNAME/email-template-service.git
```

Install dependencies

```
npm install
```

---

# Email Configuration

Email credentials are stored in the **mail configuration file**.

File:

```
config/mailConfig.js
```

Example configuration:

```javascript
module.exports = {
  mailUser: "your-email@gmail.com",
  mailPass: "your-app-password"
};
```

⚠️ If using Gmail, generate an **App Password** from your Google account instead of using your normal password.

---

# Database Setup

Create database

```
CREATE DATABASE email_service;
```

Create template table

```
CREATE TABLE templates (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100),
 subject TEXT,
 body TEXT
);
```

Insert example template

```
INSERT INTO templates (name, subject, body)
VALUES (
'welcome_email',
'Welcome {{customerName}}',
'Hello {{customerName}}, we are glad to have you with us. Best regards, {{companyName}}'
);
```

---

# Running the Server

Start the application:

```
node server.js
```

Server runs on:

```
http://localhost:1000
```

---

# API Endpoint

### Send Email

POST

```
http://localhost:1000/email/send-email
```

---

# Request Body Example

```
{
 "templateName": "welcome_email",
 "to": "recipient@example.com",
 "data": {
   "customerName": "Alex",
   "companyName": "Example Company"
 }
}
```

---

# Example Email Output

### Subject

```
Welcome Alex
```

### Body

```
Hello Alex, we are glad to have you with us. Best regards, Example Company
```

---

# Author

Backend microservice demonstrating a scalable email templating system using Node.js and MySQL.


