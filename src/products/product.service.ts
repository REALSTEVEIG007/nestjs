import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException('Product not found!');
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const allProducts = await this.productRepository.find();
      return allProducts;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Product): Promise<Product> {
    try {
      const newProduct = await this.productRepository.save(body);
      return newProduct;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, body: Partial<Product>) {
    try {
      const product = await this.findOne(id);
      if (!product) {
        throw new NotFoundException('Product not found!');
      }

      await this.productRepository.update(id, body);

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const product = await this.findOne(id);
      if (!product) {
        throw new NotFoundException('Product not found!');
      }
      await this.productRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
