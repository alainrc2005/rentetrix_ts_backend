import * as process from 'node:process'

export const Configuration = () => ({
   app: {
      port: Number(process.env.APP_PORT ?? 3000),
      name: process.env.APP_NAME ?? 'Rentetrix'
   },
   database: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA
   },
   jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
   }
})
