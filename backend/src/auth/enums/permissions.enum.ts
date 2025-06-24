export enum Permission {
  // User Management
  CREATE_USER = 'user:create',
  READ_USER = 'user:read',
  UPDATE_USER = 'user:update',
  DELETE_USER = 'user:delete',
  MANAGE_USERS = 'user:manage',

  // Product Management
  CREATE_PRODUCT = 'product:create',
  READ_PRODUCT = 'product:read',
  UPDATE_PRODUCT = 'product:update',
  DELETE_PRODUCT = 'product:delete',
  MANAGE_PRODUCTS = 'product:manage',

  // Order Management
  CREATE_ORDER = 'order:create',
  READ_ORDER = 'order:read',
  UPDATE_ORDER = 'order:update',
  DELETE_ORDER = 'order:delete',
  MANAGE_ORDERS = 'order:manage',

  // Cart Management
  ADD_TO_CART = 'cart:add_item',
  REMOVE_FROM_CART = 'cart:remove_item',
  VIEW_CART = 'cart:view',
  UPDATE_CART = 'cart:update',

  // Profile / Account
  VIEW_PROFILE = 'account:view',
  UPDATE_PROFILE = 'account:update',
  CHANGE_PASSWORD = 'account:change_password',

  // System / Admin
  ADMIN_ACCESS = 'system:admin_access',
  VIEW_DASHBOARD = 'system:view_dashboard',
  MANAGE_SETTINGS = 'system:manage_settings',
}
