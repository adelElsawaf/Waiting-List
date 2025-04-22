import GetWaitingPageResponseDTO from "src/waiting-page/response/GetWaitingPageResponseDTO";
import { WaitingPageEntity } from "src/waiting-page/waiting-page.entity";

export class User {

    id: number;

    email: string;

    password?: string

    firstName: string;

    lastName: string;

    googleId?: string

    credits:number

    waitingPages?: GetWaitingPageResponseDTO[]
}