import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class UuidEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}

/** UUID primary key plus soft delete — for user, client, and organization. */
export abstract class BaseEntity extends UuidEntity {
    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt?: Date;
}
