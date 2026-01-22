# Stock Harmony - Agricultural Stock Management System

A complete agricultural stock and inventory management system with modern web interface, RESTful API backend, and MongoDB database. Perfect for agricultural supply stores, seed companies, and farm input dealers.

## 🎯 Overview

Stock Harmony provides a comprehensive solution for managing agricultural inventory, generating bills, tracking sales, and monitoring stock levels with a modern React frontend and Node.js/Express backend.

## ⚡ Quick Start

### Automated Setup (Recommended)

**Windows:**
```powershell
.\quick-start.bat
```

**Mac/Linux:**
```bash
bash quick-start.sh
```

### Manual Setup

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Configure environment variables
# Frontend: .env.local with VITE_API_URL=http://localhost:5000/api
# Backend: backend/.env with PORT=5000, MONGODB_URI, etc.

# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Frontend  
npm run dev

# Access: http://localhost:5173
```

## ✨ Key Features

- ✅ Complete inventory management (CRUD operations)
- ✅ Dual billing system (Kaccha simple + Pakka GST-compliant)
- ✅ Real-time stock tracking with low-stock alerts
- ✅ Sales analytics and reporting
- ✅ Customer management
- ✅ Modern responsive UI with Tailwind CSS
- ✅ RESTful API with 14 endpoints
- ✅ MongoDB data persistence
- ✅ Automatic inventory management on bill creation

## 📦 Technology Stack

**Frontend:**
- React 18 with Vite
- React Router
- Tailwind CSS
- Shadcn UI components
- Recharts for visualization

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- CORS support
- Environment variables with Dotenv

## 📋 API Endpoints (14 Total)

**Products (7 endpoints):**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/categories/list` - Get categories

**Bills (7 endpoints):**
- `GET /api/bills` - Get all bills
- `GET /api/bills/pending/list` - Get pending bills
- `GET /api/bills/:id` - Get specific bill
- `POST /api/bills` - Create bill
- `PATCH /api/bills/:id/status` - Update bill status
- `DELETE /api/bills/:id` - Delete bill
- `GET /api/bills/stats/dashboard` - Get statistics

## 📁 Project Structure

```
stock-harmony/
├── backend/                          # Node.js/Express backend
│   ├── config/db.js                 # MongoDB configuration
│   ├── controllers/                 # Business logic (product, bill)
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API endpoints
│   ├── scripts/seed.js              # Database seeding
│   └── server.js                    # Express app
│
├── src/                              # React frontend
│   ├── pages/                       # Page components
│   ├── components/                  # UI components
│   ├── services/api.js              # API service layer
│   └── ...
│
├── GETTING_STARTED.md               # Setup guide
├── SETUP_GUIDE.md                   # Detailed configuration
├── API_REFERENCE.md                 # Complete API docs
├── TROUBLESHOOTING.md               # Common issues
├── VERIFICATION_CHECKLIST.md        # Verification steps
└── quick-start.bat/sh               # Automation scripts
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
# Expected: MongoDB Connected, Server running on port 5000
```

### Start Frontend (Terminal 2)
```bash
npm run dev
# Expected: http://localhost:5173
```

### Seed Database (Optional)
```bash
cd backend
npm run seed
# Populates 6 sample products and 2 sample bills
```

## ⚙️ Configuration

### Environment Variables

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-harmony
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
```

### MongoDB Setup

**Local:**
```bash
# Start MongoDB
mongosh
```

**MongoDB Atlas (Cloud):**
1. Create account and cluster
2. Get connection string
3. Update MONGODB_URI in backend/.env

## 📚 Documentation

Comprehensive documentation is included:

1. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Setup with MongoDB options, troubleshooting
2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup and configuration
3. **[API_REFERENCE.md](API_REFERENCE.md)** - Complete API documentation with examples
4. **[backend/README.md](backend/README.md)** - Backend-specific details
5. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
6. **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** - Step-by-step verification

## 🔍 Verification

Verify your setup is working:

```bash
# Test backend health
curl http://localhost:5000/api/health

# Test frontend
# Open http://localhost:5173 in browser

# Verify database
# Check "MongoDB Connected" in backend console
```

See [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) for detailed verification steps.

## 🆘 Troubleshooting

**Backend won't start?**
- Check MongoDB is running
- Check port 5000 is available
- Run `cd backend && npm install`

**Frontend won't start?**
- Check Node.js v14+: `node --version`
- Run `npm install`
- Check .env.local exists with correct API URL

**API calls failing?**
- Verify backend running: `curl http://localhost:5000/api/health`
- Check MongoDB connection in backend console
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more solutions

## 🎨 Features by Page

**Dashboard:** Real-time sales stats, monthly charts, low stock alerts, pending bills

**Products:** Inventory list, search/filter, add/edit/delete, quantity tracking

**Billing:** Create bills (Cash/Udhaar), customer info, automatic inventory updates

**Reports:** Sales analysis, product statistics, monthly trends

## 📊 Database Models

**Product:** Name, company, category, quantity, prices (buying, cash, credit), alerts

**Bill:** Number, type (kaccha/pakka), customer, items, payment mode, GST, status

**Customer:** Name, mobile, address

## 🔐 Future Features

- User authentication (JWT)
- Role-based access control
- Advanced reporting
- Multi-location support
- Mobile app
- Email notifications
- Barcode scanning

## 📝 License

MIT License - See LICENSE file for details

## 🎓 Development

Built with modern web standards and best practices:
- Clean code architecture
- Proper error handling
- Input validation
- Responsive design
- Accessibility considerations

---

**Version:** 1.0.0 | **Status:** Ready for Development | **Last Updated:** December 2024
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
