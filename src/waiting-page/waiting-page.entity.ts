import { DynamicFormEntity } from "src/dynamic-form/dynamic-form.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";

@Entity("waiting_page")
export class WaitingPageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    subTitle: string;

    @Column()
    backgroundImgUrl: string;

    @Column({ unique: true, nullable: false })
    generatedTitle: string;

    @ManyToOne(() => UserEntity, (user) => user.waitingPages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ownerId' })
    owner: UserEntity;


    @OneToOne(() => DynamicFormEntity, (form) => form.waitingPage)
    form: DynamicFormEntity;
}
