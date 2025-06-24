/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { getPrismaClient } from 'src/config/prisma.config';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/create-user.dto';
import { User } from './interfaces/user.interface';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private prisma = getPrismaClient();
  private readonly saltRounds = parseInt(
    process.env.BCRYPT_SALT_ROUNDS ?? '12',
  );
  login: any;

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user with email: ${data.email}`);

    try {
      // Check for existing user - only check by email since it's unique
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email.toLowerCase().trim() },
      });

      if (existingUser) {
        this.logger.warn(
          `User creation failed: Email ${data.email} already exists`,
        );
        throw new ConflictException(
          `User with email ${data.email} already exists`,
        );
      }

      // Validate password strength
      this.validatePassword(data.password);

      const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

      const user = await this.prisma.user.create({
        data: {
          name: data.name?.trim(),
          email: data.email.toLowerCase().trim(),
          password: hashedPassword,
          // role: data.role || UserRole.CUSTOMER,
          isActive: data.isActive ?? true,
          phone: data.phone?.trim(),
        },
      });

      this.logger.log(`User created successfully: ${user.id}`);
      return this.toResponseDto(user);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to create user: ${error.message}`,
      );
    }
  }

  async findAllUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: UserRole,
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const where: any = { isActive: true };

      // Add search filter
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Add role filter
      if (role) where.role = role;

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        users: users.map((user) => this.toResponseDto(user)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Failed to retrieve users', error.stack);
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findAllCustomers(): Promise<UserResponseDto[]> {
    try {
      const customers = await this.prisma.user.findMany({
        where: {
          role: UserRole.CUSTOMER,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return customers.map((user) => this.toResponseDto(user));
    } catch (error) {
      this.logger.error('Failed to retrieve customers', error.stack);
      throw new InternalServerErrorException('Failed to retrieve customers');
    }
  }

  async findAllAdmins(): Promise<UserResponseDto[]> {
    try {
      const admins = await this.prisma.user.findMany({
        where: {
          role: UserRole.ADMIN,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return admins.map((user) => this.toResponseDto(user));
    } catch (error) {
      this.logger.error('Failed to retrieve admins', error.stack);
      throw new InternalServerErrorException('Failed to retrieve admins');
    }
  }

  async findOneUser(id: string): Promise<UserResponseDto> {
    try {
      // Validate UUID format
      if (!this.isValidUUID(id)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
          isActive: true,
        },
        include: {
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5, // Last 5 orders
          },
        },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return this.toResponseDto(user);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to retrieve user ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async findUserByEmail(email: string): Promise<UserResponseDto> {
    try {
      // Validate email format
      if (!this.isValidEmail(email)) {
        throw new BadRequestException('Invalid email format');
      }

      const user = await this.prisma.user.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          isActive: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return this.toResponseDto(user);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to retrieve user by email ${email}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    try {
      // Validate UUID format
      if (!this.isValidUUID(id)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const existingUser = await this.prisma.user.findFirst({
        where: {
          id: id,
          isActive: true,
        },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // Check email conflict
      if (
        data.email &&
        data.email.toLowerCase().trim() !== existingUser.email
      ) {
        if (!this.isValidEmail(data.email)) {
          throw new BadRequestException('Invalid email format');
        }

        const emailConflict = await this.prisma.user.findUnique({
          where: { email: data.email.toLowerCase().trim() },
        });

        if (emailConflict) {
          throw new ConflictException('Another user with this email exists');
        }
      }

      const updateData: any = {};

      if (data.name?.trim()) updateData.name = data.name.trim();
      if (data.email) updateData.email = data.email.toLowerCase().trim();
      if (data.phone?.trim()) updateData.phone = data.phone.trim();
      if (data.role && Object.values(UserRole).includes(data.role)) {
        updateData.role = data.role;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      this.logger.log(`User updated successfully: ${id}`);
      return this.toResponseDto(updatedUser);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to update user ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async updateUserLastLogin(id: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { lastLogin: new Date() },
      });
    } catch (error) {
      this.logger.error(
        `Failed to update last login for user ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update last login');
    }
  }

  async getUserWithPassword(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          isActive: true,
        },
        include: {
          orders: true,
          cartItems: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to retrieve user with password ${email}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async changeUserPassword(
    id: string,
    currentPassword: string,
    newPassword: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
          isActive: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Validate new password
      this.validatePassword(changePasswordDto.newPassword);

      const hashedNewPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        this.saltRounds,
      );

      await this.prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword },
      });

      this.logger.log(`Password changed successfully for user: ${id}`);
      return { message: 'Password changed successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to change password for user ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: resetPasswordDto.email.toLowerCase().trim(),
          isActive: true,
        },
      });

      if (!user) {
        // Don't reveal if user exists or not for security
        return {
          message: 'If the email exists, a password reset link has been sent',
        };
      }

      // Validate new password
      this.validatePassword(resetPasswordDto.newPassword);

      const hashedNewPassword = await bcrypt.hash(
        resetPasswordDto.newPassword,
        this.saltRounds,
      );

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword },
      });

      this.logger.log(`Password reset successfully for user: ${user.email}`);
      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to reset password`, error.stack);
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  async deactivateUser(id: string): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
          isActive: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });

      this.logger.log(`User deactivated: ${id}`);
      return { message: `User ${user.name} has been deactivated successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to deactivate user ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to deactivate user');
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          orders: true,
          cartItems: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Check if user has orders - might want to keep for record keeping
      if (user.orders && user.orders.length > 0) {
        throw new BadRequestException(
          'Cannot delete user with existing orders. Consider deactivating instead.',
        );
      }

      // Delete user's cart items first
      if (user.cartItems && user.cartItems.length > 0) {
        const cartItemIds = user.cartItems.map((item) => item.id);
        await this.prisma.cartItem.deleteMany({
          where: { id: { in: cartItemIds } },
        });

        await this.prisma.cartItem.delete({
          where: { id: user.cartItems[0].id },
        });
      }

      await this.prisma.user.delete({
        where: { id },
      });

      this.logger.log(`User deleted: ${id}`);
      return { message: `User ${user.name} has been permanently deleted` };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to delete user ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async updateProfileImage(
    userId: string,
    imageData: {
      profileImageId: string | null;
      profileImageUrl: string | null;
    },
  ): Promise<UserResponseDto> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          profileImageId: imageData.profileImageId,
          profileImageUrl: imageData.profileImageUrl,
        },
      });

      return this.toResponseDto(updatedUser);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      this.logger.error(
        `Failed to update profile image for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update profile image');
    }
  }

  // Helper methods
  private validatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      );
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  private toResponseDto(user: any): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      phone: user.phone,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profileImageUrl: user.profileImageUrl,
    });
  }
}
