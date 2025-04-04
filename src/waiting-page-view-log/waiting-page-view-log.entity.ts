import { WaitingPageEntity } from "src/waiting-page/waiting-page.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Index('waiting_page_view_idx', ['waitingPage', 'userIpAddress'])
@Entity('waiting_page_view_logs')
export default class WaitingPageViewLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => WaitingPageEntity, (page) => page.views, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'waitingPageId' })  
    waitingPage: WaitingPageEntity;
    
    @Column()
    userIpAddress:string
    
    @CreateDateColumn()
    viewedAt:Date
}