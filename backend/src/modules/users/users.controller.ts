import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
// can apply the guard to the entire controller if most routes are protected
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('profile')
    @UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard to this route
    async getProfile(@Req() req) {
        // The JwtAuthGuard populates req.user with the payload from the Access Token.
        // req.user = { id: 1, role: 'CUSTOMER', ... }
        const userId = req.user.id; 
        
        return this.usersService.findOne(userId);
        console.log('User Payload in Profile:', req.user); 
        console.log('User ID:', req.user.id); 
    }


}