import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemInput {
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number; // Price locked at time of order
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  @ArrayMinSize(1, { message: 'Order must have at least one item' })
  items: OrderItemInput[];

  @IsNumber()
  totalAmount: number;
}
