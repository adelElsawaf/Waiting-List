import { FieldEntity } from 'src/field/field.entity';
import { FormSubmissionEntity } from 'src/form-submission/form-submission.entity';
import { WaitingPageEntity } from 'src/waiting-page/waiting-page.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity('dynamic_forms')
export class DynamicFormEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => WaitingPageEntity, (waitingPage) => waitingPage.form, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'waitingPageId' })
    waitingPage: WaitingPageEntity;

    // ✅ This remains One-To-Many, as one form can have multiple submissions
    @OneToMany(() => FormSubmissionEntity, (submission) => submission.form)
    submissions: FormSubmissionEntity[];

    @OneToMany(() => FieldEntity, (field) => field.form)
    fields: FieldEntity[];
}
