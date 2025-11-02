import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
// can apply the guard to the entire controller if most routes are protected
@UseGuards(JwtAuthGuard)
export class UsersController {


}