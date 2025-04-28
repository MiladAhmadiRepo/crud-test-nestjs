import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { OrmLogger } from './logger.service'
import { join } from 'path';


@Injectable({ scope: Scope.DEFAULT })
export class OrmConfigService implements TypeOrmOptionsFactory {
  constructor(private srv: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        database: process.env.DATABASE_DB,
        synchronize: true,
        autoLoadEntities: true,
        logger: new OrmLogger(),
        entities: [join(__dirname, '../models/**/*.model{.ts,.js}')],
        migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
        // entities: ['src/Orm/models/**/*.model{.ts,.js}'],
        // migrations: ['src/Orm/migrations/*{.ts,.js}'],
    }
  }
}
// password: process.env.DATABASE_PASSWORD,
