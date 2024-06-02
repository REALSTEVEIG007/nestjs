import {
  Injectable,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An internal server error occurred',
      );
    }
  }
}
