import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Define the payload expected from the access token
type AtPayload = { id: number; role: 'CUSTOMER' | 'ADMIN' };

@Injectable()
//This strategy uses the default name 'jwt', which JwtAuthGuard looks for.
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
  constructor(config: ConfigService) {
    super({
      // looking for the token in the standard 'Authorization: Bearer <token>' header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      secretOrKey: config.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  // The validate method is called after the token is verified and decoded
    async validate(payload: AtPayload) {
    // temporarily log the incoming payload to see if the token was decoded
        console.log('Token Payload:', payload); 
        return payload; 
    }
}