import { IsNumber, Min, IsString } from 'class-validator';

export class UpdateCartItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
