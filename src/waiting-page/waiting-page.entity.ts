import { DynamicFormEntity } from "src/dynamic-form/dynamic-form.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany } from "typeorm";

@Entity("waiting_pages")
export class WaitingPageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    subTitle: string;

    @Column()
    backgroundImgUrl: string;

    @Column({unique: true, nullable: false })
    generatedTitle: string;

    @ManyToOne(() => UserEntity, (user) => user.waitingPages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ownerId' })
    owner: UserEntity;


    @OneToMany(() => DynamicFormEntity, (form) => form.waitingPage)
    forms: DynamicFormEntity[];

    @Column()
    isFree: Boolean

    @Column()
    shareableUrl: string
}
