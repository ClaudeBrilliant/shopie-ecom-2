import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Permission } from '../enums/permissions.enum';
import { ROLE_PERMISSIONS } from 'src/config/permission.config';
import { PermissionContext } from '../interfaces/permissions.interface';

@Injectable()
export class PermissionsService {
  getPermissionsForRole(role: UserRole): Permission[] {
    const roleConfig = ROLE_PERMISSIONS.find((config) => config.role === role);
    return roleConfig?.permissions || [];
  }

  hasPermission(userRole: UserRole, permission: Permission): boolean {
    const userPermissions = this.getPermissionsForRole(userRole);
    return userPermissions.includes(permission);
  }

  hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.some((permission) =>
      this.hasPermission(userRole, permission),
    );
  }

  hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.every((permission) =>
      this.hasPermission(userRole, permission),
    );
  }

  /**
   * Evaluates contextual permissions for certain actions
   */
  hasContextualPermission(
    context: PermissionContext,
    permission: Permission,
  ): boolean {
    const { user, resource } = context;

    if (!this.hasPermission(user.role, permission)) return false;

    // Admins can always do everything they have permission for
    if (user.role === UserRole.ADMIN) return true;

    // Context-based logic for profile updates, etc.
    switch (permission) {
      case Permission.VIEW_PROFILE:
      case Permission.UPDATE_PROFILE:
      case Permission.CHANGE_PASSWORD:
        return resource?.ownerId === user.id;

      case Permission.VIEW_CART:
      case Permission.UPDATE_CART:
      case Permission.ADD_TO_CART:
      case Permission.REMOVE_FROM_CART:
        return resource?.ownerId === user.id;

      default:
        return true;
    }
  }

  /**
   * Gets effective permissions taking into account resource ownership
   */
  getEffectivePermissions(
    userRole: UserRole,
    userId: string,
    resourceOwnerId?: string,
  ): Permission[] {
    const basePermissions = this.getPermissionsForRole(userRole);

    if (userRole === UserRole.ADMIN) {
      return basePermissions;
    }

    return basePermissions.filter((permission) => {
      const context: PermissionContext = {
        user: { id: userId, role: userRole },
        resource: resourceOwnerId
          ? { id: resourceOwnerId, ownerId: resourceOwnerId, type: 'user' }
          : undefined,
      };
      return this.hasContextualPermission(context, permission);
    });
  }

  createPermission(action: string, resource: string): string {
    return `${action}:${resource}`;
  }

  parsePermission(permission: Permission): {
    action: string;
    resource: string;
  } {
    const [action, resource] = permission.split(':');
    return { action, resource };
  }
}
