import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  @UseGuards(JwtAuthGuard)
  async getAllProducts(): Promise<{ products: Product[]; total: number }> {
    try {
      const products = await this.productService.findAll();
      console.log('products', products);
      const result = {
        products,
        total: products.length,
      };
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('product/:id')
  async getProduct(@Param('id') id: number): Promise<Product> {
    try {
      return this.productService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('product')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() body: Product): Promise<Product> {
    try {
      return this.productService.create(body);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Patch('product/:id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Body() body: Partial<Product>,
    @Param('id') id: number,
  ): Promise<Product> {
    try {
      return this.productService.update(id, body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete('product/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: number): Promise<void> {
    try {
      return this.productService.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
