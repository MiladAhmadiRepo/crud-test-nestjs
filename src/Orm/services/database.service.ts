import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { Client } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);


  // Target database name
  private readonly dbName = 'milad';

  /**
   * Automatically check and create database when module initializes
   */
  async onModuleInit() {
    await this.ensureDatabaseExists();
  }

  /**
   * Check if the database exists and create it if it doesn't
   */
  public async ensureDatabaseExists(): Promise<void> {
    const client = new Client({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
    } );

    try {
      await client.connect();
      this.logger.log('Connected to PostgreSQL server');

      // Check if database exists
      const result = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [this.dbName]
      );

      if (result.rowCount === 0) {
        this.logger.log(`Database "${this.dbName}" does not exist, creating it now...`);

        // Create database if it doesn't exist
        await client.query(`CREATE DATABASE ${this.dbName}`);
        this.logger.log(`Database "${this.dbName}" created successfully`);
      } else {
        this.logger.log(`Database "${this.dbName}" already exists`);
      }
    } catch (error) {
      this.logger.error(`Failed to ensure database exists: ${error.message}`);
      throw error;
    } finally {
      await client.end();
    }
  }
}
