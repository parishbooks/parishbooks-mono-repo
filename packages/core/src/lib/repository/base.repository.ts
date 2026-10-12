import { DataSource, EntityManager, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<TEntity extends ObjectLiteral> extends Repository<TEntity> {
    constructor(
        entity: EntityTarget<TEntity>,
        private readonly dataSource: DataSource,
    ) {
        super(entity, dataSource.manager);
    }

    withTransaction(callback: (transaction: EntityManager) => Promise<void>) {
        return this.dataSource.transaction(callback);
    }
}
