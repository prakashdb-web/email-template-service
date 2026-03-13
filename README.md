# Dynamic Email Template Service (Node.js)

A Node.js microservice that sends dynamic emails using stored templates from a MySQL database.

The service replaces template variables like `{{name}}` with real values before sending emails.

---

# Tech Stack

Node.js
Express.js
MySQL
Nodemailer
dotenv

---

# Features

* Dynamic email templates
* MySQL database integration
* Gmail email sending
* Template variable replacement
* Production style project structure
* Error handling middleware

---

# Project Structure

```
project
│
├── Config
│   ├── db.js
│   └── mailer.js
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
│   └── templateParser.js
│
├── app.js
├── server.js
└── .env
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

# Environment Variables

Create `.env` file

```
PORT=3001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=email_service

MAIL_USER=yourgmail@gmail.com
MAIL_PASS=your_app_password
```

---

# Database

Create table

```
CREATE TABLE templates (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100),
 subject TEXT,
 body TEXT
);
```

Example data

```
INSERT INTO templates (name,subject,body)
VALUES
(
'welcome',
'Welcome {{name}}',
'Hello {{name}}, hope you are well. Regards {{sender}}'
);
```

---

# Running the Server

```
node server.js
```

Server runs on

```
http://localhost:3001
```

---

# API Endpoint

POST

```
http://localhost:3001/api/sendEmail
```

Request Body

```
{
 "templateName":"welcome",
 "to":"receiver@gmail.com",
 "data":{
  "name":"Light",
  "sender":"Sai"
 }
}
```

---

# Output

Email will be sent with replaced template values.

Example

Subject

```
Welcome Light
```

Body

```
Hello Light, hope you are well. Regards Sai
```

---

# Author

Developed as a backend microservice using Node.js and MySQL.
