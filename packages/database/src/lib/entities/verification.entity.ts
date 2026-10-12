import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('verification')
@Index(['identifier'])
export class Verification extends BaseEntity {
    @Column({ type: 'text' })
    identifier!: string;

    @Column({ type: 'text' })
    value!: string;

    @Column({ type: 'timestamptz' })
    expiresAt!: Date;
}
