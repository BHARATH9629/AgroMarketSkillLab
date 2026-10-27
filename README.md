# 🌱 AgroMarket – Smart Agricultural Marketplace & Farmer Advisory Portal

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.x-black?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-LLaMA%203.3-f55036)](https://groq.com/)
[![MIT App Inventor](https://img.shields.io/badge/MIT%20App%20Inventor-Mobile%20Ready-A4C639?logo=android&logoColor=white)](https://appinventor.mit.edu/)

**AgroMarket** is a modern, enterprise-grade agricultural web platform connecting local farmers directly with buyers, retailers, and wholesalers. It features comprehensive dual-language localization (English & Kannada), an intelligent AI crop advisory assistant powered by Groq, hybrid relational + NoSQL databases, role-based dashboards, and seamless integration with **MIT App Inventor** mobile apps for field order tracking.

---

## 🌟 Key Features

### 1. 🌐 Complete Bilingual Support (English & ಕನ್ನಡ)
- Instant language toggle switching the entire interface between English and Kannada.
- Full localization across Hero, Marketplace, Product Cards, Cart, Authentication Modals, Dashboards, and the AI Chatbot.

### 2. 🌾 Direct Farmer-to-Buyer Marketplace
- **Farmer Listing Engine**: Farmers can list agricultural produce with units (kg, quintal, bag), prices, minimum order quantities, and harvest details.
- **Interactive Marketplace**: Filtering by category (Grains, Vegetables, Fruits, Organic, Pulses), price, and live availability.
- **Cart & Order Processing**: Full checkout flow with Cash on Delivery (COD) and Online Payment options.

### 3. 🤖 AI Crop Advisor (Powered by Groq LLaMA 3.3)
- Real-time agricultural intelligence assisting farmers with:
  - 🌾 Crop selection and seasonal sowing guidance
  - 💰 Live market price estimations
  - 🧪 Soil health, fertilizer dosage, and NPK calculations
  - 🐛 Pest and disease identification with organic remedies
  - ☀️ Weather forecasts and irrigation schedules
- Fluent response generation in both English and Kannada.

### 4. 📱 MIT App Inventor Integration
- Lightweight REST endpoints designed specifically for MIT App Inventor's `Web` component (`/api/mit/order/:id`).
- Returns formatted order status cards directly viewable on Android smartphones in field conditions.

### 5. 🛡️ Role-Based Access & Admin Portal
- Distinct portals for **Farmers**, **Buyers**, and **Administrators**.
- Dedicated `/admin` control room for user verification, product moderation, order fulfillment oversight, and revenue analytics.

### 6. 📊 Hybrid Database Architecture
- **MySQL (`mysql2`)**: ACID-compliant transactional data (users, profiles, product listings, orders, payments, coupons).
- **MongoDB (`mongoose`)**: Real-time marketplace analytics, search queries, price trend logs, and system audits.

---

## 📁 Repository Structure

```text
├── admin.html               # Dedicated Administrator control dashboard
├── index.html               # Main frontend portal (Marketplace, Hero, AI UI)
├── style.css                # Premium responsive design system & dark/light theme
├── app.js                   # Client-side state, localization engine, dynamic UI
├── ai.js                    # AI chatbot client-side streaming & chip handlers
├── server.js                # Express application entry point & routing mount
├── db.js                    # MySQL connection pool configuration
├── mongodb.js               # MongoDB Mongoose schemas & analytics logging
├── schema.sql               # Complete MySQL database creation script (17 tables)
├── .env.example             # Safe environment variable configuration template
├── .gitignore               # Strict exclusion of secrets, keys, and dependencies
├── routes/
│   ├── admin.js             # Platform administration & moderation endpoints
│   ├── ai.js                # Groq / Generative AI endpoint with streaming
│   ├── analytics.js         # MongoDB aggregation & dashboard statistics
│   ├── auth.js              # User registration, login, and JWT issuance
│   ├── cart.js              # Shopping cart operations
│   ├── categories.js        # Agricultural product categories
│   ├── coupons.js           # Promotional discount codes & verification
│   ├── dashboard.js         # Farmer & Buyer personal dashboard stats
│   ├── farmers.js           # Farmer profiles & store management
│   ├── logistics.js         # Delivery tracking & courier dispatch
│   ├── messages.js          # Direct farmer-buyer chat communication
│   ├── mit.js               # MIT App Inventor mobile app integration API
│   ├── notifications.js     # User alerts & push notifications
│   ├── orders.js            # Order placement, invoice, & status updates
│   ├── payments.js          # Payment transaction processing
│   ├── products.js          # CRUD product catalog management
│   ├── reviews.js           # Product ratings & buyer reviews
│   └── wishlist.js          # Buyer saved items & favorites
└── package.json             # Project dependencies & scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
Before running the application, ensure you have installed:
1. **[Node.js](https://nodejs.org/)** (v18.0.0 or higher)
2. **[MySQL Server](https://dev.mysql.com/downloads/mysql/)** (v8.0+)
3. **[MongoDB Community Server](https://www.mongodb.com/try/download/community)** (Running locally on default port `27017` or via MongoDB Atlas)
4. **[Groq API Key](https://console.groq.com/)** (Free tier available for ultra-fast LLaMA inference)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/BHARATH9629/AgroMarketSkillLab.git
cd AgroMarketSkillLab
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```

Open `.env` in your text editor and fill in your credentials:
```env
PORT=5000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=agriproject_db

# MongoDB Analytics
MONGO_URI=mongodb://localhost:27017/agrimarket_analytics

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend Base URL
FRONTEND_URL=http://localhost:5000

# AI Crop Advisor
GROQ_API_KEY=your_groq_api_key_here
```

> **Security Note**: Never commit your `.env` file to version control. The `.gitignore` is pre-configured to keep your credentials safe.

---

### Step 4: Setup the MySQL Database
1. Open your MySQL terminal or GUI client (e.g., MySQL Workbench, phpMyAdmin):
   ```sql
   CREATE DATABASE IF NOT EXISTS agriproject_db;
   ```
2. Import the schema script included in this repository:
   ```bash
   mysql -u root -p agriproject_db < schema.sql
   ```

### Step 5: Start the Server
```bash
npm start
```
Or for development with automatic restart:
```bash
node server.js
```

When started successfully, you will see:
```text
====================================================
🌱 AgroMarket Enterprise Server Running!
💻 Local:       http://localhost:5000
🚀 API:         http://localhost:5000/api
🛡️  Admin Portal: http://localhost:5000/admin
📱 Phone Access: http://<your-ip>:5000
====================================================
✅ MySQL connected to agriproject_db!
✅ MongoDB connected to agrimarket_analytics!
```

---

## 📱 MIT App Inventor Integration Guide

AgroMarket includes dedicated API endpoints optimized for **MIT App Inventor**:

- **Endpoint**: `GET /api/mit/order/:id`
- **Output**: Clean plain text formatted card ready for a Mobile `Label` component.

### MIT App Inventor Blocks Setup:
1. Drag a **TextBox** (`TextBox1`), a **Button** (`Button1`), a **Web** component (`Web1`), and a **Label** (`ResultLabel`) onto your screen.
2. In the Blocks Editor:
   ```text
   when Button1.Click:
       set Web1.Url to join ("http://<YOUR_LAPTOP_IP>:5000/api/mit/order/", TextBox1.Text)
       call Web1.Get

   when Web1.GotText (url, responseCode, responseType, responseContent):
       set ResultLabel.Text to get responseContent
   ```
3. Type any order number (e.g., `1`) into the text box and click the button to see instant order tracking.

---

## 🔐 API Reference Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new Farmer or Buyer account |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/products` | Fetch marketplace products with optional filters |
| `POST` | `/api/products` | List new agricultural produce (Farmers only) |
| `POST` | `/api/ai/chat` | AI Agricultural advisory query (English/Kannada) |
| `GET` | `/api/mit/order/:id` | Plain-text order tracking for MIT App Inventor |
| `GET` | `/api/admin/overview` | Platform-wide analytics and statistics |
| `GET` | `/api/categories` | Retrieve all produce categories |
| `GET` | `/api/orders/my-orders` | Retrieve authenticated user's order history |

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the ISC License. See `LICENSE` for more information.

---

## 👨‍💻 Author
**Bharath L**  
- GitHub: [@BHARATH9629](https://github.com/BHARATH9629)
- Repository: [AgroMarketSkillLab](https://github.com/BHARATH9629/AgroMarketSkillLab)
