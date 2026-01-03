import { DataSource } from 'typeorm'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Global() // makes the module available globally for other modules once imported in the app modules
@Module({
   imports: [],
   providers: [
      {
         provide: DataSource, // add the datasource as a provider
         inject: [ConfigService],
         useFactory: async (configService: ConfigService) => {
            const logger = new Logger(RentetrixOrmModule.name)
            // using the factory function to create the datasource instance
            try {
               const dataSource = new DataSource({
                  type: 'postgres',
                  host: configService.get<string>('database.host'),
                  port: configService.get<number>('database.port'),
                  username: configService.get<string>('database.username'),
                  password: configService.get<string>('database.password'),
                  database: configService.get<string>('database.database'),
                  schema: configService.get<string>('database.schema'),
                  ssl: { rejectUnauthorized: false },
                  synchronize: false,
                  logging: false,
                  entities: [`${__dirname}/../../**/**.entity{.ts,.js}`], // this will automatically load all entity files in the src folder
               })
               await dataSource.initialize() // initialize the data source
               logger.log('Database connected successfully')
               return dataSource
            } catch (error) {
               console.error('Error connecting to database')
               throw error
            }
         }
      }
   ],
   exports: [DataSource]
})
export class RentetrixOrmModule {
}
