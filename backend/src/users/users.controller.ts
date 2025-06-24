import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  // UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  // ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserRole } from '@prisma/client';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Users')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Get()
  @ApiOperation({ summary: 'Get all users with optional filters' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
  ) {
    return this.usersService.findAllUsers(page, limit, search, role);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get all customers' })
  findAllCustomers() {
    return this.usersService.findAllCustomers();
  }

  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  findAllAdmins() {
    return this.usersService.findAllAdmins();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find user by email' })
  findByEmail(@Param('email') email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Put('password/change/:id')
  @ApiOperation({ summary: 'Change user password' })
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    // Assuming ChangePasswordDto has oldPassword and newPassword fields, and you need to pass all four arguments
    // Replace 'arg3' and 'arg4' with the actual required arguments as per your service method
    return this.usersService.changeUserPassword(
      id,
      dto.currentPassword,
      dto.newPassword,
      dto,
    );
  }

  @Post('password/reset')
  @ApiOperation({ summary: 'Reset user password' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.usersService.resetPassword(dto);
  }

  @Patch('deactivate/:id')
  @ApiOperation({ summary: 'Deactivate user' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Patch('profile-image/:id')
  @ApiOperation({ summary: 'Update profile image' })
  updateProfileImage(
    @Param('id') userId: string,
    @Body()
    imageData: {
      profileImageId: string | null;
      profileImageUrl: string | null;
    },
  ) {
    return this.usersService.updateProfileImage(userId, imageData);
  }
}
