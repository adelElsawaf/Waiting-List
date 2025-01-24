import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { IsNull } from "typeorm";

export class UserRegisterRequest {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty()
    email: string

    @ValidateIf(o => o.googleId === undefined) // Only validate password if googleId is not provided
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(32, { message: 'Password must not exceed 32 characters' })
    @IsNotEmpty()
    password?: string

    @IsString()
    @MaxLength(50, { message: 'First name must not exceed 50 characters' })
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    googleId?:string

}