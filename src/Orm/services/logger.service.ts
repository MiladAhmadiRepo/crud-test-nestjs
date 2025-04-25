import { Logger } from 'typeorm'

export class OrmLogger implements Logger {
  // implement all methods from logger class
  logQuery(query: string, parameters?: any[]) {
    console.log(query)
    console.log(parameters)
  }

  logQueryError() {}

  logQuerySlow() {}

  logSchemaBuild() {}

  logMigration() {}

  log() {}
}
