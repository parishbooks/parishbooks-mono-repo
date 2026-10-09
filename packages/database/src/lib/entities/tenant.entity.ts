import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('tenant')
@Unique(['slug'])
export class Tenant extends BaseEntity {
    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'text' })
    slug!: string;

    @OneToMany(() => Organization, (organization) => organization.tenant)
    organizations!: Organization[];

    @OneToMany(() => User, (user) => user.tenant)
    users!: User[];
}
