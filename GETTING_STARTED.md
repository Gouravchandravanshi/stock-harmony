# 🚀 Stock Harmony - Complete Setup Instructions

## Overview

Stock Harmony is now a complete full-stack application with:
- **Backend**: Node.js + Express.js + MongoDB
- **Frontend**: React + Vite + Tailwind CSS
- **API**: RESTful API for all features
- **Database**: MongoDB for data persistence

---

## Prerequisites

Before you start, ensure you have:

1. **Node.js** (v14+) - [Download here](https://nodejs.org/)
2. **MongoDB** (one of the following):
   - Local MongoDB installation
   - MongoDB Atlas account (free cloud database)

### Check Node.js Installation
```bash
node -v
npm -v
```

---

## Quick Start (Automatic Setup)

### Windows Users
```bash
quick-start.bat
```

### Mac/Linux Users
```bash
bash quick-start.sh
```

This will automatically:
- Install all dependencies
- Create environment files
- Prepare backend and frontend

---

## Manual Setup (Step by Step)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `backend/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-harmony
NODE_ENV=development
JWT_SECRET=your-secret-key
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-harmony
```

**Start Backend:**
```bash
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server is running on port 5000
Environment: development
```

---

### Step 2: Database Seeding (Optional but Recommended)

In a new terminal:
```bash
cd backend
npm run seed
```

This creates:
- 6 sample products (various agricultural chemicals)
- 2 sample bills
- All with realistic data

---

### Step 3: Frontend Setup

```bash
# Go back to root directory
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

**Edit `.env.local`:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## Accessing the Application

Once both servers are running:

1. **Frontend**: Open http://localhost:5173 in your browser
2. **Backend API**: http://localhost:5000/api
3. **Health Check**: http://localhost:5000/api/health

---

## Key Functionalities

### 1. Product Management
- ✅ Add new products
- ✅ Edit product details
- ✅ Delete products
- ✅ View all products
- ✅ Filter by category
- ✅ View low stock products
- ✅ Real-time stock updates

### 2. Billing System
- ✅ Create Kaccha bills (simple bills)
- ✅ Create Pakka bills (GST invoices)
- ✅ Cash and Udhaar (credit) payment modes
- ✅ Customer details tracking
- ✅ Bill download/print
- ✅ GST calculation

### 3. Dashboard
- ✅ Total products count
- ✅ Low stock alerts
- ✅ Today's sales figure
- ✅ Pending udhaar amount
- ✅ Monthly sales trend (6-month view)
- ✅ Recent pending bills

### 4. Reports (If Implemented)
- ✅ Sales reports
- ✅ Stock reports
- ✅ Udhaar/Credit reports

---

## Testing the Application

### Test 1: Add a Product
1. Click "Add Product" on dashboard
2. Fill in product details
3. Select category
4. Click "Save"
5. Product appears in Products list

### Test 2: Create a Bill
1. Go to Billing page
2. Search and add products
3. Enter customer details
4. Select payment mode
5. Click "Generate Bill"
6. Check dashboard - sales update

### Test 3: Check Dashboard
1. Go to Dashboard
2. Verify statistics updated
3. Check low stock items
4. View pending bills
5. See sales trend

---

## MongoDB Setup

### Option 1: Local MongoDB

**Install MongoDB:**
- Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Mac: `brew install mongodb-community`
- Linux: Follow [official guide](https://docs.mongodb.com/manual/installation/)

**Start MongoDB:**
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
# or
mongod
```

Connection string:
```env
MONGODB_URI=mongodb://localhost:27017/stock-harmony
```

### Option 2: MongoDB Atlas (Cloud) - Recommended

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free account available)
3. Create a new cluster
4. In "Database Access", create username/password
5. In "Network Access", add your IP (or 0.0.0.0 for anywhere)
6. Click "Connect" → "Connect your application"
7. Copy connection string

Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-harmony
```

---

## Troubleshooting

### Issue: MongoDB Connection Failed

**Error:**
```
Error connecting to MongoDB: connect ECONNREFUSED
```

**Solutions:**
1. Ensure MongoDB is running locally, OR
2. Check connection string for MongoDB Atlas
3. Verify USERNAME and PASSWORD in connection string
4. Check if IP is whitelisted in MongoDB Atlas

### Issue: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Change PORT in `backend/.env`
2. Or kill process using port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

### Issue: API Connection Failed (Frontend)

**Error:**
```
Failed to fetch from http://localhost:5000/api
```

**Solutions:**
1. Check `.env.local` has correct VITE_API_URL
2. Ensure backend is running (`npm run dev`)
3. Check backend is on port 5000
4. Check CORS is enabled (it is by default)

### Issue: Seed Script Fails

**Error:**
```
Error seeding database
```

**Solutions:**
1. Ensure MongoDB connection works
2. Check database name in MONGODB_URI
3. Try deleting existing database: `db.dropDatabase()`
4. Run seed again

### Issue: Port 5173 Not Available

**Error:**
```
Port 5173 is already in use
```

**Solutions:**
1. Frontend will auto-try port 5174
2. Or kill process using port 5173
3. Or change port in `vite.config.js`

---

## File Structure Reference

```
stock-harmony/
├── backend/                     # Backend server
│   ├── config/db.js            # MongoDB config
│   ├── controllers/            # Route handlers
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── scripts/seed.js         # Seed script
│   ├── server.js               # Main server
│   ├── package.json
│   └── .env                    # Environment vars
├── src/                        # Frontend React app
│   ├── services/api.js         # API calls
│   ├── pages/                  # Route pages
│   ├── components/             # React components
│   └── ...
├── .env.local                  # Frontend env vars
├── quick-start.sh/bat          # Setup scripts
└── README files                # Documentation
```

---

## Environment Variables Checklist

### Backend (`backend/.env`)
- [ ] PORT=5000
- [ ] MONGODB_URI set correctly
- [ ] NODE_ENV=development
- [ ] JWT_SECRET set

### Frontend (`.env.local`)
- [ ] VITE_API_URL=http://localhost:5000/api

---

## Common Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed database
npm run seed
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Next Steps (After Setup)

1. **Explore the Application**
   - Create some products
   - Generate bills
   - View reports

2. **Customize** (Optional)
   - Modify bill template
   - Add more categories
   - Customize colors/themes

3. **Deploy** (When Ready)
   - Backend: Deploy to Heroku, Railway, or AWS
   - Frontend: Deploy to Vercel or Netlify
   - Database: Use MongoDB Atlas

4. **Security** (For Production)
   - Enable authentication
   - Use HTTPS
   - Restrict CORS
   - Add API rate limiting
   - Secure environment variables

---

## Support & Documentation

- **Setup Guide**: Read `SETUP_GUIDE.md`
- **Backend Docs**: Read `backend/README.md`
- **Integration Summary**: Read `BACKEND_INTEGRATION_SUMMARY.md`
- **API Endpoints**: Check `SETUP_GUIDE.md` - API Documentation section

---

## Success Checklist

After setup, verify:
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Can load products page
- [ ] Can add a product
- [ ] Can create a bill
- [ ] Dashboard shows statistics
- [ ] Database seeded with sample data

---

## 🎉 You're All Set!

Your Stock Harmony application is now ready to use. Start managing your agricultural stock inventory efficiently!

For any issues, refer to the **Troubleshooting** section or check the documentation files.

**Happy Farming! 🌾**
