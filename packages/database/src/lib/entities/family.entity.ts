import { Column, Entity, Index } from 'typeorm';
import { OrganizationScopedEntity } from './organization-scoped.entity';

@Entity('family')
@Index(['organizationId', 'id'])
export class Family extends OrganizationScopedEntity {
    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'jsonb', nullable: true })
    address?: Record<string, unknown>;
}
