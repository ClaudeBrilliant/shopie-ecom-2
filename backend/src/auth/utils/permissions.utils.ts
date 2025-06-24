import { UserRole } from '@prisma/client';
import { Permission } from '../enums/permissions.enum';

export class PermissionsUtils {
  // Check if a user can perform a permission based on role and optional ownership
  static canPerformAction(
    userRole: UserRole,
    userId: string,
    action: Permission,
    resourceOwnerId?: string,
  ): boolean {
    // Admins can do everything they are allowed
    if (userRole === UserRole.ADMIN) return true;

    // Contextual ownership-based permissions
    const ownershipRequired: Permission[] = [
      Permission.VIEW_PROFILE,
      Permission.UPDATE_PROFILE,
      Permission.CHANGE_PASSWORD,
      Permission.VIEW_CART,
      Permission.UPDATE_CART,
      Permission.ADD_TO_CART,
      Permission.REMOVE_FROM_CART,
    ];

    if (ownershipRequired.includes(action)) {
      return userId === resourceOwnerId;
    }

    // All other permissions are granted based on role strictly
    return false;
  }

  // Permission matrix for a given role (overview)
  static generatePermissionMatrix(userRole: UserRole) {
    const isAdmin = userRole === UserRole.ADMIN;
    const isCustomer = userRole === UserRole.CUSTOMER;

    return {
      users: {
        create: isAdmin,
        read: isAdmin,
        update: isAdmin,
        delete: isAdmin,
        manage: isAdmin,
      },
      products: {
        read: true,
      },
      orders: {
        create: isCustomer,
        read: isAdmin || isCustomer,
        update: isAdmin,
        delete: isAdmin,
        manage: isAdmin,
      },
      cart: {
        addItem: isCustomer,
        removeItem: isCustomer,
        view: isCustomer,
        update: isCustomer,
      },
      account: {
        view: true,
        update: true,
        changePassword: true,
      },
      system: {
        adminAccess: isAdmin,
        viewDashboard: isAdmin,
        manageSettings: isAdmin,
      },
    };
  }
}
