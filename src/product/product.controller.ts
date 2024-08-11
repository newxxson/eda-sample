import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create_product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('')
  @HttpCode(201)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }
}
