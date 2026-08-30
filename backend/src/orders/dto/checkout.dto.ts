import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'product-uuid-1' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CheckoutDto {
  @ApiProperty({ example: 'alex.buyer@nomini.group' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: 'Alex Morgan' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '742 Evergreen Terrace, Springfield, OR 97477' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiPropertyOptional({ example: 'STRIPE', default: 'STRIPE' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
