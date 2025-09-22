import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  // Admin Routes
  {
    path: '/admin/change-password',
    name: 'ChangePassword',
    component: () => import('../views/admin/ChangePassword.vue')
  },
  {
    path: '/admin/create-user',
    name: 'CreateUserAccount',
    component: () => import('../views/admin/CreateUserAccount.vue')
  },
  {
    path: '/admin/assist',
    name: 'AssistCapability',
    component: () => import('../views/admin/AssistCapability.vue')
  },
  // Item Routes
  {
    path: '/item/sales',
    name: 'ItemSales',
    component: () => import('../views/item/ItemSales.vue')
  },
  {
    path: '/item/details',
    name: 'ItemDetails',
    component: () => import('../views/item/ItemDetails.vue')
  },
  {
    path: '/item/stock-update',
    name: 'StockUpdate',
    component: () => import('../views/item/StockUpdate.vue')
  },
  // Supplier Routes
  {
    path: '/supplier/details',
    name: 'SupplierDetails',
    component: () => import('../views/supplier/SupplierDetails.vue')
  },
  {
    path: '/supplier/invoice',
    name: 'SupplierInvoice',
    component: () => import('../views/supplier/SupplierInvoice.vue')
  },
  // Sales Routes
  {
    path: '/sales/return-refund',
    name: 'CustomerReturnRefund',
    component: () => import('../views/sales/CustomerReturnRefund.vue')
  },
  {
    path: '/sales/creditors',
    name: 'Creditors',
    component: () => import('../views/sales/Creditors.vue')
  },
  // Reports Routes
  {
    path: '/reports/drug-movement',
    name: 'DrugMovement',
    component: () => import('../views/reports/DrugMovement.vue')
  },
  {
    path: '/reports/inventory-summary',
    name: 'InventorySummary',
    component: () => import('../views/reports/InventorySummary.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router