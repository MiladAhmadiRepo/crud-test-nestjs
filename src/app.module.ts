import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule as TDDCustomerModule } from './TDD/customer/customer.module';
import { CustomerModule as BDDCustomerModule } from './BDD/customer/customer.module';
import { CustomerModule as DDDCustomerModule } from './DDD/customer/customer.module';
import { CustomerModule as CleanCustomerModule } from './Clean/customer/customer.module';
import {OrmModule} from "./Orm/module/orm.module";
import {ConfigModule} from "@nestjs/config";
export const envUrl = `env/.env.${process.env.NODE_ENV || 'local'}`

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (() => {
        console.log('**************************' + process.env.NODE_ENV + '************************')
        return (['main', 'dev',  ].includes(process.env.NODE_ENV??'dev') ? '../' : '') + envUrl
      })(),
    }),
    OrmModule,
    TDDCustomerModule,
    // BDDCustomerModule,
    // DDDCustomerModule,
    // CleanCustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
