# Stock Harmony - Complete API Reference

This document provides comprehensive details about all API endpoints in Stock Harmony.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, all endpoints are open (no authentication required for development).

**Future Implementation:** JWT tokens will be required for authentication:
```javascript
// Authorization header format (when implemented)
Authorization: Bearer <jwt_token>
```

## Response Format

All API responses are JSON format with consistent structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid data/parameters |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## Product Endpoints

Base path: `/api/products`

### 1. Get All Products

**Endpoint:** `GET /api/products`

**Description:** Retrieve all products from the inventory

**Query Parameters:**
- `sort` (optional): Sort field (default: `-createdAt` for newest first)
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Example Request:**
```bash
curl http://localhost:5000/api/products
curl http://localhost:5000/api/products?sort=name
```

**Example Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Carbendazim",
    "company": "Bayer",
    "category": "Fungicide",
    "quantity": 45,
    "quantityAlert": 20,
    "buyingPrice": 250,
    "sellingPriceCash": 350,
    "sellingPriceUdhaar": 375,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Imidacloprid",
    "company": "Syngenta",
    "category": "Insecticide",
    "quantity": 12,
    "quantityAlert": 25,
    "buyingPrice": 450,
    "sellingPriceCash": 600,
    "sellingPriceUdhaar": 650,
    "createdAt": "2024-01-10T09:20:00.000Z",
    "updatedAt": "2024-01-10T09:20:00.000Z"
  }
]
```

**Error Response (500):**
```json
{
  "message": "Error fetching products",
  "error": "Database connection failed"
}
```

---

### 2. Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Description:** Retrieve a specific product by its MongoDB ID

**URL Parameters:**
- `id` (required): MongoDB ObjectId of the product

**Example Request:**
```bash
curl http://localhost:5000/api/products/507f1f77bcf86cd799439011
```

**Example Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Carbendazim",
  "company": "Bayer",
  "category": "Fungicide",
  "quantity": 45,
  "quantityAlert": 20,
  "buyingPrice": 250,
  "sellingPriceCash": 350,
  "sellingPriceUdhaar": 375,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "message": "Product not found"
}
```

---

### 3. Create Product

**Endpoint:** `POST /api/products`

**Description:** Add a new product to the inventory

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Glyphosate",
  "company": "Monsanto",
  "category": "Herbicide",
  "quantity": 30,
  "quantityAlert": 15,
  "buyingPrice": 200,
  "sellingPriceCash": 300,
  "sellingPriceUdhaar": 325
}
```

**Field Validation:**
- `name` (string, required): Product name
- `company` (string, required): Manufacturing company
- `category` (string, required): Must be from predefined list
- `quantity` (number, required): Must be ≥ 0
- `quantityAlert` (number, required): Alert threshold for low stock
- `buyingPrice` (number, required): Purchase cost
- `sellingPriceCash` (number, required): Selling price for cash sales
- `sellingPriceUdhaar` (number, required): Selling price for credit sales

**Valid Categories:**
- "Fungicide"
- "Insecticide"
- "Herbicide"
- "Fertilizer"
- "Growth Regulator"
- "Nutrient"

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Glyphosate",
    "company": "Monsanto",
    "category": "Herbicide",
    "quantity": 30,
    "quantityAlert": 15,
    "buyingPrice": 200,
    "sellingPriceCash": 300,
    "sellingPriceUdhaar": 325
  }'
```

**Success Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Glyphosate",
  "company": "Monsanto",
  "category": "Herbicide",
  "quantity": 30,
  "quantityAlert": 15,
  "buyingPrice": 200,
  "sellingPriceCash": 300,
  "sellingPriceUdhaar": 325,
  "createdAt": "2024-01-20T14:30:00.000Z",
  "updatedAt": "2024-01-20T14:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "message": "Error creating product",
  "error": "Validation error: category must be valid"
}
```

---

### 4. Update Product

**Endpoint:** `PUT /api/products/:id`

**Description:** Update an existing product (partial update allowed)

**URL Parameters:**
- `id` (required): MongoDB ObjectId

**Request Body:** (any of the product fields)
```json
{
  "quantity": 40,
  "sellingPriceCash": 320
}
```

**Example cURL:**
```bash
curl -X PUT http://localhost:5000/api/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 40,
    "sellingPriceCash": 320
  }'
```

**Success Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Carbendazim",
  "company": "Bayer",
  "category": "Fungicide",
  "quantity": 40,
  "quantityAlert": 20,
  "buyingPrice": 250,
  "sellingPriceCash": 320,
  "sellingPriceUdhaar": 375,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T15:45:00.000Z"
}
```

**Error Response (404):**
```json
{
  "message": "Product not found"
}
```

---

### 5. Delete Product

**Endpoint:** `DELETE /api/products/:id`

**Description:** Remove a product from inventory

**URL Parameters:**
- `id` (required): MongoDB ObjectId

**Example cURL:**
```bash
curl -X DELETE http://localhost:5000/api/products/507f1f77bcf86cd799439011
```

**Success Response (200 OK):**
```json
{
  "message": "Product deleted successfully",
  "_id": "507f1f77bcf86cd799439011"
}
```

**Error Response (404):**
```json
{
  "message": "Product not found"
}
```

---

### 6. Get Low Stock Products

**Endpoint:** `GET /api/products/low-stock`

**Description:** Get all products with quantity ≤ quantityAlert threshold

**Query Parameters:**
- `limit` (optional): Maximum results to return

**Example Request:**
```bash
curl http://localhost:5000/api/products/low-stock
curl http://localhost:5000/api/products/low-stock?limit=5
```

**Example Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Imidacloprid",
    "company": "Syngenta",
    "category": "Insecticide",
    "quantity": 12,
    "quantityAlert": 25,
    "buyingPrice": 450,
    "sellingPriceCash": 600,
    "sellingPriceUdhaar": 650,
    "createdAt": "2024-01-10T09:20:00.000Z",
    "updatedAt": "2024-01-10T09:20:00.000Z"
  }
]
```

**No Results Response:**
```json
[]
```

---

### 7. Get Categories List

**Endpoint:** `GET /api/products/categories/list`

**Description:** Get all available product categories

**Example Request:**
```bash
curl http://localhost:5000/api/products/categories/list
```

**Example Response (200 OK):**
```json
[
  "Fungicide",
  "Insecticide",
  "Herbicide",
  "Fertilizer",
  "Growth Regulator",
  "Nutrient"
]
```

---

## Bill Endpoints

Base path: `/api/bills`

### 1. Get All Bills

**Endpoint:** `GET /api/bills`

**Description:** Retrieve all bills with pagination

**Query Parameters:**
- `status` (optional): Filter by status (pending/completed)
- `billType` (optional): Filter by type (kaccha/pakka)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example Request:**
```bash
curl http://localhost:5000/api/bills
curl http://localhost:5000/api/bills?status=pending
```

**Example Response (200 OK):**
```json
[
  {
    "_id": "607f1f77bcf86cd799439101",
    "billNumber": "BL-001",
    "billType": "kaccha",
    "customer": {
      "name": "Rajesh Kumar",
      "mobile": "9876543210",
      "address": "Indore, MP"
    },
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "productName": "Carbendazim",
        "quantity": 5,
        "price": 350,
        "total": 1750
      }
    ],
    "paymentMode": "cash",
    "subtotal": 1750,
    "gst": 0,
    "total": 1750,
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 2. Get Pending Bills

**Endpoint:** `GET /api/bills/pending/list`

**Description:** Get all bills with 'pending' status (Udhaar/Credit bills)

**Example Request:**
```bash
curl http://localhost:5000/api/bills/pending/list
```

**Example Response (200 OK):**
```json
[
  {
    "_id": "607f1f77bcf86cd799439102",
    "billNumber": "BL-002",
    "billType": "pakka",
    "customer": {
      "name": "Mohan Singh",
      "mobile": "8765432109",
      "address": "Ujjain, MP"
    },
    "items": [
      {
        "productId": "507f1f77bcf86cd799439012",
        "productName": "Imidacloprid",
        "quantity": 3,
        "price": 650,
        "total": 1950
      }
    ],
    "paymentMode": "udhaar",
    "subtotal": 1950,
    "gst": 351,
    "total": 2301,
    "status": "pending",
    "createdAt": "2024-01-18T14:20:00.000Z",
    "updatedAt": "2024-01-18T14:20:00.000Z"
  }
]
```

---

### 3. Get Bill by ID

**Endpoint:** `GET /api/bills/:id`

**Description:** Retrieve a specific bill by ID

**URL Parameters:**
- `id` (required): MongoDB ObjectId

**Example Request:**
```bash
curl http://localhost:5000/api/bills/607f1f77bcf86cd799439101
```

**Example Response (200 OK):**
```json
{
  "_id": "607f1f77bcf86cd799439101",
  "billNumber": "BL-001",
  "billType": "kaccha",
  "customer": {
    "name": "Rajesh Kumar",
    "mobile": "9876543210",
    "address": "Indore, MP"
  },
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Carbendazim",
      "quantity": 5,
      "price": 350,
      "total": 1750
    }
  ],
  "paymentMode": "cash",
  "subtotal": 1750,
  "gst": 0,
  "total": 1750,
  "status": "completed",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Create Bill

**Endpoint:** `POST /api/bills`

**Description:** Create a new bill (generates bill number automatically)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "billType": "pakka",
  "customer": {
    "name": "Mohan Singh",
    "mobile": "8765432109",
    "address": "Ujjain, MP"
  },
  "items": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "productName": "Imidacloprid",
      "quantity": 3,
      "price": 650,
      "total": 1950
    }
  ],
  "paymentMode": "udhaar",
  "subtotal": 1950,
  "gst": 351,
  "total": 2301
}
```

**Field Validation:**
- `billType` (string, required): "kaccha" or "pakka"
- `customer` (object, required):
  - `name` (string): Customer name
  - `mobile` (string): Phone number
  - `address` (string): Address
- `items` (array, required):
  - `productId`: Product MongoDB ID
  - `productName`: Product name
  - `quantity`: Units sold
  - `price`: Selling price per unit
  - `total`: quantity × price
- `paymentMode` (string, required): "cash" or "udhaar"
- `subtotal` (number, required): Sum of item totals
- `gst` (number, required): 18% of subtotal for pakka, 0 for kaccha
- `total` (number, required): subtotal + gst

**Inventory Impact:**
- **Udhaar bills (paymentMode: "udhaar"):** Product quantities reduced immediately
- **Cash bills (paymentMode: "cash"):** Quantities reduced when status changed to "completed"

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/bills \
  -H "Content-Type: application/json" \
  -d '{
    "billType": "pakka",
    "customer": {
      "name": "Mohan Singh",
      "mobile": "8765432109",
      "address": "Ujjain, MP"
    },
    "items": [
      {
        "productId": "507f1f77bcf86cd799439012",
        "productName": "Imidacloprid",
        "quantity": 3,
        "price": 650,
        "total": 1950
      }
    ],
    "paymentMode": "udhaar",
    "subtotal": 1950,
    "gst": 351,
    "total": 2301
  }'
```

**Success Response (201 Created):**
```json
{
  "_id": "607f1f77bcf86cd799439102",
  "billNumber": "BL-002",
  "billType": "pakka",
  "customer": {
    "name": "Mohan Singh",
    "mobile": "8765432109",
    "address": "Ujjain, MP"
  },
  "items": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "productName": "Imidacloprid",
      "quantity": 3,
      "price": 650,
      "total": 1950
    }
  ],
  "paymentMode": "udhaar",
  "subtotal": 1950,
  "gst": 351,
  "total": 2301,
  "status": "pending",
  "createdAt": "2024-01-18T14:20:00.000Z",
  "updatedAt": "2024-01-18T14:20:00.000Z"
}
```

---

### 5. Update Bill Status

**Endpoint:** `PATCH /api/bills/:id/status`

**Description:** Update bill status (mainly used for cash bills to mark as completed)

**URL Parameters:**
- `id` (required): MongoDB ObjectId

**Request Body:**
```json
{
  "status": "completed"
}
```

**Status Values:**
- "pending": Awaiting payment (for Udhaar bills)
- "completed": Payment received/cash collected

**Inventory Impact:**
- When status changes from "pending" to "completed" on a cash bill:
  - Product quantities are reduced from inventory

**Example cURL:**
```bash
curl -X PATCH http://localhost:5000/api/bills/607f1f77bcf86cd799439101/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Success Response (200 OK):**
```json
{
  "_id": "607f1f77bcf86cd799439101",
  "billNumber": "BL-001",
  "billType": "kaccha",
  "status": "completed",
  "total": 1750,
  "paymentMode": "cash",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### 6. Delete Bill

**Endpoint:** `DELETE /api/bills/:id`

**Description:** Remove a bill (restores inventory if quantities were deducted)

**URL Parameters:**
- `id` (required): MongoDB ObjectId

**Inventory Impact:**
- If bill had quantities deducted, they are restored to inventory

**Example cURL:**
```bash
curl -X DELETE http://localhost:5000/api/bills/607f1f77bcf86cd799439101
```

**Success Response (200 OK):**
```json
{
  "message": "Bill deleted successfully",
  "_id": "607f1f77bcf86cd799439101"
}
```

---

### 7. Get Bill Statistics

**Endpoint:** `GET /api/bills/stats/dashboard`

**Description:** Get dashboard statistics (today's sales, pending amount, monthly data)

**Example Request:**
```bash
curl http://localhost:5000/api/bills/stats/dashboard
```

**Example Response (200 OK):**
```json
{
  "todaySales": 5250.50,
  "pendingAmount": 2301,
  "monthlySalesData": [
    {
      "month": "July",
      "sales": 15000
    },
    {
      "month": "August",
      "sales": 22500
    },
    {
      "month": "September",
      "sales": 18750
    },
    {
      "month": "October",
      "sales": 31200
    },
    {
      "month": "November",
      "sales": 25600
    },
    {
      "month": "December",
      "sales": 28900
    }
  ]
}
```

**Fields Explained:**
- `todaySales`: Total sales amount from today (sum of all bills created today)
- `pendingAmount`: Total amount pending from all bills with status "pending"
- `monthlySalesData`: Array of last 6 months sales data
  - `month`: Month name
  - `sales`: Total sales for that month

---

## Data Models

### Product Model

```json
{
  "_id": "ObjectId",
  "name": "String",
  "company": "String",
  "category": "String (enum)",
  "quantity": "Number (≥ 0)",
  "quantityAlert": "Number",
  "buyingPrice": "Number",
  "sellingPriceCash": "Number",
  "sellingPriceUdhaar": "Number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Bill Model

```json
{
  "_id": "ObjectId",
  "billNumber": "String (unique, auto-generated)",
  "billType": "String (kaccha|pakka)",
  "customer": {
    "name": "String",
    "mobile": "String",
    "address": "String"
  },
  "items": [
    {
      "productId": "ObjectId",
      "productName": "String",
      "quantity": "Number",
      "price": "Number",
      "total": "Number"
    }
  ],
  "paymentMode": "String (cash|udhaar)",
  "subtotal": "Number",
  "gst": "Number (0 for kaccha, 18% for pakka)",
  "total": "Number",
  "status": "String (pending|completed)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Customer Model

```json
{
  "_id": "ObjectId",
  "name": "String",
  "mobile": "String",
  "address": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## API Usage Examples

### Frontend JavaScript (Using API Service)

```javascript
// Import API service
import { productAPI, billAPI } from '@/services/api';

// Get all products
const products = await productAPI.getAll();

// Get specific product
const product = await productAPI.getById('507f1f77bcf86cd799439011');

// Create product
const newProduct = await productAPI.create({
  name: 'New Product',
  company: 'Company Name',
  category: 'Fungicide',
  quantity: 50,
  quantityAlert: 20,
  buyingPrice: 300,
  sellingPriceCash: 400,
  sellingPriceUdhaar: 450
});

// Update product
const updated = await productAPI.update('507f1f77bcf86cd799439011', {
  quantity: 45
});

// Delete product
await productAPI.delete('507f1f77bcf86cd799439011');

// Get categories
const categories = await productAPI.getCategories();

// Get low stock products
const lowStock = await productAPI.getLowStock();

// Get all bills
const bills = await billAPI.getAll();

// Get pending bills
const pending = await billAPI.getPending();

// Create bill
const newBill = await billAPI.create({
  billType: 'pakka',
  customer: { name: 'John', mobile: '9876543210', address: 'City' },
  items: [{ productId: '...', productName: '...', quantity: 5, price: 300, total: 1500 }],
  paymentMode: 'udhaar',
  subtotal: 1500,
  gst: 270,
  total: 1770
});

// Update bill status
await billAPI.updateStatus('607f1f77bcf86cd799439101', 'completed');

// Get bill stats
const stats = await billAPI.getStats();
```

### Command Line / cURL

```bash
# Get all products
curl http://localhost:5000/api/products

# Get specific product
curl http://localhost:5000/api/products/507f1f77bcf86cd799439011

# Create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"...","company":"...","category":"Fungicide"...}'

# Update product
curl -X PUT http://localhost:5000/api/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 45}'

# Delete product
curl -X DELETE http://localhost:5000/api/products/507f1f77bcf86cd799439011

# Get categories
curl http://localhost:5000/api/products/categories/list

# Get low stock
curl http://localhost:5000/api/products/low-stock

# Get all bills
curl http://localhost:5000/api/bills

# Get pending bills
curl http://localhost:5000/api/bills/pending/list

# Get bill by ID
curl http://localhost:5000/api/bills/607f1f77bcf86cd799439101

# Create bill
curl -X POST http://localhost:5000/api/bills \
  -H "Content-Type: application/json" \
  -d '{...bill data...}'

# Update bill status
curl -X PATCH http://localhost:5000/api/bills/607f1f77bcf86cd799439101/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete bill
curl -X DELETE http://localhost:5000/api/bills/607f1f77bcf86cd799439101

# Get stats
curl http://localhost:5000/api/bills/stats/dashboard
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Future versions may include:
- Per-IP rate limiting
- Per-user rate limiting (when authentication is added)
- Endpoint-specific limits

---

## Future Enhancements

- [ ] JWT authentication
- [ ] Role-based access control (Admin, Manager, Staff)
- [ ] Pagination with metadata
- [ ] Advanced filtering and search
- [ ] File export (CSV, PDF)
- [ ] Real-time notifications (WebSockets)
- [ ] API versioning (/api/v1/products)
- [ ] Request/Response logging
- [ ] Rate limiting and throttling
- [ ] Webhooks for external integrations

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**API Status:** Ready for Development
