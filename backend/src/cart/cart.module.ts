import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
