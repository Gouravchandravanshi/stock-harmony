# 📁 Stock Harmony - Complete File Manifest

This document lists all files in the Stock Harmony project and their purposes.

## Project Root Directory

```
stock-harmony/
```

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | Frontend dependencies and scripts |
| `.env.example` | Frontend environment template |
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `components.json` | Shadcn UI components configuration |
| `postcss.config.js` | PostCSS configuration |
| `eslint.config.js` | ESLint code quality rules |
| `.gitignore` | Git ignore rules |
| `index.html` | Main HTML entry point |
| `bun.lockb` | Bun lockfile (can be removed if using npm) |
| `package-lock.json` | npm dependencies lock file |

### Documentation Files (10 files)
| File | Purpose | Lines |
|------|---------|-------|
| `README.md` | Project overview and quick start | 250+ |
| `GETTING_STARTED.md` | Complete setup guide | 1000+ |
| `SETUP_GUIDE.md` | Detailed configuration | 400+ |
| `API_REFERENCE.md` | Complete API documentation | 800+ |
| `TROUBLESHOOTING.md` | Common issues and solutions | 600+ |
| `VERIFICATION_CHECKLIST.md` | Step-by-step verification | 700+ |
| `BACKEND_INTEGRATION_SUMMARY.md` | Integration details | 300+ |
| `PROJECT_COMPLETION.md` | Completion summary | 400+ |
| `DOCUMENTATION_INDEX.md` | Documentation guide | 300+ |
| `FINAL_CHECKLIST.md` | Project completion checklist | 250+ |

### Automation Scripts
| File | Purpose | OS |
|------|---------|-----|
| `quick-start.bat` | Automated setup | Windows |
| `quick-start.sh` | Automated setup | Mac/Linux |

### Directories
- `backend/` - Backend Node.js/Express application
- `src/` - Frontend React application
- `public/` - Static assets
- `node_modules/` - Frontend dependencies (auto-installed)
- `.git/` - Git repository

---

## Backend Directory (`backend/`)

### Main Files
| File | Purpose | Type |
|------|---------|------|
| `server.js` | Express application entry point | JavaScript |
| `package.json` | Backend dependencies and scripts | JSON |
| `.env.example` | Backend environment template | Text |
| `.gitignore` | Git ignore rules | Text |
| `README.md` | Backend documentation | Markdown |

### Configuration (`backend/config/`)
| File | Purpose |
|------|---------|
| `db.js` | MongoDB connection configuration |

### Database Models (`backend/models/`)
| File | Purpose |
|------|---------|
| `Product.js` | Product schema and model |
| `Bill.js` | Bill schema and model |
| `Customer.js` | Customer schema and model |

### Business Logic (`backend/controllers/`)
| File | Functions (7 each) |
|------|-------------------|
| `productController.js` | getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getLowStockProducts, getCategories |
| `billController.js` | getAllBills, getPendingBills, getBillById, createBill, updateBillStatus, deleteBill, getBillStats |

### API Routes (`backend/routes/`)
| File | Endpoints |
|------|-----------|
| `productRoutes.js` | 7 product endpoints |
| `billRoutes.js` | 7 bill endpoints |

### Utilities (`backend/scripts/`)
| File | Purpose |
|------|---------|
| `seed.js` | Database seeding script (6 products, 2 bills) |

---

## Frontend Directory (`src/`)

### Main Files
| File | Purpose |
|------|---------|
| `main.jsx` | React application entry point |
| `App.jsx` | Main App component with routing |
| `App.css` | Application styles |
| `index.css` | Global styles |

### Pages (`src/pages/`)
| File | Purpose | API Integration |
|------|---------|-----------------|
| `Dashboard.jsx` | Dashboard with stats | ✅ Full integration |
| `Products.jsx` | Product inventory | ✅ Full integration |
| `AddProduct.jsx` | Add new product form | ✅ Full integration |
| `Billing.jsx` | Generate bills | ✅ Full integration |
| `Reports.jsx` | Sales reports | ✅ Full integration |
| `Login.jsx` | Login page | Template |
| `Signup.jsx` | Signup page | Template |
| `Settings.jsx` | Settings page | Template |
| `NotFound.jsx` | 404 page | Static |

### Components (`src/components/`)

#### Layout Components
| File | Purpose |
|------|---------|
| `layout/DashboardLayout.jsx` | Main dashboard layout |
| `layout/Sidebar.jsx` | Navigation sidebar |

#### UI Components (`src/components/ui/`)
| File | Purpose |
|------|---------|
| `badge.jsx` | Badge component |
| `button.jsx` | Button component |
| `card.jsx` | Card component |
| `dialog.jsx` | Dialog/Modal component |
| `input.jsx` | Input field component |
| `label.jsx` | Label component |
| `radio-group.jsx` | Radio button group |
| `select.jsx` | Select dropdown |
| `separator.jsx` | Separator/divider |
| `switch.jsx` | Toggle switch |
| `tabs.jsx` | Tab component |
| `toast.jsx` | Toast notification |
| `toaster.jsx` | Toast container |
| `tooltip.jsx` | Tooltip component |
| `sonner.jsx` | Sonner toast setup |

#### Other Components
| File | Purpose |
|------|---------|
| `NavLink.jsx` | Navigation link component |

### Services (`src/services/`)
| File | Purpose |
|------|---------|
| `api.js` | Centralized API service (productAPI, billAPI) |

### Utilities (`src/lib/`)
| File | Purpose |
|------|---------|
| `utils.js` | Utility functions |

### Hooks (`src/hooks/`)
| File | Purpose |
|------|---------|
| `use-mobile.jsx` | Mobile detection hook |
| `use-toast.js` | Toast notification hook |

### Data (`src/data/`)
| File | Purpose |
|------|---------|
| `mockData.js` | Mock data (not used with API integration) |

### Test (`src/test/`)
| File | Purpose |
|------|---------|
| (empty) | For future testing |

---

## Public Directory (`public/`)

| File | Purpose |
|------|---------|
| `robots.txt` | SEO robots configuration |

---

## File Statistics

### Count by Type
- JavaScript/JSX files: 40+
- JSON files: 3
- Markdown files: 10
- Configuration files: 6
- Shell scripts: 1
- Batch scripts: 1
- Total: 60+ files

### Code Statistics
- Backend JavaScript: 800+ lines
- Frontend JavaScript/JSX: 2000+ lines
- Documentation: 4000+ lines
- **Total: 6800+ lines**

### Directory Size
- `backend/`: ~50 KB (with node_modules: ~200 MB)
- `src/`: ~100 KB
- `public/`: ~1 KB
- **Total: ~150 KB (without node_modules)**

---

## File Organization Strategy

### Backend Structure (MVC Pattern)
```
backend/
├── config/          → Configuration
├── controllers/     → Business logic
├── models/         → Database schemas
├── routes/         → API endpoints
├── scripts/        → Utilities
└── server.js       → Main application
```

### Frontend Structure (React Best Practices)
```
src/
├── pages/          → Full page components
├── components/     → Reusable components
├── services/       → API services
├── hooks/          → Custom React hooks
├── lib/            → Utilities
├── data/           → Mock/static data
└── test/           → Testing utilities
```

---

## Important Files for Development

### Essential Backend Files
1. **backend/server.js** - Main Express app
2. **backend/config/db.js** - Database configuration
3. **backend/controllers/** - Business logic
4. **backend/routes/** - API endpoints
5. **backend/.env** - Environment variables

### Essential Frontend Files
1. **src/services/api.js** - API communication
2. **src/App.jsx** - Main app structure
3. **src/pages/** - Page components
4. **src/components/layout/DashboardLayout.jsx** - Layout

### Essential Configuration Files
1. **backend/.env** - Backend config
2. **.env.local** - Frontend config
3. **vite.config.js** - Build configuration
4. **package.json** - Frontend dependencies
5. **backend/package.json** - Backend dependencies

---

## Files to Modify for Customization

### Configuration Changes
- `.env.local` - Change API URL
- `backend/.env` - Change database URI, port, secrets

### Feature Additions
- `src/pages/` - Add new pages
- `src/components/` - Add new components
- `backend/routes/` - Add new API routes
- `backend/controllers/` - Add new business logic
- `backend/models/` - Modify database schemas

### Styling Changes
- `src/App.css` - Global styles
- `src/index.css` - Base styles
- `tailwind.config.js` - Tailwind configuration

### Database Changes
- `backend/scripts/seed.js` - Modify sample data
- `backend/models/` - Update schemas

---

## Generated Files (Not to be Manually Edited)

These files are generated or installed automatically:
- `node_modules/` - All dependencies
- `package-lock.json` - Lock file (generated)
- `bun.lockb` - Bun lock file (generated)
- `dist/` - Production build (generated)

---

## Critical Files Checklist

### Must Exist
- ✅ `backend/server.js`
- ✅ `backend/config/db.js`
- ✅ `backend/models/Product.js`
- ✅ `backend/models/Bill.js`
- ✅ `backend/models/Customer.js`
- ✅ `backend/controllers/productController.js`
- ✅ `backend/controllers/billController.js`
- ✅ `backend/routes/productRoutes.js`
- ✅ `backend/routes/billRoutes.js`
- ✅ `src/services/api.js`
- ✅ `src/pages/Dashboard.jsx`
- ✅ `src/pages/Products.jsx`
- ✅ `src/pages/AddProduct.jsx`
- ✅ `src/pages/Billing.jsx`

### Must Be Configured
- ✅ `backend/.env` (from .env.example)
- ✅ `.env.local` (from .env.example)
- ✅ `backend/package.json` (with npm install)
- ✅ `package.json` (with npm install)

---

## Build Artifacts (After Build)

Running `npm run build` generates:
```
dist/
├── assets/
│   ├── index-*.js
│   ├── index-*.css
│   └── ...
├── index.html
└── ...
```

---

## Git Tracking

### Tracked Files
- All source code (.js, .jsx)
- Configuration files (except .env)
- Documentation (.md)
- Scripts

### Ignored Files (in .gitignore)
- `node_modules/`
- `.env` (use .env.example)
- `dist/`
- `.DS_Store`
- Log files

---

## File Naming Conventions

### Naming Rules Used
- **Components**: PascalCase (e.g., `Dashboard.jsx`)
- **Utilities**: camelCase (e.g., `productController.js`)
- **Configuration**: lowercase with dashes (e.g., `vite.config.js`)
- **Documentation**: UPPERCASE with dashes (e.g., `GETTING_STARTED.md`)

---

## Total Project Content

| Category | Count | Size |
|----------|-------|------|
| Documentation files | 10 | 4000+ lines |
| Source code files | 40+ | 2800+ lines |
| Configuration files | 6 | 500+ lines |
| Automation scripts | 2 | 200+ lines |
| **Total** | **60+** | **7500+ lines** |

---

## Version Control

### Repository Info
- Type: Git
- Location: `.git/`
- Files tracked: 50+
- Files ignored: node_modules, .env, dist

---

**Last Updated:** December 2024  
**Version:** 1.0.0

For file-specific information, refer to:
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Documentation guide
- [API_REFERENCE.md](API_REFERENCE.md) - API file details
- [backend/README.md](backend/README.md) - Backend file details
