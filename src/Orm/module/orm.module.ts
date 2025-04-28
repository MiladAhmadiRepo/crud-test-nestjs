import {Logger, Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm'
import {OrmConfigService,} from '../services'
import {CustomerEntity} from "../models/customer/customer.model";


@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: OrmConfigService
        }),
        TypeOrmModule.forFeature([CustomerEntity])],
    controllers: [],
    providers: [
      OrmConfigService,
    ],
    exports: [
      TypeOrmModule,
    ],

})
export class OrmModule {
}
