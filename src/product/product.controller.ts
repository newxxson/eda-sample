import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create_product.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('')
  @HttpCode(201)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get('/:productId')
  @HttpCode(200)
  async getProductById(productId: string) {
    return await this.productService.findById(productId);
  }

  @Get('')
  @HttpCode(200)
  async getAllProducts() {
    return await this.productService.findAll();
  }
}
