# Stock Harmony - Verification Checklist

This document helps you verify that the entire Stock Harmony application is properly set up and running correctly.

## Prerequisites Check

- [ ] **Node.js installed** - Run `node --version` (should be v14 or higher)
- [ ] **npm installed** - Run `npm --version` (should be v6 or higher)
- [ ] **MongoDB available** - Either local MongoDB running or MongoDB Atlas connection string ready
- [ ] **Git installed** - Run `git --version` (for version control)

## Step 1: Directory Structure Verification

Verify that the project has all required folders and files:

```bash
# From project root, check backend structure
dir backend\                 # Windows
ls -la backend/              # Mac/Linux

# Should contain: config/, controllers/, models/, routes/, scripts/, package.json, server.js
```

- [ ] `backend/` folder exists
- [ ] `backend/config/db.js` exists
- [ ] `backend/controllers/productController.js` exists
- [ ] `backend/controllers/billController.js` exists
- [ ] `backend/models/Product.js` exists
- [ ] `backend/models/Bill.js` exists
- [ ] `backend/models/Customer.js` exists
- [ ] `backend/routes/productRoutes.js` exists
- [ ] `backend/routes/billRoutes.js` exists
- [ ] `backend/scripts/seed.js` exists
- [ ] `backend/server.js` exists
- [ ] `src/services/api.js` exists (frontend API service)

## Step 2: Environment Configuration

Check that environment files are properly configured:

### Backend Configuration

1. **Check backend/.env**
   ```bash
   # Windows
   type backend\.env
   
   # Mac/Linux
   cat backend/.env
   ```
   
   Should contain:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stock-harmony
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   ```

- [ ] `backend/.env` exists
- [ ] `PORT` is set to `5000`
- [ ] `MONGODB_URI` points to valid MongoDB (local or Atlas)
- [ ] `NODE_ENV` is set to `development`

**If using MongoDB Atlas:**
- [ ] Replace `MONGODB_URI` with your Atlas connection string
- [ ] Ensure credentials are correct in the URI
- [ ] Ensure IP address is whitelisted in MongoDB Atlas

### Frontend Configuration

1. **Check .env.local**
   ```bash
   # Windows
   type .env.local
   
   # Mac/Linux
   cat .env.local
   ```
   
   Should contain:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

- [ ] `.env.local` exists
- [ ] `VITE_API_URL` is set correctly
- [ ] Points to backend server address

## Step 3: Dependencies Installation

Check that all dependencies are installed:

```bash
# Check root frontend dependencies
npm list | head -20

# Check backend dependencies
cd backend && npm list | head -20
```

- [ ] Root `node_modules/` folder exists
- [ ] `backend/node_modules/` folder exists
- [ ] All dependencies are installed (no missing modules)

## Step 4: Database Connection Test

Test MongoDB connection:

### Option A: Local MongoDB

1. **Verify MongoDB is running:**
   ```bash
   # Windows
   mongod --version
   
   # Mac/Linux
   mongod --version
   ```

2. **Connect to MongoDB:**
   ```bash
   # Windows
   mongosh
   
   # Mac/Linux
   mongosh
   ```
   
   Should show connection successful.

- [ ] MongoDB server is running
- [ ] Can connect using mongosh/mongo shell

### Option B: MongoDB Atlas

1. **Verify connection string:**
   - [ ] Have MongoDB Atlas account
   - [ ] Retrieved connection string from Atlas
   - [ ] Username and password are correct
   - [ ] IP address is whitelisted
   - [ ] Connection string starts with `mongodb+srv://`

## Step 5: Backend Server Test

Start the backend server and verify it runs:

```bash
cd backend
npm run dev
```

Look for these messages in console:
```
> nodemon server.js
[nodemon] starting `node server.js`
MongoDB Connected: localhost
Server is running on port 5000
Environment: development
```

- [ ] Backend server starts without errors
- [ ] MongoDB connection successful
- [ ] Server runs on port 5000
- [ ] No error messages in console

### Test Backend Health Endpoint

Open a new terminal/PowerShell and test:

```bash
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/health"

# Command Prompt
curl http://localhost:5000/api/health

# Mac/Linux
curl http://localhost:5000/api/health
```

Should return:
```json
{"message":"Backend is running successfully!"}
```

- [ ] Health check endpoint responds with 200 status
- [ ] Returns success message

### Test Backend API Endpoints

```bash
# Get all products (should return empty array initially)
curl http://localhost:5000/api/products

# Get categories (should return array with categories)
curl http://localhost:5000/api/products/categories/list

# Get all bills (should return empty array initially)
curl http://localhost:5000/api/bills
```

- [ ] GET /api/products returns valid JSON
- [ ] GET /api/products/categories/list returns categories
- [ ] GET /api/bills returns valid JSON

## Step 6: Database Seeding

Populate sample data into the database:

```bash
cd backend
npm run seed
```

Should show output:
```
Clearing existing data...
Creating products...
Creating bills...
Seeding completed successfully!
```

- [ ] Seed script runs without errors
- [ ] Database is populated with sample data
- [ ] No connection errors

### Verify Seeded Data

```bash
# Test products endpoint (should now show 6 products)
curl http://localhost:5000/api/products

# Test bills endpoint (should now show 2 bills)
curl http://localhost:5000/api/bills
```

- [ ] Products endpoint returns 6 items
- [ ] Bills endpoint returns 2 items
- [ ] Data structure is correct with all fields

## Step 7: Frontend Server Test

In a new terminal/PowerShell, start the frontend:

```bash
# From project root (not backend folder)
npm run dev
```

Should show:
```
  VITE v... build ... for production
  
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

- [ ] Frontend server starts without errors
- [ ] Runs on port 5173 (or next available port)
- [ ] No build errors
- [ ] No TypeScript errors (should be pure JS)

## Step 8: Application Functionality Test

Open browser and navigate to `http://localhost:5173`

### Dashboard Page

- [ ] Page loads without errors
- [ ] Shows Dashboard header
- [ ] Displays stat cards (Total Products, Low Stock, Today's Sales, Pending Amount)
- [ ] Shows "Add Product" and "Generate Bill" buttons
- [ ] Displays monthly sales chart
- [ ] Shows pending bills list
- [ ] Shows low stock products list

### Products Page

```bash
Navigate to: http://localhost:5173/products
```

- [ ] Page loads and displays all 6 seeded products
- [ ] Each product shows: Name, Company, Category, Quantity, Price
- [ ] Search filter works
- [ ] Category filter shows all categories
- [ ] Can see "Delete" and "Edit" buttons for each product
- [ ] Product quantity from database is displayed

### Add Product Page

```bash
Navigate to: http://localhost:5173/products/add
```

- [ ] Page loads without errors
- [ ] Form has all fields: Product Name, Company, Category, Quantity, Quantity Alert, Buying Price, Selling Price (Cash), Selling Price (Udhaar)
- [ ] Category dropdown fetches from backend
- [ ] Can fill in form without errors
- [ ] "Create Product" button works
- [ ] After creation, redirects to Products page
- [ ] New product appears in Products list

### Billing Page

```bash
Navigate to: http://localhost:5173/billing/new
```

- [ ] Page loads without errors
- [ ] Bill Type selector works (Kaccha/Pakka)
- [ ] Payment Mode selector works
- [ ] Products dropdown populated from backend (shows all 6 products)
- [ ] Can select products and add to bill
- [ ] Quantity calculation works
- [ ] Total calculation is correct
- [ ] "Generate Bill" button creates a bill
- [ ] Bill shows in Dashboard pending bills list (if Udhaar mode)

### Reports Page

```bash
Navigate to: http://localhost:5173/reports
```

- [ ] Page loads without errors
- [ ] Displays sales data from backend
- [ ] Shows product-wise sales information

## Step 9: API Integration Test

Check browser developer console (F12) for errors:

```bash
Press F12 -> Console Tab
```

- [ ] No red error messages
- [ ] No 404 errors for API calls
- [ ] All API responses show in Network tab with 200/201 status

### Network Tab Test

Open Developer Tools (F12) -> Network Tab

1. **Navigate to Products page**
   - [ ] See request to `http://localhost:5000/api/products` (200 status)
   - [ ] See request to `http://localhost:5000/api/products/categories/list` (200 status)

2. **Navigate to Dashboard**
   - [ ] See request to `http://localhost:5000/api/bills/stats/dashboard` (200 status)
   - [ ] See request to `http://localhost:5000/api/products` (200 status)
   - [ ] See request to `http://localhost:5000/api/bills/pending/list` (200 status)

3. **Generate a new bill**
   - [ ] See POST request to `http://localhost:5000/api/bills` (201 status)
   - [ ] Bill successfully created and saved in database

## Step 10: Data Persistence Test

Test that data persists across page refreshes:

1. **Create a new product** via Add Product page
2. **Refresh the page** (Ctrl+R or Cmd+R)
3. **Go to Products page**
   - [ ] New product still appears
   - [ ] Data persisted to database (not lost on refresh)

4. **Create a new bill** via Billing page
5. **Go to Dashboard**
   - [ ] New bill appears in pending bills list
   - [ ] Statistics updated with new data

## Step 11: Error Handling Test

Test how the application handles errors:

### Stop Backend Server

1. Stop the backend server (Ctrl+C in backend terminal)
2. Try to navigate to Products page

- [ ] Page shows error toast notification
- [ ] Graceful error handling (doesn't crash)
- [ ] User-friendly error message displayed

### Restart Backend Server

1. Restart backend: `cd backend && npm run dev`
2. Refresh the Products page

- [ ] Page loads successfully again
- [ ] Data loads without errors

## Step 12: Console Output Verification

### Backend Console

Should show successful operations:

```
Seeding completed successfully!
POST /api/products 201 ✓
POST /api/bills 201 ✓
GET /api/products 200 ✓
```

- [ ] No TypeScript compilation errors
- [ ] All MongoDB operations successful
- [ ] HTTP status codes are correct

### Frontend Console (F12 Developer Tools)

- [ ] No red error messages
- [ ] No warnings about missing components
- [ ] No TypeScript errors

## Step 13: File Structure Verification

Verify that all TypeScript has been removed and only JavaScript files exist:

```bash
# Search for .ts and .tsx files in src/
dir /s src\*.ts        # Windows - should return nothing
find src -name "*.ts"  # Mac/Linux - should return nothing

# Verify .jsx files exist
dir src\*.jsx          # Windows
find src -name "*.jsx" # Mac/Linux
```

- [ ] No .ts files in src/ directory
- [ ] No .tsx files in src/ directory
- [ ] No tsconfig.json in root
- [ ] All React files are .jsx
- [ ] All utility files are .js

## Step 14: Package.json Scripts Verification

Verify all npm scripts are available:

```bash
# Frontend scripts
npm run dev      # Should start Vite dev server
npm run build    # Should build for production

# Backend scripts
cd backend
npm run dev      # Should start nodemon server
npm run start    # Should start production server
npm run seed     # Should populate database
```

- [ ] `npm run dev` works in root (frontend)
- [ ] `npm run build` works in root (builds frontend)
- [ ] `cd backend && npm run dev` works (backend)
- [ ] `cd backend && npm run seed` works (seeding)

## Final Verification Summary

If all checkboxes above are checked, your Stock Harmony application is:

✅ **Properly installed** - All dependencies present  
✅ **Correctly configured** - Environment files set up  
✅ **Connected to database** - MongoDB connected successfully  
✅ **API endpoints working** - All 14 endpoints functional  
✅ **Frontend integrated** - All pages connected to backend  
✅ **Data persisting** - All data saved to database  
✅ **Error handling working** - Graceful error responses  
✅ **Ready for development** - All components working together  

## Troubleshooting

If any checklist item fails, refer to:

1. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Comprehensive setup guide with troubleshooting section
2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed API documentation
3. **[backend/README.md](backend/README.md)** - Backend-specific documentation
4. **[BACKEND_INTEGRATION_SUMMARY.md](BACKEND_INTEGRATION_SUMMARY.md)** - Summary of all changes made

## Quick Command Reference

```bash
# Start everything (from project root)
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev

# Access application
# Open browser to: http://localhost:5173

# Seed database
cd backend
npm run seed

# View MongoDB
mongosh
use stock-harmony
db.products.find()
db.bills.find()
```

## Environment Variables Checklist

### Backend (.env)
```
✓ PORT=5000
✓ MONGODB_URI=mongodb://localhost:27017/stock-harmony
✓ NODE_ENV=development
✓ JWT_SECRET=stock_harmony_secret_key
```

### Frontend (.env.local)
```
✓ VITE_API_URL=http://localhost:5000/api
```

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** Ready for Development
