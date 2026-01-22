# Stock Harmony - Troubleshooting Guide

This guide provides solutions for common issues you might encounter when setting up or running Stock Harmony.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [MongoDB Connection Issues](#mongodb-connection-issues)
3. [Backend Server Issues](#backend-server-issues)
4. [Frontend Issues](#frontend-issues)
5. [API Communication Issues](#api-communication-issues)
6. [Data Issues](#data-issues)
7. [Port Conflicts](#port-conflicts)
8. [Performance Issues](#performance-issues)

---

## Installation Issues

### Issue: `npm install` fails with permission error

**Windows:**
```
Error: EACCES: permission denied
```

**Solution:**
1. Open PowerShell as Administrator
2. Run: `npm install --no-optional`
3. If still fails, clear npm cache:
   ```powershell
   npm cache clean --force
   npm install
   ```

### Issue: `package-lock.json` conflicts

**Error Message:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Delete lock files and reinstall
rm -r node_modules
rm package-lock.json
npm install

# For backend
cd backend
rm -r node_modules
rm package-lock.json
npm install
```

### Issue: Module not found after installation

**Error Message:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Verify installation in correct directory
cd backend
npm list express

# Reinstall specific package
npm install express

# Or reinstall all dependencies
npm install
```

### Issue: `bun.lockb` file interference

**Error Message:**
```
npm ERR! Found: bun
```

**Solution:**
If you're using npm (not bun), remove the lockfile:
```bash
# Windows
del bun.lockb

# Mac/Linux
rm bun.lockb
```

---

## MongoDB Connection Issues

### Issue: Cannot connect to MongoDB

**Error Message:**
```
Error connecting to MongoDB: connect ECONNREFUSED 127.0.0.1:27017
```

**Causes & Solutions:**

**1. MongoDB not running (Local MongoDB)**

- **Windows:**
  ```bash
  # Check if MongoDB is running
  Get-Service MongoDB
  
  # Start MongoDB
  net start MongoDB
  
  # If service doesn't exist, install MongoDB Community Edition
  # Download from: https://www.mongodb.com/try/download/community
  ```

- **Mac (with Homebrew):**
  ```bash
  # Check status
  brew services list
  
  # Start MongoDB
  brew services start mongodb-community
  
  # Verify connection
  mongosh
  ```

- **Linux (Ubuntu/Debian):**
  ```bash
  # Check status
  systemctl status mongod
  
  # Start MongoDB
  sudo systemctl start mongod
  
  # Verify connection
  mongosh
  ```

**2. MongoDB Atlas (Cloud)**

- **Invalid connection string:**
  ```
  ✗ Wrong: mongodb+srv://user:password@cluster.mongodb.net/database
  ✓ Correct: mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
  ```

- **Solution:**
  1. Log in to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
  2. Go to Cluster → Connect
  3. Choose "Connect your application"
  4. Copy the connection string
  5. Replace `<password>` with your database user password
  6. Update `backend/.env`:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-harmony
     ```

- **IP Whitelist not configured:**
  ```
  Error: Error: getaddrinfo ENOTFOUND cluster...
  ```
  
  Solution:
  1. Go to MongoDB Atlas → Security → Network Access
  2. Click "Add IP Address"
  3. Choose "Allow access from anywhere" (for development)
     OR add your specific IP address
  4. Click "Confirm"

- **Username/Password incorrect:**
  ```
  Error: Error: connect EAUTH authentication failed
  ```
  
  Solution:
  1. Go to MongoDB Atlas → Security → Database Access
  2. Verify your username and password
  3. Update connection string with correct credentials

### Issue: Connection timeout with MongoDB Atlas

**Error Message:**
```
MongooseError: connection timeout
```

**Solutions:**
1. Check internet connection
2. Verify IP address is whitelisted (add 0.0.0.0/0 for development)
3. Check connection string format (includes `?retryWrites=true&w=majority`)
4. Increase timeout in `backend/config/db.js`:
   ```javascript
   const conn = await mongoose.connect(mongoUri, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     serverSelectionTimeoutMS: 10000, // Increase to 10 seconds
   });
   ```

### Issue: Database connection drops after a while

**Error Message:**
```
MongooseError: Cannot read property 'then' of undefined
```

**Solution:**
Enable automatic reconnection in `backend/config/db.js`:
```javascript
const conn = await mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

---

## Backend Server Issues

### Issue: Backend server won't start

**Error Message:**
```
Error: listen EADDRINUSE :::5000
```

**Solution:** Port 5000 is already in use. See [Port Conflicts](#port-conflicts) section.

### Issue: `nodemon: command not found`

**Error Message:**
```
bash: nodemon: command not found
```

**Solution:**
```bash
cd backend
npm install --save-dev nodemon
npm run dev
```

### Issue: Backend crashes on startup

**Error Message:**
```
Cannot find module 'express'
```

**Solution:**
```bash
cd backend
# Check what's installed
npm list

# Reinstall all dependencies
npm install
```

### Issue: Syntax errors in backend files

**Error Message:**
```
SyntaxError: Unexpected token
```

**Solution:**
1. Check that all backend files are `.js` (not `.ts`)
2. Ensure proper import/export syntax
3. Verify no TypeScript syntax in JavaScript files:
   ```javascript
   // ✗ Wrong (TypeScript)
   async function getName(): string { ... }
   
   // ✓ Correct (JavaScript)
   async function getName() { ... }
   ```

### Issue: Environment variables not loading

**Error Message:**
```
Error: Cannot read property 'PORT' of undefined
```

**Solution:**
1. Verify `backend/.env` exists and has content
2. Verify `dotenv` import at top of `server.js`:
   ```javascript
   import dotenv from 'dotenv';
   dotenv.config();
   ```
3. Verify `.env` file format (no spaces around `=`):
   ```
   ✓ PORT=5000
   ✗ PORT = 5000
   ```

---

## Frontend Issues

### Issue: Frontend won't start

**Error Message:**
```
Error: ENOENT: no such file or directory 'vite.config.js'
```

**Solution:**
1. Verify you're in the project root directory (not `backend/`)
2. Verify `vite.config.js` exists
3. Reinstall dependencies:
   ```bash
   # From project root
   rm -r node_modules
   npm install
   npm run dev
   ```

### Issue: Port 5173 already in use

**Error Message:**
```
Error: Port 5173 is already in use
```

**Solution:** See [Port Conflicts](#port-conflicts) section.

### Issue: TypeScript errors in frontend

**Error Message:**
```
TS2307: Cannot find module '@/components/...'
```

**Solution:**
1. Verify you're using `.jsx` files (not `.tsx`)
2. Verify `vite.config.js` has correct path alias:
   ```javascript
   resolve: {
     alias: {
       '@': '/src',
     },
   },
   ```
3. Clear cache and rebuild:
   ```bash
   npm run build
   ```

### Issue: CSS not loading

**Symptoms:**
- Application shows without styling
- No color or layout

**Solution:**
1. Verify `src/index.css` and `src/App.css` exist
2. Verify imports in `src/main.jsx`:
   ```javascript
   import './index.css'
   import './App.css'
   ```
3. Clear Vite cache:
   ```bash
   rm -r node_modules/.vite
   npm run dev
   ```

### Issue: Components not rendering

**Error Message:**
```
Cannot find module '@/components/...'
```

**Solution:**
1. Verify component file exists
2. Verify correct file extension (`.jsx` not `.js`)
3. Verify export syntax:
   ```javascript
   // ✓ Correct
   export default function Component() { ... }
   
   // ✓ Correct
   export { Component };
   ```

---

## API Communication Issues

### Issue: CORS errors when calling backend

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

1. **Verify CORS is enabled in backend** (`backend/server.js`):
   ```javascript
   import cors from 'cors';
   app.use(cors());
   ```

2. **Verify backend dependencies installed**:
   ```bash
   cd backend
   npm install cors
   ```

3. **If using specific origin**, update `server.js`:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173',
   }));
   ```

4. **Clear browser cache**:
   - Press `Ctrl+Shift+Delete` or `Cmd+Shift+Delete`
   - Clear all cache
   - Refresh page

### Issue: API returns 404 errors

**Error Message:**
```
GET http://localhost:5000/api/products 404 (Not Found)
```

**Causes & Solutions:**

1. **Backend not running**
   - Start backend: `cd backend && npm run dev`

2. **Wrong API URL in frontend**
   - Check `.env.local`:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```
   - Should end with `/api` (not `/`)

3. **Route not registered**
   - Verify `backend/server.js` has:
     ```javascript
     app.use('/api/products', productRoutes);
     app.use('/api/bills', billRoutes);
     ```

4. **Wrong method or path**
   - Verify request method (GET, POST, PUT, DELETE)
   - Check `src/services/api.js` for correct endpoints

### Issue: API returns 500 errors

**Error Message:**
```
POST http://localhost:5000/api/products 500 (Internal Server Error)
```

**Solution:**
1. Check backend console for error message
2. Verify request body is valid JSON
3. Verify all required fields are sent
4. Check database is connected:
   ```bash
   # Test with curl
   curl http://localhost:5000/api/health
   ```

### Issue: API calls timing out

**Error Message:**
```
TypeError: Failed to fetch
```

**Causes & Solutions:**

1. **Backend not running**
   - Verify backend started: `cd backend && npm run dev`

2. **Database too slow to respond**
   - Check MongoDB is responsive
   - If using MongoDB Atlas, verify internet connection

3. **Large dataset response**
   - Implement pagination in API calls
   - Reduce data fetched per request

### Issue: API authentication failing

**Error Message:**
```
401 Unauthorized
```

**Note:** Authentication not yet implemented, but JWT infrastructure is in place.

**Future implementation:**
1. Send token in Authorization header:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

---

## Data Issues

### Issue: No data appears in application

**Symptoms:**
- Products page shows empty list
- Dashboard shows 0 products

**Solutions:**

1. **Database not seeded**
   ```bash
   cd backend
   npm run seed
   ```

2. **Wrong database**
   - Verify correct MongoDB database is being used
   - Check `backend/.env` for correct database name

3. **Database connection not working**
   - Test with mongosh:
     ```bash
     mongosh
     use stock-harmony
     db.products.find()
     ```

### Issue: Data doesn't persist after refresh

**Symptoms:**
- Add a product, page refreshes, product is gone

**Causes & Solutions:**

1. **Backend not running**
   - Data is only saved when backend API is called
   - Start backend: `cd backend && npm run dev`

2. **API call failed silently**
   - Check browser console (F12) for errors
   - Check Network tab for API request status

3. **Using mock data instead of API**
   - Verify components use `productAPI` and `billAPI`
   - Check no fallback to `mockData.js`

### Issue: Duplicate data in database

**Symptoms:**
- Run seed script multiple times, data duplicates

**Solution:**
- Seed script clears existing data before seeding
- If duplicates exist, use mongosh to clear:
  ```bash
  mongosh
  use stock-harmony
  db.products.deleteMany({})
  db.bills.deleteMany({})
  db.customers.deleteMany({})
  ```

### Issue: Incorrect data in database

**Error Message:**
```
Validation error: quantity must be a number
```

**Solution:**
1. Check request body in API calls
2. Verify data types match schema:
   ```javascript
   // Product schema expects:
   quantity: Number (not String)
   price: Number (not String)
   ```

3. Clear incorrect data:
   ```bash
   mongosh
   use stock-harmony
   db.products.deleteMany({})
   ```

---

## Port Conflicts

### Issue: Port 5000 already in use (Backend)

**Error Message:**
```
Error: listen EADDRINUSE :::5000
```

**Solutions:**

**Option 1: Change backend port**
1. Update `backend/.env`:
   ```
   PORT=5001
   ```

2. Update frontend `.env.local`:
   ```
   VITE_API_URL=http://localhost:5001/api
   ```

**Option 2: Find and kill process using port 5000**

- **Windows (PowerShell as Admin):**
  ```powershell
  # Find process
  netstat -ano | findstr :5000
  
  # Kill process (replace PID with actual ID)
  taskkill /PID <PID> /F
  ```

- **Mac/Linux:**
  ```bash
  # Find process
  lsof -i :5000
  
  # Kill process (replace PID)
  kill -9 <PID>
  ```

### Issue: Port 5173 already in use (Frontend)

**Error Message:**
```
Port 5173 is already in use, trying 5174...
```

**Solution:**
Vite automatically tries the next port (5174, 5175, etc.)
- Just access the alternative port shown in console
- Or kill the process using port 5173 (see above)

---

## Performance Issues

### Issue: Application loads slowly

**Causes & Solutions:**

1. **Large dataset in products list**
   - Implement pagination or lazy loading
   - Fetch data in smaller chunks

2. **MongoDB queries too slow**
   - Add indexes to frequently queried fields
   - In mongosh:
     ```javascript
     db.products.createIndex({ category: 1 })
     db.bills.createIndex({ status: 1 })
     ```

3. **Network latency to MongoDB Atlas**
   - Use local MongoDB for development
   - Or ensure MongoDB Atlas cluster is in same region as deployment

### Issue: API calls very slow

**Symptoms:**
- Page takes 5+ seconds to load data
- Loading spinner stays visible for long

**Solutions:**

1. **Check backend logs**
   - Look for database query times
   - May indicate slow MongoDB query

2. **Optimize database queries**
   - Verify indexes are created
   - Check `billController.js` aggregation pipelines

3. **Network issues**
   - Check internet connection
   - Try from different location

### Issue: Frontend build is slow

**Symptoms:**
- `npm run build` takes 2+ minutes

**Solution:**
```bash
# Clear cache and rebuild
rm -r dist
rm -r node_modules/.vite
npm run build
```

---

## Getting More Help

If your issue isn't covered here:

1. **Check the logs:**
   - Backend console for MongoDB/Express errors
   - Browser console (F12) for frontend errors
   - Network tab (F12) for API errors

2. **Verify your setup:**
   - Run `VERIFICATION_CHECKLIST.md`
   - Ensure all prerequisites are met

3. **Review documentation:**
   - [GETTING_STARTED.md](GETTING_STARTED.md) - Setup guide
   - [SETUP_GUIDE.md](SETUP_GUIDE.md) - API documentation
   - [backend/README.md](backend/README.md) - Backend guide

4. **Try these general steps:**
   ```bash
   # Clear cache and reinstall
   rm -r node_modules
   rm package-lock.json
   npm install
   
   # Backend
   cd backend
   rm -r node_modules
   rm package-lock.json
   npm install
   ```

5. **Restart everything:**
   - Kill all node processes
   - Close all terminals
   - Start fresh with `npm run dev` (frontend) and `npm run dev` (backend)

---

**Last Updated:** December 2024  
**Version:** 1.0.0
