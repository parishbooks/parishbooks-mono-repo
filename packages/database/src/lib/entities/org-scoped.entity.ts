import { Column, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';

/** Base for domain tables scoped to an organization (see ER_DESIGN §8). */
@Index(['orgId'])
export abstract class OrgScopedEntity extends BaseEntity {
    @Column({ type: 'uuid', name: 'org_id' })
    orgId!: string;

    @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'org_id' })
    organization!: Organization;
}
