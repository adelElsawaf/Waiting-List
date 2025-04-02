import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { FieldTypeEnum } from './enum/FieldTypeEnum';
import { DynamicFormEntity } from 'src/dynamic-form/dynamic-form.entity';
import { FieldAnswerEntity } from 'src/field-answer/field-answer.entity';

@Entity('fields')
export class FieldEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    placeholder?: string;

    @Column({ default: false })
    isMandatory: boolean;

    @Column({ type: 'enum', enum: FieldTypeEnum })
    type: FieldTypeEnum;

    @ManyToOne(() => DynamicFormEntity, (form) => form.fields, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'formId' })
    form: DynamicFormEntity;

    @OneToMany(() => FieldAnswerEntity, (answer) => answer.field, { cascade: true })
    answers: FieldAnswerEntity[];
}
