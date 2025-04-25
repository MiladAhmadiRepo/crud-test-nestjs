import {Logger, Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm'
import {OrmConfigService,} from '../services'
import {DatabaseService} from "../services/database.service";


@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: OrmConfigService
        })],
    controllers: [],
    providers: [
      DatabaseService,
      OrmConfigService,
    ],

})
export class OrmModule {
}
