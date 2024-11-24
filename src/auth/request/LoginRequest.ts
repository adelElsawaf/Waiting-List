import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginRequest {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}