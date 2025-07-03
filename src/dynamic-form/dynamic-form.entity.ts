import { FieldEntity } from 'src/field/field.entity';
import { FormSubmissionEntity } from 'src/form-submission/form-submission.entity';
import { FormViewLogEntity } from 'src/form-view-logs/form-view-logs.entity';
import { WaitingPageEntity } from 'src/waiting-page/waiting-page.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, Column, ManyToOne } from 'typeorm';

@Entity('dynamic_forms')
export class DynamicFormEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => WaitingPageEntity, (waitingPage) => waitingPage.forms, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'waitingPageId' })
    waitingPage: WaitingPageEntity;

    // ✅ This remains One-To-Many, as one form can have multiple submissions
    @OneToMany(() => FormSubmissionEntity, (submission) => submission.form)
    submissions: FormSubmissionEntity[];

    @OneToMany(() => FieldEntity, (field) => field.form)
    fields: FieldEntity[];

    @OneToMany(() => FormViewLogEntity, (viewLog) => viewLog.form)
    viewLogs: FormViewLogEntity[];

    @Column({ default: false  , nullable: true} )
    isActive: boolean;


}
