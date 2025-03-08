import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWaitingPageDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    subTitle: string;

    backgroundImg?: Express.Multer.File;;

}
