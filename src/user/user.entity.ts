import { WaitingPageEntity } from 'src/waiting-page/waiting-page.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: true, nullable: true })
    password?: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    googleId: string;

    @OneToMany(() => WaitingPageEntity, (waitingPage) => waitingPage.owner, { cascade: true })
    waitingPages: WaitingPageEntity[];

    @Column({ default: 0 })
    credits: number;
}
