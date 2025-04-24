import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { typeormConfig } from '../config/typeorm-config'
import { PlanSubscriber } from '../subscriber/plan.subscriber'
import { OrmLogger } from './logger.service'
@Injectable({ scope: Scope.DEFAULT })
export class OrmConfigService implements TypeOrmOptionsFactory {
  constructor(private srv: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const conf = typeormConfig(this.srv)
    return {
      ...conf,
      autoLoadEntities: true,
      logger: new OrmLogger(),
    }
  }
}
