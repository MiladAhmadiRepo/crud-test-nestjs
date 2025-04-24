import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { OrmConfigService, } from '../services'



@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useClass: OrmConfigService
  })],
  controllers: [],
  providers: [  ]
  // providers: [SnakeNamingStrategy, AppLogger, DatabaseService],

})
export class OrmModule {}
