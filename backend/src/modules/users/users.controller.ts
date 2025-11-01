import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // 💡 Import the Guard

@Controller('users')
// can apply the guard to the entire controller if most routes are protected
// @UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    // GET /users/profile (Requires an Access Token in the header)
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: any) {
        // The JwtAuthGuard populates req.user with the payload from the Access Token.
        // req.user = { id: 1, role: 'CUSTOMER', ... }
        const userId = req.user.id; 
        
        return this.usersService.findOne(userId);
    }
}