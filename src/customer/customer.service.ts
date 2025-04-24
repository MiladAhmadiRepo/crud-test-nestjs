import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateCustomerDto} from './dto/create-customer.dto';
import {UpdateCustomerDto} from './dto/update-customer.dto';
import {CustomerEntity} from "../orm/models/customer/customer.model";
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(CustomerEntity)
        private customerRepository: Repository<CustomerEntity>,
    ) {}

    create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
        const customer = this.customerRepository.create(createCustomerDto);
        return this.customerRepository.save(customer);
    }


}
