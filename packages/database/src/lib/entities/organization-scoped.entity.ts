import { Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

// Subclasses must add @Entity(...) plus @Index(['organizationId', 'id']).
// Every tenant-scoped query must filter on organizationId.
@Index(['organizationId'])
export abstract class OrganizationScopedEntity extends BaseEntity {
    @Column({ type: 'uuid' })
    organizationId!: string;
}
