import { createRouter, createWebHistory } from "vue-router";
import Login from "../Login.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  // Login - first page
  {
    path: "/",
    name: "Login",
    component: Login,
  },

  // Dashboard - after login
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },

  // Admin Routes
  {
    path: "/admin/change-password",
    name: "ChangePassword",
    component: () => import("../views/Admin/ChangePassword.vue"),
  },
  {
    path: "/admin/create-user",
    name: "CreateUserAccount",
    component: () => import("../views/Admin/CreateUserAccount.vue"),
  },
  {
    path: "/admin/assign-capability",
    name: "AssistCapability",
    component: () => import("../views/Admin/AssignCapability.vue"),
  },

  // Item Routes
  {
    path: "/item/sales",
    name: "ItemSales",
    component: () => import("../views/Item/ItemSales.vue"),
  },
  {
    path: "/item/details",
    name: "ItemDetails",
    component: () => import("../views/Item/ItemDetails.vue"),
  },
  {
    path: "/item/stock-update",
    name: "StockUpdate",
    component: () => import("../views/Item/StockUpdate.vue"),
  },

  // Supplier Routes
  {
    path: "/supplier/details",
    name: "SupplierDetails",
    component: () => import("../views/Supplier/SupplierDetails.vue"),
  },
  {
    path: "/supplier/invoice",
    name: "SupplierInvoice",
    component: () => import("../views/Supplier/SupplierInvoice.vue"),
  },

  // Sales Routes
  {
    path: "/sales/return-refund",
    name: "CustomerReturnRefund",
    component: () => import("../views/Sales/CustomerReturnRefund.vue"),
  },
  {
    path: "/sales/creditors",
    name: "Creditors",
    component: () => import("../views/Sales/Creditors.vue"),
  },

  // Reports Routes
  {
    path: "/reports/drug-movement",
    name: "DrugMovement",
    component: () => import("../views/Reports/DrugMovement.vue"),
  },
  {
    path: "/reports/inventory-summary",
    name: "InventorySummary",
    component: () => import("../views/Reports/InventorySummary.vue"),
  },

  // No Access Page
  {
    path: "/no-access",
    name: "NoAccess",
    component: () => import("../views/NoAccess.vue"),
  },

  // Catch-All → redirect to Dashboard
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
