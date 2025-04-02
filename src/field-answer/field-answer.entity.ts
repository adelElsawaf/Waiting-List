import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FieldEntity } from 'src/field/field.entity';
import { FormSubmissionEntity } from 'src/form-submission/form-submission.entity';


@Entity('field_answer')
export class FieldAnswerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    answer: string;


    @ManyToOne(() => FieldEntity, (field) => field.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fieldId' })
    field: FieldEntity;

    @ManyToOne(() => FormSubmissionEntity, (submission) => submission.answers, { onDelete: 'CASCADE' })
    submission: FormSubmissionEntity;
}

