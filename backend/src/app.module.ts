import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './config/prisma.config';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { ProductService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { OrderService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AdminModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    UsersController,
    AdminController,
    CartController,
  ],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    ProductService,
    OrderService,
  ],
})
export class AppModule {}
