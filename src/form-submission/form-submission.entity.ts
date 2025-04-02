import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
import { FieldAnswerEntity } from 'src/field-answer/field-answer.entity';
import { DynamicFormEntity } from 'src/dynamic-form/dynamic-form.entity';

@Entity('submission')
export class FormSubmissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => DynamicFormEntity, (form) => form.submissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'formId' })
    form: DynamicFormEntity;

    @OneToMany(() => FieldAnswerEntity, (answer) => answer.submission, { cascade: true })
    answers: FieldAnswerEntity[];
}
