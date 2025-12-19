# 🏥 Pharmacy POS System - Complete Technical Documentation

**Last Updated:** November 17, 2025  
**Project:** Pharmacy Point-of-Sale Management System  
**Tech Stack:** Vue 3 + Express.js + MongoDB

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [User Journey & Flow](#user-journey--flow)
4. [Authentication & Authorization](#authentication--authorization)
5. [Database Models](#database-models)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Frontend Components](#frontend-components)
8. [Stock Management](#stock-management)
9. [Complete Example Flows](#complete-example-flows)
10. [Running the System](#running-the-system)
11. [Key Concepts](#key-concepts)

---

## Project Overview

The **Pharmacy POS System** is a comprehensive web-based point-of-sale application designed for pharmacy operations. It manages:

- ✅ **Inventory Management** — Track medicines, stock levels, suppliers
- ✅ **Sales Processing** — Ring up items, calculate totals, process payments
- ✅ **User Management** — Create staff accounts, assign permissions, manage roles
- ✅ **Reporting** — Drug movement, inventory summaries, sales analytics
- ✅ **Expense Tracking** — Log operational costs
- ✅ **Customer Management** — Handle returns, refunds, credit sales

### Purpose

The system serves as a complete backend for a pharmacy business, handling daily transactions, inventory updates, and reporting for management decision-making.

---

## Architecture

### Three-Tier Architecture Model

```
┌─────────────────────────────────────────────────────┐
│              FRONTEND LAYER                         │
│  (Vue 3 + Vite + Tailwind CSS)                      │
│  - User Interface & User Interactions               │
│  - Client-side routing (Vue Router)                 │
│  - State management                                 │
│  - Form handling & validation                       │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/REST API
                     │ JSON Request/Response
                     ↓
┌─────────────────────────────────────────────────────┐
│              BACKEND LAYER                          │
│  (Express.js + Node.js)                             │
│  - REST API Routes                                  │
│  - Request validation                               │
│  - Business logic                                   │
│  - Authentication & Authorization middleware       │
│  - Error handling                                   │
└────────────────────┬────────────────────────────────┘
                     │ MongoDB Queries
                     │ CRUD Operations
                     ↓
┌─────────────────────────────────────────────────────┐
│              DATA LAYER                             │
│  (MongoDB + Mongoose ODM)                           │
│  - User Collection                                  │
│  - Item Collection                                  │
│  - Sale Collection                                  │
│  - Supplier Collection                              │
│  - Persistent Storage                               │
└─────────────────────────────────────────────────────┘
```

### Data Flow Pattern

```
User Input (Frontend)
    ↓
Vue Component emits event
    ↓
JavaScript fetch() POST/GET/PUT/DELETE
    ↓
Backend Route Handler (Express)
    ↓
Middleware (auth check)
    ↓
Database Query (Mongoose)
    ↓
MongoDB Operation
    ↓
Response JSON
    ↓
Frontend receives & updates UI
```

---

## User Journey & Flow

### Scenario: Pharmacy Staff Member Processing a Sale

#### **Phase 1: Authentication (0:00 - 0:20)**

```
┌─────────────────────────────────────────────────────────────┐
│ USER OPENS BROWSER → http://localhost:5173                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: Loads App.vue → Router checks authentication      │
│ - No token in localStorage                                  │
│ - Redirects to /login                                       │
│ - Shows Login.vue component                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ USER ENTERS CREDENTIALS:                                    │
│ Email: admin@local                                          │
│ Password: Admin123!                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: Submits Form                                      │
│ POST http://localhost:3000/api/auth/login                   │
│ Body: { email: "admin@local", password: "Admin123!" }       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ BACKEND: Processes Login Request (auth.js)                  │
│ 1. Extract email & password from request body               │
│ 2. Query MongoDB: User.findOne({ email: "admin@local" })    │
│ 3. Use bcryptjs to compare password hashes                  │
│    - Input: "Admin123!"                                     │
│    - Stored: "$2a$10$N9qo8uLOVoj9L...JnpP0K"                │
│    - Result: Match! ✓                                       │
│ 4. Generate JWT token (valid 8 hours):                      │
│    - Header: { alg: "HS256", typ: "JWT" }                   │
│    - Payload: { id: "user_id", role: "admin" }              │
│    - Signature: HMAC-SHA256(header + payload, secret)       │
│ 5. Build response:                                          │
│    {                                                        │
│      token: "eyJhbGc...",                                   │
│      user: {                                                │
│        id: "507f1f77bcf86cd799439011",                      │
│        name: "Administrator",                               │
│        email: "admin@local",                                │
│        role: "admin",                                       │
│        capabilities: ["manage_users", "manage_items", ...]  │
│      }                                                      │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: Receives Response (200 OK)                        │
│ 1. Extract token and user from response                     │
│ 2. Store in localStorage:                                   │
│    - localStorage.setItem('token', token)                   │
│    - localStorage.setItem('user', JSON.stringify(user))     │
│ 3. Show success message: "Login successful! 🎉"             │
│ 4. Redirect to /dashboard after 1 second                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ USER NOW ON DASHBOARD                                       │
│ ✓ Authenticated ✓ Token stored ✓ Ready to use system        │
└─────────────────────────────────────────────────────────────┘
```

**Password Verification Deep Dive:**

```
What user entered: "Admin123!"
                        ↓
bcryptjs.compare("Admin123!", "$2a$10$N9qo8uLOVoj9L...JnpP0K")
                        ↓
Hash the input with same algorithm
                        ↓
Compare with stored hash byte-by-byte
                        ↓
Result: true ✓ (passwords match)
```

---

#### **Phase 2: Route Protection (Dashboard Access)**

When user navigates to `/dashboard`:

```javascript
// Vue Router Guard (router/index.js)
router.beforeEach(async (to, from) => {
  // Step 1: Check if route allows unauthenticated access
  if (to.meta.requiresAuth === false) {
    return true; // Allow (e.g., /login, /no-access)
  }

  // Step 2: Check if token exists in localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    return { name: 'Login' }; // Redirect to login
  }

  // Step 3: Verify token with backend
  try {
    const response = await fetch(
      'http://localhost:3000/api/auth/me',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.ok) {
      // Token is valid
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      return true; // Grant access
    } else {
      // Token invalid or expired
      throw new Error('Token verification failed');
    }
  } catch (error) {
    // Network error or invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { name: 'Login' }; // Redirect to login
  }
});
```

**Backend `/api/auth/me` Route:**

```javascript
router.get('/me', authMiddleware, wrap(async (req, res) => {
  // authMiddleware has already verified token and attached req.user
  return res.json({ 
    user: req.user // No password included
  });
}));
```

---

#### **Phase 3: Using Dashboard (0:30 - Beyond)**

```
Dashboard Loaded
    ↓
├─ Navbar Component
│  └─ Shows: User name, Logout button, Theme toggle
│
├─ Sidebar Component
│  └─ Navigation Menu:
│     ├─ Dashboard
│     ├─ Admin (Create User, Assign Capability, Change Password)
│     ├─ Items (Details, Sales, Stock Update, Sales Bill)
│     ├─ Sales (Return/Refund, Creditors)
│     ├─ Reports (Drug Movement, Inventory Summary)
│     ├─ Suppliers
│     └─ Expenses
│
└─ Main Content Area
   └─ Dashboard.vue component
```

---

### Example: Processing a Sale

**User Clicks "Create Sale" → Opens SalesBill.vue**

```
┌──────────────────────────────────┐
│ SalesBill.vue Component Loads     │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ Fetch Available Items             │
│ GET /api/items?page=1&limit=20    │
│ Headers: { Authorization:         │
│   "Bearer <token>" }              │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ Backend: authMiddleware           │
│ 1. Extract token from header      │
│ 2. jwt.verify(token, SECRET)      │
│ 3. Find user by ID                │
│ 4. Attach to req.user             │
│ 5. Call next() → proceed to route  │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ Backend: items.js Route           │
│ 1. Parse query: page=1, limit=20  │
│ 2. Build MongoDB filter           │
│ 3. Item.find(filter)              │
│    .sort({ name: 1 })             │
│    .skip(0)                       │
│    .limit(20)                     │
│ 4. Get total count                │
│ 5. Return: {                      │
│    data: [                        │
│      {                            │
│        _id: "123",                │
│        name: "Paracetamol 500mg", │
│        sku: "PARA-500-100",       │
│        price: 50,                 │
│        stock: 100,                │
│        ...                        │
│      },                           │
│      ...                          │
│    ],                             │
│    meta: {                        │
│      total: 245,                  │
│      page: 1,                     │
│      limit: 20                    │
│    }                              │
│  }                                │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ Frontend: Receives Data           │
│ 1. Parse response JSON            │
│ 2. items.value = data.data        │
│ 3. Render table with all items    │
│ 4. Show pagination controls       │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ User Interacts:                   │
│ 1. Searches for "paracetamol"     │
│ 2. Frontend: GET /api/items       │
│    ?q=paracetamol&page=1&limit=20 │
│ 3. Backend searches using regex   │
│ 4. Returns filtered results       │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ User Selects Items & Quantities:  │
│ - Paracetamol 500mg: qty 2        │
│ - Aspirin 100mg: qty 1            │
│                                   │
│ Frontend State (local):           │
│ cart = [                          │
│   {itemId: "123", qty: 2},        │
│   {itemId: "456", qty: 1}         │
│ ]                                 │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ User Clicks "Complete Sale"       │
│ Frontend: POST /api/sales         │
│ Body: {                           │
│   items: [                        │
│     {itemId: "123", qty: 2},      │
│     {itemId: "456", qty: 1}       │
│   ],                              │
│   customer: "John Doe",           │
│   paymentMethod: "cash"           │
│ }                                 │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ Backend: sales.js Route           │
│                                   │
│ For each item in request:         │
│                                   │
│ ITEM 1: Paracetamol (qty: 2)      │
│ ├─ Item.findById("123")           │
│ │  └─ Get price: 50               │
│ ├─ Atomic update:                 │
│ │  Item.findOneAndUpdate({        │
│ │    _id: "123",                  │
│ │    stock: {$gte: 2}             │
│ │  }, {$inc: {stock: -2}})        │
│ │  └─ stock: 100 → 98 ✓           │
│ └─ Add to saleItems               │
│                                   │
│ ITEM 2: Aspirin (qty: 1)          │
│ ├─ Item.findById("456")           │
│ │  └─ Get price: 20               │
│ ├─ Atomic update:                 │
│ │  Item.findOneAndUpdate({        │
│ │    _id: "456",                  │
│ │    stock: {$gte: 1}             │
│ │  }, {$inc: {stock: -1}})        │
│ │  └─ stock: 50 → 49 ✓            │
│ └─ Add to saleItems               │
│                                   │
│ Calculate total:                  │
│ (50 × 2) + (20 × 1) = 120         │
│                                   │
│ Create Sale document:             │
│ Sale({                            │
│   items: saleItems,               │
│   total: 120,                     │
│   customer: "John Doe",           │
│   paymentMethod: "cash",          │
│   createdBy: req.user._id,        │
│   createdAt: now                  │
│ })                                │
│                                   │
│ Save to MongoDB                   │
│ Return Sale with ID               │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ Frontend: Success Response        │
│ 1. Show: "Sale #12345 created"    │
│ 2. Display receipt details:       │
│    - Items purchased              │
│    - Quantities                   │
│    - Total: Rs. 120               │
│    - Payment: Cash                │
│    - Date/Time                    │
│ 3. Option to print receipt        │
│ 4. Option to start new sale       │
│ 5. Clear cart                     │
└──────────────────────────────────┘
            ↓
┌──────────────────────────────────┐
│ DATABASE STATE UPDATED:           │
│                                   │
│ Items Collection:                 │
│ - Paracetamol: stock 100 → 98     │
│ - Aspirin: stock 50 → 49          │
│                                   │
│ Sales Collection:                 │
│ + New document created with       │
│   items, total, customer, etc.    │
│                                   │
│ Timestamps:                       │
│ - Paracetamol updated at 2:05 PM  │
│ - Aspirin updated at 2:05 PM      │
│ - Sale created at 2:05 PM         │
└──────────────────────────────────┘
```

---

## Authentication & Authorization

### JWT Token Structure

A JWT token consists of 3 parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjEyMzQ1Njc4OTAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTMyNTAwMDB9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Part 1: Header (Base64 Encoded JSON)**
```json
{
  "alg": "HS256",     // Algorithm: HMAC SHA-256
  "typ": "JWT"        // Type: JSON Web Token
}
```

**Part 2: Payload (Base64 Encoded JSON)**
```json
{
  "id": "507f1f77bcf86cd799439011",  // User MongoDB ID
  "role": "admin",                   // User role
  "iat": 1693250000,                 // Issued at (Unix timestamp)
  "exp": 1693286000                  // Expires at (8 hours later)
}
```

**Part 3: Signature**
```
HMACSHA256(
  base64(header) + "." + base64(payload),
  "your-secret-key-here"
)
```

### Token Verification Process

**On Backend (authMiddleware):**

```javascript
// Incoming request:
// Authorization: Bearer eyJhbGc...

// Step 1: Extract token
const token = req.headers.authorization.split(' ')[1];
// token = "eyJhbGc..."

// Step 2: Verify signature & decode
const payload = jwt.verify(token, config.JWT_SECRET);
// If token tampered: throws error
// If expired: throws error
// If valid: returns { id, role, iat, exp }

// Step 3: Fetch user from database
const user = await User.findById(payload.id).select('-password');
// Get full user object (excluding password)

// Step 4: Attach to request
req.user = user;

// Step 5: Proceed to route handler
next();
```

### Role-Based Access Control (RBAC)

**User Model:**
```javascript
{
  _id: ObjectId(...),
  name: "Administrator",
  email: "admin@local",
  role: "admin",  // ← Determines access level
  capabilities: [
    "manage_users",
    "manage_items", 
    "process_sales",
    "view_reports"
  ]  // ← Granular permissions
}
```

**Example: Admin-Only Route Protection**

```javascript
// Only admins can assign capabilities
router.post(
  '/assign',
  authMiddleware,           // Check token is valid
  requireRole('admin'),     // Check role === 'admin'
  async (req, res) => {
    // If reaches here, user is authenticated AND admin
    // Safe to perform admin action
  }
);

// How it works:
// GET /api/capabilities/assign from user with role='user'
// 1. authMiddleware: ✓ Valid token
// 2. requireRole('admin'): ✗ role !== 'admin'
//    → Returns 403 Forbidden
//    → Route handler never called
```

### Security Best Practices Implemented

| Practice | Implementation |
|----------|-----------------|
| **Password Hashing** | bcryptjs with 10 salt rounds |
| **JWT Secret** | Stored in .env, not in code |
| **Token Expiry** | 8 hours validity period |
| **CORS** | Enabled for frontend origin |
| **Helmet** | Security headers added |
| **Password Not Returned** | `.select('-password')` in queries |

---

## Database Models

### User Collection

**Schema:**
```javascript
{
  name: String,                      // Required
  email: String,                     // Required, Unique
  password: String,                  // Required, bcrypt hashed
  role: String,                      // 'admin' or 'user', default: 'user'
  capabilities: [String],            // Array of permission strings
  createdAt: Date,                   // Auto-set
  updatedAt: Date                    // Auto-set
}
```

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Administrator",
  "email": "admin@local",
  "password": "$2a$10$N9qo8uLOVoj9Lhqg...",
  "role": "admin",
  "capabilities": [
    "manage_users",
    "manage_items",
    "manage_sales",
    "manage_suppliers",
    "view_reports"
  ],
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-20T14:30:00.000Z"
}
```

### Item Collection

**Schema:**
```javascript
{
  name: String,                      // Required, e.g., "Paracetamol 500mg"
  sku: String,                       // Indexed for fast lookup
  description: String,               // Details about the medicine
  category: String,                  // e.g., "Analgesics", "Antibiotics"
  supplier: ObjectId,                // Reference to Supplier
  price: Number,                     // Selling price, required
  cost: Number,                      // Purchase cost, default: 0
  stock: Number,                     // Current quantity, default: 0
  metadata: Mixed,                   // Any additional data
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Paracetamol 500mg",
  "sku": "PARA-500-100",
  "description": "Pain reliever and fever reducer, bottle of 100 tablets",
  "category": "Analgesics",
  "supplier": "507f1f77bcf86cd799439001",
  "price": 50,
  "cost": 30,
  "stock": 98,
  "metadata": {
    "manufacturer": "Pharma Co Ltd",
    "batch": "2025-001",
    "expiryDate": "2026-12-31"
  },
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-20T14:05:00.000Z"
}
```

**Stock Tracking:**
- Initial stock: 100 units
- Sale 1: -2 units (staff member purchased 2)
- Sale 2: -3 units
- Current stock: 95 units
- Updated at: 2025-01-20T14:05:00.000Z

### Sale Collection

**Schema:**
```javascript
{
  items: [{                          // Array of items sold
    item: ObjectId,                  // Reference to Item
    name: String,                    // Item name (snapshot)
    qty: Number,                     // Quantity sold
    price: Number                    // Price per unit (snapshot)
  }],
  total: Number,                     // Total sale amount
  customer: String,                  // Customer name
  paymentMethod: String,             // 'cash', 'card', 'check'
  createdBy: ObjectId,               // Reference to User (staff)
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "items": [
    {
      "item": "507f1f77bcf86cd799439012",
      "name": "Paracetamol 500mg",
      "qty": 2,
      "price": 50
    },
    {
      "item": "507f1f77bcf86cd799439014",
      "name": "Aspirin 100mg",
      "qty": 1,
      "price": 20
    }
  ],
  "total": 120,
  "customer": "John Doe",
  "paymentMethod": "cash",
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2025-01-20T14:05:00.000Z",
  "updatedAt": "2025-01-20T14:05:00.000Z"
}
```

**Calculation:**
- Paracetamol: 2 × 50 = 100
- Aspirin: 1 × 20 = 20
- **Total: 120**

### Supplier Collection (Implied)

**Likely Schema:**
```javascript
{
  name: String,                      // Supplier name
  contact: String,                   // Phone/email
  address: String,                   // Supplier address
  items: [ObjectId],                 // Items supplied
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints Reference

### Authentication Endpoints

#### POST /api/auth/login
**Purpose:** User login  
**Auth Required:** ❌ No  
**Request:**
```json
{
  "email": "admin@local",
  "password": "Admin123!"
}
```
**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Administrator",
    "email": "admin@local",
    "role": "admin",
    "capabilities": ["manage_users", "manage_items", ...]
  }
}
```
**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

#### POST /api/auth/register
**Purpose:** Register new user (testing)  
**Auth Required:** ❌ No  
**Request:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Success Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439015",
  "name": "John Smith",
  "email": "john@example.com"
}
```

#### GET /api/auth/me
**Purpose:** Get current user info  
**Auth Required:** ✅ Yes (Bearer Token)  
**Headers:**
```
Authorization: Bearer eyJhbGc...
```
**Success Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Administrator",
    "email": "admin@local",
    "role": "admin",
    "capabilities": [...]
  }
}
```

### Item Endpoints

#### GET /api/items
**Purpose:** List items with pagination & search  
**Auth Required:** ✅ Yes  
**Query Parameters:**
- `page` (default: 1) — Page number
- `limit` (default: 20) — Items per page
- `q` (optional) — Search query (searches name, sku, category)

**Example Request:**
```
GET /api/items?page=1&limit=20&q=paracetamol
```

**Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Paracetamol 500mg",
      "sku": "PARA-500-100",
      "price": 50,
      "stock": 98,
      ...
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20
  }
}
```

#### GET /api/items/:id
**Purpose:** Get single item details  
**Auth Required:** ✅ Yes  
**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Paracetamol 500mg",
  "sku": "PARA-500-100",
  "description": "...",
  "category": "Analgesics",
  "price": 50,
  "cost": 30,
  "stock": 98,
  "metadata": {...}
}
```

#### POST /api/items
**Purpose:** Create new item  
**Auth Required:** ✅ Yes  
**Request:**
```json
{
  "name": "Aspirin 100mg",
  "sku": "ASP-100-100",
  "description": "Pain reliever",
  "category": "Analgesics",
  "price": 20,
  "cost": 12,
  "stock": 50
}
```
**Response (201):** Created item object with _id

#### PUT /api/items/:id
**Purpose:** Update item  
**Auth Required:** ✅ Yes  
**Request:**
```json
{
  "stock": 95,
  "price": 22
}
```
**Response (200):** Updated item object

#### DELETE /api/items/:id
**Purpose:** Delete item  
**Auth Required:** ✅ Yes  
**Response (200):**
```json
{
  "message": "Deleted"
}
```

### Sales Endpoints

#### POST /api/sales
**Purpose:** Create a sale  
**Auth Required:** ✅ Yes  
**Request:**
```json
{
  "items": [
    {
      "itemId": "507f1f77bcf86cd799439012",
      "qty": 2
    },
    {
      "itemId": "507f1f77bcf86cd799439014",
      "qty": 1
    }
  ],
  "customer": "John Doe",
  "paymentMethod": "cash"
}
```
**Response (201):** Created sale document with total
**Error (400):** "Insufficient stock for item X"

#### GET /api/sales
**Purpose:** List sales with date filtering  
**Auth Required:** ✅ Yes  
**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `from` (optional) — Start date (ISO format)
- `to` (optional) — End date (ISO format)

**Example Request:**
```
GET /api/sales?page=1&from=2025-01-20&to=2025-01-21
```

#### GET /api/sales/:id
**Purpose:** Get single sale details  
**Auth Required:** ✅ Yes  
**Response (200):** Sale document with all items and total

### Capabilities Endpoints

#### GET /api/capabilities/users
**Purpose:** List all users  
**Auth Required:** ✅ Yes  
**Response (200):** Array of users

#### GET /api/capabilities/assignments
**Purpose:** List users with their capabilities  
**Auth Required:** ✅ Yes  
**Response (200):** Array of users with capabilities

#### POST /api/capabilities/assign
**Purpose:** Assign capability to user  
**Auth Required:** ✅ Yes (Admin only)  
**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439015",
  "capability": "manage_items"
}
```
**Response (200):** Updated user object

---

## Frontend Components

### Component Tree

```
App.vue (Root)
├── Navbar.vue
│   └─ Shows user profile, logout, theme toggle
├── Sidebar.vue
│   └─ Navigation menu with all routes
└── router-view (Dynamic Content)
    ├── Login.vue (path: /)
    ├── Dashboard.vue (path: /dashboard)
    ├── Admin/
    │   ├── CreateUserAccount.vue (path: /admin/create-user)
    │   ├── AssignCapability.vue (path: /admin/assign-capability)
    │   └── ChangePassword.vue (path: /admin/change-password)
    ├── Item/
    │   ├── ItemDetails.vue (path: /item/details)
    │   ├── ItemSales.vue (path: /item/sales)
    │   ├── StockUpdate.vue (path: /item/stock-update)
    │   └── SalesBill.vue (path: /item/sales-bill)
    ├── Sales/
    │   ├── Creditors.vue (path: /sales/creditors)
    │   └── CustomerReturnRefund.vue (path: /sales/return-refund)
    ├── Reports/
    │   ├── DrugMovement.vue (path: /reports/drug-movement)
    │   └── InventorySummary.vue (path: /reports/inventory-summary)
    ├── Supplier/
    │   ├── SupplierDetails.vue (path: /supplier/details)
    │   └── SupplierInvoice.vue (path: /supplier/invoice)
    ├── Expenses/
    │   └── ViewExpenses.vue (path: /expenses/view)
    └── NoAccess.vue (path: /no-access)
```

### Typical Component Structure

```vue
<template>
  <!-- User Interface -->
  <div class="container">
    <h1>Item Details</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="item.name" placeholder="Item Name" />
      <input v-model="item.price" type="number" placeholder="Price" />
      <button type="submit">Save</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Reactive state
const item = ref({});
const error = ref('');
const success = ref('');

// Fetch data when component mounts
onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      'http://localhost:3000/api/items/123',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch');
    item.value = await response.json();
  } catch (err) {
    error.value = err.message;
  }
});

// Handle form submission
async function handleSubmit() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      'http://localhost:3000/api/items/123',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(item.value)
      }
    );
    
    if (!response.ok) throw new Error('Failed to update');
    success.value = 'Item updated successfully!';
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    error.value = err.message;
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.error {
  background-color: #fee;
  color: #c00;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.success {
  background-color: #efe;
  color: #0a0;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
```

### Key Vue 3 Concepts Used

| Concept | Usage |
|---------|-------|
| **`<script setup>`** | Simplified composition API syntax |
| **`ref()`** | Create reactive variables |
| **`computed()`** | Derived reactive values |
| **`onMounted()`** | Hook to run code after component loads |
| **`v-model`** | Two-way binding for form inputs |
| **`v-if/v-else`** | Conditional rendering |
| **`@event`** | Event handler binding |
| **`router-view`** | Placeholder for routed components |

---

## Stock Management

### Why Stock Management Matters

Pharmacies must ensure:
- ✅ Accurate inventory counts
- ✅ No overselling (selling more than available)
- ✅ Real-time stock updates
- ✅ Prevents lost sales or angry customers

### Atomic Stock Decrement Pattern

When creating a sale, stock updates must be **atomic** (all-or-nothing):

```
❌ WRONG Approach (Race Condition):
1. Check if stock >= qty requested
2. If yes, decrement stock
   Problem: Between step 1 and 2, another sale 
   could have already decremented stock!

✅ CORRECT Approach (Atomic):
Item.findOneAndUpdate(
  {
    _id: itemId,
    stock: { $gte: qty }  // Condition in one atomic operation
  },
  {
    $inc: { stock: -qty }  // Decrement in same operation
  }
);
// Either BOTH happen or NEITHER happens
```

### Complete Sale Flow with Stock Management

```javascript
POST /api/sales
Request: {
  items: [
    { itemId: "item-123", qty: 2 },
    { itemId: "item-456", qty: 1 }
  ],
  customer: "John Doe",
  paymentMethod: "cash"
}

Backend Processing:
─────────────────────────────────────────

1. Validate request
   ✓ items array not empty
   ✓ each item has itemId and qty

2. For each item in request:

   ITEM 1: itemId = "item-123", qty = 2
   ├─ Fetch item: Item.findById("item-123")
   │  └─ Current stock: 100
   │
   ├─ Try atomic decrement:
   │  Item.findOneAndUpdate({
   │    _id: "item-123",
   │    stock: { $gte: 2 }
   │  }, {
   │    $inc: { stock: -2 }
   │  })
   │  └─ Succeeds! New stock: 98
   │     Add to saleItems with price snapshot
   │
   └─ Get item price for total: 50

   ITEM 2: itemId = "item-456", qty = 1
   ├─ Fetch item: Item.findById("item-456")
   │  └─ Current stock: 5
   │
   ├─ Try atomic decrement:
   │  Item.findOneAndUpdate({
   │    _id: "item-456",
   │    stock: { $gte: 1 }
   │  }, {
   │    $inc: { stock: -1 }
   │  })
   │  └─ Succeeds! New stock: 4
   │     Add to saleItems with price snapshot
   │
   └─ Get item price for total: 20

3. Calculate total: (50 × 2) + (20 × 1) = 120

4. Create Sale document:
   Sale({
     items: [
       { item: "item-123", name: "Med A", qty: 2, price: 50 },
       { item: "item-456", name: "Med B", qty: 1, price: 20 }
     ],
     total: 120,
     customer: "John Doe",
     paymentMethod: "cash",
     createdBy: userId,
     createdAt: now
   })

5. Save to MongoDB

6. Return Sale document to frontend

Response (200):
{
  _id: "sale-789",
  items: [...],
  total: 120,
  customer: "John Doe",
  ...
}
─────────────────────────────────────────

Database State After Sale:
- item-123: stock 100 → 98
- item-456: stock 5 → 4
- New sale document created in Sales collection
```

### Handling Insufficient Stock

```javascript
// Scenario: User tries to sell 3 units of item with only 2 in stock

POST /api/sales {
  items: [{ itemId: "item-999", qty: 3 }]
}

Backend:
───────
Item.findById("item-999")
  └─ Current stock: 2

Try atomic update:
Item.findOneAndUpdate({
  _id: "item-999",
  stock: { $gte: 3 }  // Looking for stock >= 3
}, {...})
  └─ NO MATCH! (stock is 2, not >= 3)
  └─ Returns null (update failed)

Detect failure and rollback:
  └─ Any previously decremented items get stock restored
  └─ No sale is created

Response (400):
{
  message: "Insufficient stock for item Medicine Name"
}
```

---

## Complete Example Flows

### Full Day Scenario: Morning to Evening

```
7:00 AM - Opening Shift
──────────────────────
1. Staff arrives, opens system at http://localhost:5173
2. Logs in with credentials
3. Dashboard loads, showing:
   - Today's sales so far: 0
   - Low stock alerts
   - Pending refunds

7:30 AM - First Customer
────────────────────────
1. Customer: "I need Paracetamol"
2. Staff clicks "Create Sale" → SalesBill.vue
3. Searches for "Paracetamol"
4. System returns matching items
5. Selects "Paracetamol 500mg" (price Rs. 50, stock: 150)
6. Enters qty: 2
7. Customer pays cash
8. Clicks "Complete Sale"
9. Backend:
   - Atomically decrements Paracetamol stock: 150 → 148
   - Creates Sale document
   - Calculates total: 100
10. Frontend shows receipt
11. Receipt printed
12. Sale #001 recorded

Current State:
- Paracetamol stock: 148
- Total sales: Rs. 100

9:30 AM - Stock Update
─────────────────────
Staff notices Aspirin running low
1. Clicks "Stock Update"
2. Searches for "Aspirin"
3. Current stock: 8 units
4. New shipment arrived: 50 units
5. Updates stock to: 58
6. Backend updates Item
7. Aspirin now has 58 units

12:00 PM - Lunchtime Report
──────────────────────────
1. Manager asks: "How many sales today?"
2. Staff clicks "Reports" → "Drug Movement"
3. Frontend fetches: GET /api/sales?from=2025-01-22&to=2025-01-22
4. Backend queries sales from today
5. Shows:
   - Sale #001: Paracetamol × 2 @ Rs. 50 = 100
   - Sale #002: Aspirin × 1 @ Rs. 20 = 20
   - Sale #003: Ibuprofen × 3 @ Rs. 30 = 90
   - ...
   - Total Today: Rs. 2,450
   - Total Items Sold: 45 units

3:00 PM - Customer Returns Item
──────────────────────────────
1. Customer: "This Aspirin is expired"
2. Staff clicks "Return/Refund"
3. Enters sale #002 details
4. Processes refund
5. Backend:
   - Increments Aspirin stock
   - Records return transaction
   - Updates Sale with refund status

6:00 PM - End of Day Report
───────────────────────────
1. Staff clicks "Reports" → "Inventory Summary"
2. Shows all items with current stock levels
3. Highlights low-stock items (< 20 units)
4. Manager reviews:
   - Total items in inventory: 8,450 units
   - Total value: Rs. 425,000
   - Low stock items: 12
   - To order: Paracetamol (reorder to 200), Aspirin (reorder to 100)

8:00 PM - Closing Shift
──────────────────────
1. Final inventory count matches system
2. All sales logged
3. Staff clicks "Logout"
4. Token removed from localStorage
5. Session ends
6. System ready for next day
```

### Admin Tasks: User & Capability Management

```
Monday Morning - New Staff Member Hired
──────────────────────────────────────
1. Admin logs in to system
2. Clicks Admin → "Create User Account"
3. Form:
   - Name: "Ahmed Khan"
   - Email: "ahmed@pharmacy.com"
   - Password: "SecurePass@123"
   - Role: "user"
4. Submits: POST /api/auth/register
5. Backend:
   - Validates email not in use
   - Hashes password with bcryptjs
   - Creates User document
   - Returns created user
6. System: "User created successfully"

Ahmed Khan now can:
  ✓ Log in with email/password
  ✗ Create other users (no capability)
  ✗ Assign capabilities (no capability)
  ✓ Process sales (default for all users)

Wednesday - Promote Ahmed to Senior Staff
─────────────────────────────────────────
1. Admin clicks Admin → "Assign Capability"
2. Selects user: "Ahmed Khan"
3. Selects capability: "manage_items"
4. Clicks "Assign"
5. Backend:
   - Finds Ahmed's user document
   - Adds "manage_items" to capabilities array
   - Saves
6. Ahmed now can:
   ✓ Create/edit items
   ✓ Update stock
   ✗ Assign other capabilities

Friday - Ahmed Forgets Password
───────────────────────────────
1. Ahmed logs in with wrong password
2. System: "Invalid credentials"
3. Ahmed contacts admin
4. Admin logs in
5. Admin clicks Admin → "Change Password"
6. Selects user: "Ahmed Khan"
7. Sets new password: "NewPassword@456"
8. Clicks "Update"
9. Backend:
   - Hashes new password
   - Updates User.password
   - Saves
10. Ahmed now logs in with new password
11. Works fine!
```

---

## Running the System

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas URI)
- npm or yarn

### Step 1: Environment Setup

**Backend (.env):**
```bash
# backend/.env
MONGO_URI=mongodb://localhost:27017/pharmacy_pos_dev
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
```

**Frontend (.env):**
```bash
# frontend/.env
VITE_API_BASE=http://localhost:3000/api
```

### Step 2: Start Backend

```powershell
# Terminal 1
cd backend
npm install
npm run dev

# Output:
# Server running on port 3000
# Seeded admin user: admin@local / Admin123!
```

### Step 3: Start Frontend

```powershell
# Terminal 2
cd frontend
npm install
npm run dev

# Output:
# VITE v5.0.0 running at:
# ➜  Local:   http://localhost:5173/
```

### Step 4: Access System

1. Open browser: http://localhost:5173
2. See Login page
3. Enter credentials:
   - Email: `admin@local`
   - Password: `Admin123!`
4. Click "Login"
5. See Dashboard
6. Use sidebar to navigate

### Verify Everything Works

**Test Sale:**
1. Dashboard → Items (Sidebar)
2. Search for any item
3. Go to "Create Sale" → "Sales Bill"
4. Add item to cart
5. Complete sale
6. Verify stock decreased
7. Check Reports → Sales

**Test User Creation:**
1. Dashboard → Admin → "Create User"
2. Create new staff account
3. Log out
4. Log in with new account
5. Verify access

---

## Key Concepts

### 1. JWT Authentication
- **What:** JSON Web Token, stateless authentication
- **Why:** Secure, scalable, no server session needed
- **How:** Token issued on login, validated on each request

### 2. Atomic Operations
- **What:** Database operations that either fully complete or fully fail
- **Why:** Prevents data inconsistency in concurrent operations
- **How:** MongoDB `$inc` with conditions in one operation

### 3. Role-Based Access Control (RBAC)
- **What:** Different users have different permissions
- **Why:** Security, prevents unauthorized actions
- **How:** Check user.role before allowing sensitive operations

### 4. RESTful API
- **What:** API using HTTP methods (GET, POST, PUT, DELETE)
- **Why:** Standard, scalable, easy to consume
- **How:** Each resource has endpoints for CRUD operations

### 5. Middleware
- **What:** Functions that run before/after request handlers
- **Why:** Code reuse, separation of concerns
- **How:** authMiddleware checks token on every protected route

### 6. Pagination
- **What:** Splitting large result sets into pages
- **Why:** Improves performance, better UX
- **How:** skip() and limit() in MongoDB queries

### 7. Password Hashing
- **What:** One-way encryption of passwords
- **Why:** Even if DB is breached, passwords are safe
- **How:** bcryptjs with 10 salt rounds

### 8. CORS (Cross-Origin Resource Sharing)
- **What:** Allow frontend to communicate with backend
- **Why:** Different ports (5173 vs 3000)
- **How:** Backend includes CORS headers

---

## Troubleshooting

### "Invalid credentials" on Login
**Possible Causes:**
1. Wrong email/password — Check seeded credentials: `admin@local` / `Admin123!`
2. Backend not running — Start with `npm run dev` in backend folder
3. Database not connected — Ensure MongoDB is running
4. Email case sensitivity — Try lowercase email

**Solution:**
```powershell
# Restart backend to reseed admin user
cd backend
npm run dev
```

### "Cannot fetch from API" / CORS Error
**Cause:** Frontend pointing to wrong API base

**Solution:**
```bash
# frontend/.env
VITE_API_BASE=http://localhost:3000/api
```

### Stock doesn't decrement after sale
**Cause:** Sale creation failed silently

**Solution:**
1. Check browser Network tab for failed request
2. Check backend console for error
3. Verify stock is sufficient

### Token expired / "Redirect to login"
**Cause:** JWT token is valid for 8 hours only

**Solution:**
```
Log in again to get a fresh token
```

---

## Production Deployment

### Security Checklist
- [ ] Change JWT_SECRET in .env to strong random string
- [ ] Set MONGO_URI to production MongoDB Atlas
- [ ] Enable HTTPS/SSL
- [ ] Use environment variables (not hardcoded)
- [ ] Set NODE_ENV=production
- [ ] Configure CORS to specific domain
- [ ] Enable rate limiting
- [ ] Set up logging/monitoring
- [ ] Regular database backups

### Environment Variables for Production
```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/pharmacy_prod
PORT=3000
JWT_SECRET=very-long-random-secret-string-min-32-chars
VITE_API_BASE=https://api.yourpharmacy.com/api
```

---

## Performance Optimization Tips

1. **Add Database Indexes:**
   ```javascript
   // For frequently searched fields
   User.collection.createIndex({ email: 1 });
   Item.collection.createIndex({ sku: 1 });
   Sale.collection.createIndex({ createdAt: -1 });
   ```

2. **Pagination:**
   - Always use pagination in list endpoints
   - Default limit: 20-50 items per page

3. **Lazy Loading:**
   - Load data on-demand in frontend components
   - Don't fetch all items on page load

4. **Caching:**
   - Cache frequently accessed items
   - Clear cache when items updated

5. **Database Optimization:**
   - Add `.lean()` to queries that don't need full Mongoose objects
   - Use `.select()` to fetch only needed fields

---

## File Structure Summary

```
pharmacy-pos-system/
│
├── backend/
│   ├── src/
│   │   ├── index.js          (Entry point)
│   │   ├── app.js            (Express app)
│   │   ├── config.js         (Env config)
│   │   ├── middleware/       (Auth, error handling)
│   │   ├── models/           (MongoDB schemas)
│   │   ├── routes/           (API endpoints)
│   │   ├── utils/            (Helpers, seeding)
│   │   └── tests/            (Integration tests)
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── main.js           (Vue app mount)
│   │   ├── App.vue           (Root component)
│   │   ├── Login.vue
│   │   ├── components/       (Reusable UI)
│   │   ├── router/           (Vue Router)
│   │   └── views/            (Page components)
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── index.html
│
├── .gitignore
├── .gitattributes
├── README.md
├── COMPLETE_SYSTEM_GUIDE.md  (This file)
└── strcture.txt
```

---

## Additional Resources

- **Vue 3 Docs:** https://vuejs.org/
- **Express.js Docs:** https://expressjs.com/
- **MongoDB Docs:** https://docs.mongodb.com/
- **JWT Guide:** https://jwt.io/
- **REST API Best Practices:** https://restfulapi.net/

---

**End of Documentation**

For questions or updates, contact the development team.
