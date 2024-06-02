import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An internal server error occurred',
      );
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An internal server error occurred',
      );
    }
  }

  async create(user: User): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email: user.email }, { username: user.username }],
      });

      if (existingUser) {
        throw new ConflictException(
          'User with the given email or username already exists!',
        );
      }

      user.password = await bcrypt.hash(user.password, 10);
      return this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An internal server error occurred',
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Could not fetch users');
    }
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.findOne(id);
      if (!existingUser) {
        throw new NotFoundException('User not found!');
      }
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      await this.userRepository.update(id, user);
      return this.findOne(id); // Return the updated user
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An internal server error occurred',
      );
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An internal server error occurred',
      );
    }
  }
}
