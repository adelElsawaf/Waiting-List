import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateWaitingPageDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    subTitle: string;

    backgroundImg?: Express.Multer.File;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    isFree:boolean
}
