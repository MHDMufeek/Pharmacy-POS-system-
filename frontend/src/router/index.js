import { createRouter, createWebHistory } from "vue-router";

// Auth & Dashboard
import Login from "../Login.vue";
import Dashboard from "../views/Dashboard.vue";
import ClearAndLogin from "../views/ClearAndLogin.vue";
import ViewExpenses from '../views/Expenses/ViewExpenses.vue' // Adjust path as needed


;

const routes = [
  // 🟢 Login - first page
  {
    path: "/",
    name: "Login",
    component: Login,
  },

  // 🔄 Clear session & redirect to login
  {
    path: "/refresh-session",
    name: "ClearAndLogin",
    component: ClearAndLogin,
  },

  // 🟢 Dashboard - after login
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },

  // 🟣 Admin Routes
  {
    path: "/admin/change-password",
    name: "ChangePassword",
    component: () => import("../views/Admin/ChangePassword.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/create-user",
    name: "CreateUserAccount",
    component: () => import("../views/Admin/CreateUserAccount.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/assign-capability",
    name: "AssignCapability",
    component: () => import("../views/Admin/AssignCapability.vue"),
    meta: { requiresAuth: true },
  },

  // 🟠 Item Routes
  {
    path: "/item/sales",
    name: "ItemSales",
    component: () => import("../views/Item/ItemSales.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/item/details",
    name: "ItemDetails",
    component: () => import("../views/Item/ItemDetails.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/item/stock-update",
    name: "StockUpdate",
    component: () => import("../views/Item/StockUpdate.vue"),
    meta: { requiresAuth: true },
  },

  // 🟡 Supplier Routes
  {
    path: "/supplier/details",
    name: "SupplierDetails",
    component: () => import("../views/Supplier/SupplierDetails.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/supplier/invoice",
    name: "SupplierInvoice",
    component: () => import("../views/Supplier/SupplierInvoice.vue"),
    meta: { requiresAuth: true },
  },

  // 🔵 Sales Routes
  {
    path: "/sales/return-refund",
    name: "CustomerReturnRefund",
    component: () => import("../views/Sales/CustomerReturnRefund.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/sales/creditors",
    name: "Creditors",
    component: () => import("../views/Sales/Creditors.vue"),
    meta: { requiresAuth: true },
  },

  // 🧾 Reports Routes
  {
    path: "/reports/drug-movement",
    name: "DrugMovement",
    component: () => import("../views/Reports/DrugMovement.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/reports/inventory-summary",
    name: "InventorySummary",
    component: () => import("../views/Reports/InventorySummary.vue"),
    meta: { requiresAuth: true },
  },

  // 🚫 No Access Page
  {
    path: "/no-access",
    name: "NoAccess",
    component: () => import("../views/NoAccess.vue"),
    // public page — no auth required
    meta: { requiresAuth: false },
  },

  // 🧭 Catch-All → redirect to Dashboard
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
  //
    {
      path: '/expenses/view',
      name: 'ViewExpenses',
      component: ViewExpenses,
      meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard to protect routes
// Enforce authentication for all pages except Login and NoAccess.
// Before each navigation, verify the token with the backend `/auth/me` endpoint.
// This is stronger than only checking localStorage presence.
router.beforeEach(async (to, from) => {
  // allow access to Login and NoAccess pages always
  if (to.name === 'Login' || to.name === 'NoAccess') return true;

  // require a token to proceed
  const token = localStorage.getItem('token');
  if (!token) {
    return { name: 'NoAccess' };
  }

  // verify token with backend
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
    const resp = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data && data.user) {
        // keep a fresh copy of the user
        localStorage.setItem('user', JSON.stringify(data.user));

        // Capability map: route name -> required capability (null = admin-only)
        const capabilityMap = {
          ChangePassword: null,
          CreateUserAccount: null,
          AssignCapability: null,
          ItemSales: 'item-sales',
          ItemDetails: 'item-details',
          StockUpdate: 'stock-update',
          SupplierDetails: 'supplier-details',
          SupplierInvoice: 'supply-invoice',
          CustomerReturnRefund: 'customer-return-refund',
          Creditors: 'creditors',
          DrugMovement: 'drug-movement',
          InventorySummary: 'inventory-summary',
          ViewExpenses: 'view-expenses'
        };

        // If route requires capability, enforce it
        const required = capabilityMap[to.name];
        if (required !== undefined) {
          const user = data.user;
          const role = (user.role || '').toString().toLowerCase();
          const caps = user.capabilities || [];

          // admin role bypasses capability checks
          if (role.includes('admin')) return true;

          // admin-only pages
          if (required === null) {
            return { name: 'NoAccess' };
          }

          if (!caps.includes(required)) return { name: 'NoAccess' };
        }

        return true;
      }
    }

    // invalid token — clear and redirect to Login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { name: 'Login' };
  } catch (err) {
    // network or server error — treat as unauthenticated
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { name: 'Login' };
  }
});

export default router;
