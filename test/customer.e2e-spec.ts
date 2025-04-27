import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import {CustomerTddModule} from "../src/TDD/customer/customer-tdd.module";

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule, CustomerTddModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdId: number;

  it('/customers (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/customers')
      .send({
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '2001-01-01',
        phoneNumber: '1231231234',
        email: 'test@user.com',
        bankAccountNumber: '111111111',
      })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('/customers (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/customers')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/customers/:id (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/customers/${createdId}`)
      .expect(200);
    expect(res.body).toHaveProperty('id', createdId);
  });

  it('/customers/:id (PATCH)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/customers/${createdId}`)
      .send({ email: 'updated@user.com' })
      .expect(200);
    expect(res.body.email).toBe('updated@user.com');
  });

  it('/customers/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/customers/${createdId}`)
      .expect(200);
  });
});
