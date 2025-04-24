import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { OrmLogger } from './logger.service'
@Injectable({ scope: Scope.DEFAULT })
export class OrmConfigService implements TypeOrmOptionsFactory {
  constructor(private srv: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return{
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
        synchronize: false,
        autoLoadEntities: true,
        logger: new OrmLogger(),
        entities: ['src/orm/models/**/*.model{.ts,.js}'],
        migrations: ['src/orm/migrations/*{.ts,.js}'],
    };
  }
}
