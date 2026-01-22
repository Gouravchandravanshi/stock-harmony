# Stock Harmony - Agricultural Stock Management System

A complete full-stack application for managing agricultural product inventory, billing, and sales reports.

## 📋 Project Structure

```
stock-harmony/
├── backend/                 # Node.js/Express.js backend
│   ├── config/             # Configuration files
│   │   └── db.js           # MongoDB connection
│   ├── controllers/        # Route controllers
│   │   ├── productController.js
│   │   └── billController.js
│   ├── models/             # MongoDB schemas
│   │   ├── Product.js
│   │   ├── Bill.js
│   │   └── Customer.js
│   ├── routes/             # API routes
│   │   ├── productRoutes.js
│   │   └── billRoutes.js
│   ├── scripts/            # Utility scripts
│   │   └── seed.js         # Database seeding
│   ├── server.js           # Main server file
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── src/                     # React frontend
│   ├── components/
│   ├── pages/
│   ├── services/           # API service layer
│   │   └── api.js
│   └── ...
├── .env.example            # Frontend env example
├── vite.config.js
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and settings
# MONGODB_URI=mongodb://localhost:27017/stock-harmony
# PORT=5000
# JWT_SECRET=your-secret-key

# Seed initial data
npm run seed

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 2. Setup Frontend

```bash
# In root directory (stock-harmony/)

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your API URL
# VITE_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Products API

#### Get all products
```
GET /products
```

#### Get single product
```
GET /products/:id
```

#### Create product
```
POST /products
Content-Type: application/json

{
  "name": "Carbendazim 50% WP",
  "company": "Dhanuka Agritech",
  "category": "Fungicide",
  "quantity": 45,
  "quantityAlert": 20,
  "buyingPrice": 320,
  "sellingPriceCash": 380,
  "sellingPriceUdhaar": 400
}
```

#### Update product
```
PUT /products/:id
Content-Type: application/json

{
  "quantity": 50,
  "sellingPriceCash": 390
}
```

#### Delete product
```
DELETE /products/:id
```

#### Get low stock products
```
GET /products/low-stock
```

#### Get categories
```
GET /products/categories/list
```

### Bills API

#### Get all bills
```
GET /bills
```

#### Get pending bills
```
GET /bills/pending/list
```

#### Get single bill
```
GET /bills/:id
```

#### Create bill
```
POST /bills
Content-Type: application/json

{
  "billNumber": "KB-2024-001",
  "billType": "kaccha",
  "customer": {
    "name": "Ramesh Kumar",
    "mobile": "9876543210",
    "address": "Village Khanpur"
  },
  "items": [
    {
      "productId": "61f7d88f1c9d6400a1b2c3d4",
      "productName": "Carbendazim 50% WP",
      "quantity": 5,
      "rate": 400,
      "total": 2000
    }
  ],
  "paymentMode": "Udhaar",
  "dueDate": "2024-02-15",
  "subtotal": 2000,
  "gst": 0,
  "total": 2000
}
```

#### Update bill status
```
PATCH /bills/:id/status
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete bill
```
DELETE /bills/:id
```

#### Get bill statistics
```
GET /bills/stats/dashboard
```

## 🗄️ Database Schema

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  company: String,
  category: String,
  quantity: Number,
  quantityAlert: Number,
  buyingPrice: Number,
  sellingPriceCash: Number,
  sellingPriceUdhaar: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Bill Model
```javascript
{
  _id: ObjectId,
  billNumber: String (unique),
  billType: String (kaccha/pakka),
  customer: {
    id: String,
    name: String,
    mobile: String,
    address: String
  },
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    rate: Number,
    total: Number
  }],
  paymentMode: String (Cash/Udhaar),
  dueDate: Date,
  subtotal: Number,
  gst: Number,
  total: Number,
  status: String (pending/completed/cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

### Customer Model
```javascript
{
  _id: ObjectId,
  name: String,
  mobile: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Features

- ✅ Product Management (Add, Edit, Delete, View)
- ✅ Low Stock Alerts
- ✅ Billing System (Kaccha & Pakka bills)
- ✅ GST Calculation
- ✅ Udhaar (Credit) Management
- ✅ Bill Download/Print
- ✅ Dashboard with Statistics
- ✅ Sales Reports
- ✅ MongoDB Integration
- ✅ RESTful API
- ✅ Responsive UI

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-harmony
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## 📝 Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed initial database
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or update MONGODB_URI to your Atlas connection string
- Check if port 27017 is available (default MongoDB port)

### CORS Error
- Backend has CORS enabled for all origins
- If issues persist, check API_URL in frontend .env file

### API Not Found
- Ensure backend is running on port 5000
- Check if routes are correctly prefixed with `/api`

## 📖 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- CORS
- Dotenv

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Shadcn UI Components
- Recharts (for graphs)
- Sonner (for toasts)

## 📄 License

MIT

## 👨‍💼 Support

For issues or questions, please create an issue in the repository.
