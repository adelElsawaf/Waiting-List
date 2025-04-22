import { DynamicFormEntity } from "src/dynamic-form/dynamic-form.entity";
import { UserEntity } from "src/user/user.entity";
import WaitingPageViewDataEntity from "src/waiting-page-view-log/waiting-page-view-log.entity";
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

    @Column({ unique: true, nullable: false })
    generatedTitle: string;

    @ManyToOne(() => UserEntity, (user) => user.waitingPages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ownerId' })
    owner: UserEntity;


    @OneToOne(() => DynamicFormEntity, (form) => form.waitingPage)
    form: DynamicFormEntity;

    @OneToMany(() => WaitingPageViewDataEntity, (viewData) => viewData.waitingPage)
    views: WaitingPageViewDataEntity[];
    
    @Column()
    isFree:Boolean

    @Column()
    shareableUrl: string
}
