import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { DynamicFormEntity } from 'src/dynamic-form/dynamic-form.entity';

@Entity('form_view_logs')
@Unique(['visitorId', 'form']) // Enforce one view log per visitor per form
export class FormViewLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    visitorId: string;

    @CreateDateColumn()
    viewedAt: Date;

    @ManyToOne(() => DynamicFormEntity, (form) => form.viewLogs, {
        onDelete: 'CASCADE',
    })
    form: DynamicFormEntity;
}
