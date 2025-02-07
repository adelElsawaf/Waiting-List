import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { UserRegisterRequest } from "../request/UserRegisterRequest";
import { use } from "passport";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['profile', 'email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, emails, name} = profile;

        // Constructing a new UserRegisterRequest object
        const user: UserRegisterRequest = {
            email: emails[0]?.value,
            firstName: name?.givenName || '',
            lastName: name?.familyName || '',
            googleId: id,
        };
        console.log(user)
        done(null, user);
    }
}
