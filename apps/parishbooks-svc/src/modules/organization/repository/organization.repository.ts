import { Repository, DataSource } from 'typeorm';
import { OrganizationProfile } from '@parishbooks/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationProfileRepository extends Repository<OrganizationProfile> {
    constructor(dataSource: DataSource) {
        super(OrganizationProfile, dataSource.createEntityManager());
    }
}
