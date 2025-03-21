import { FieldEntity } from 'src/field/field.entity';
import { WaitingPageEntity } from 'src/waiting-page/waiting-page.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity('dynamic_form')
export class DynamicFormEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => WaitingPageEntity, (waitingPage) => waitingPage.form, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'waitingPageId' })
    waitingPage: WaitingPageEntity;

    @OneToMany(() => FieldEntity, (field) => field.form)
    fields: FieldEntity[];
}
