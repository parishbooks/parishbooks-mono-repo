import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { OrganizationProfileRepository } from './repository/organization.repository';

@Module({
    controllers: [OrganizationController],
    providers: [OrganizationService, OrganizationProfileRepository],
    exports: [OrganizationService],
})
export class OrganizationModule {}
