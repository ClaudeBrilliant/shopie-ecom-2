import { UserRole } from '@prisma/client';
import { Permission } from 'src/auth/enums/permissions.enum';
import { PermissionRule } from 'src/auth/interfaces/permissions.interface';

export const ROLE_PERMISSIONS: PermissionRule[] = [
  {
    role: UserRole.ADMIN,
    permissions: [
      // User Management
      Permission.CREATE_USER,
      Permission.READ_USER,
      Permission.UPDATE_USER,
      Permission.DELETE_USER,
      Permission.MANAGE_USERS,

      // Product Management
      Permission.CREATE_PRODUCT,
      Permission.READ_PRODUCT,
      Permission.UPDATE_PRODUCT,
      Permission.DELETE_PRODUCT,
      Permission.MANAGE_PRODUCTS,

      // Order Management
      Permission.CREATE_ORDER,
      Permission.READ_ORDER,
      Permission.UPDATE_ORDER,
      Permission.DELETE_ORDER,
      Permission.MANAGE_ORDERS,

      // Cart Management
      Permission.ADD_TO_CART,
      Permission.REMOVE_FROM_CART,
      Permission.VIEW_CART,
      Permission.UPDATE_CART,

      // Profile / Account
      Permission.VIEW_PROFILE,
      Permission.UPDATE_PROFILE,
      Permission.CHANGE_PASSWORD,

      // System / Admin
      Permission.ADMIN_ACCESS,
      Permission.VIEW_DASHBOARD,
      Permission.MANAGE_SETTINGS,
    ],
  },
  {
    role: UserRole.CUSTOMER,
    permissions: [
      // Product
      Permission.READ_PRODUCT,

      // Orders (their own)
      Permission.CREATE_ORDER,
      Permission.READ_ORDER,

      // Cart
      Permission.ADD_TO_CART,
      Permission.REMOVE_FROM_CART,
      Permission.VIEW_CART,
      Permission.UPDATE_CART,

      // Profile / Account
      Permission.VIEW_PROFILE,
      Permission.UPDATE_PROFILE,
      Permission.CHANGE_PASSWORD,

      // Dashboard (restricted)
      Permission.VIEW_DASHBOARD,
    ],
  },
];
