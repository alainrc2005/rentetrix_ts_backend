import { Logger } from '@nestjs/common'
import { ObjectLiteral, QueryFailedError } from 'typeorm'
import { TResult } from '@/types'
import { RentetrixException } from '@/commons/exception'
import { AssertionError } from 'node:assert'
import * as fs from 'node:fs'
export * from './rentetrix.crypto'
export * from './auth.user.dto'

const TResults = {
   E_USER_NOT_FOUND: 'e_user_not_found',
   E_BAD_USER_PASSWORD: 'e_bad_user_password',
   E_USER_BANNED: 'e_user_banned',
   E_COMMUNICATION: 'e_communication',
   E_ROW_DUPLICATE: 'e_row_duplicate',
   E_ROW_FOREIGN_KEY: 'e_row_foreign_key',
   E_RECORD_NOT_FOUND: 'e_record_not_found',
   E_PASSWORD_INVALID: 'e_password_invalid',
   /**
    * No autorizado
    */
   E_UNAUTHORIZED: 'e_unauthorized',
   /**
    * Invalid One Time Password code
    */
   E_BAD_OTP: 'e_bad_otp',
   OK: 'Ok',
   Error: 'Error'
}

const DefaultResult = (): TResult => ({ code: TResults.OK })

/**
 * Tratamiento de errores y escritura en log
 * @param e Excepción
 * @param logger Clase Logger
 */
function getErrorMessage(e: unknown, logger: Logger): string {
   if (e instanceof Error) {
      if (e instanceof QueryFailedError) {
         switch (e.driverError.code) {
            case '23505':
               return TResults.E_ROW_DUPLICATE
            case '23503':
               return TResults.E_ROW_FOREIGN_KEY
            default:
               logger.error(`RENTETRIX DB Error Message: ${e.message ?? TResults.Error}`)
               return TResults.Error
         }
      } else if (e instanceof RentetrixException) {
         logger.error(`RentetrixException: ${e.code}`)
         return e.code
      } else if (e instanceof AssertionError) {
         logger.error(`AssertionError: ${e.message}`)
         return e.message
      }
      else {
         logger.error(`RENTETRIX Error Message: ${e.message}`)
         return TResults.Error
      }
   }
   return TResults.Error
}

/**
 * Crea directorio a partir de un path, de forma recursiva
 * @param path
 */
function createRecursiveDirectory(path: string): void {
   try {
      fs.mkdirSync(path, { recursive: true })
   } catch (err) {
      if (err.code !== 'EEXIST') {
         throw new Error(`Error creating directory: ${err.message}`)
      }
   }
}

function parseValue(type: string, value: string): string | number | ObjectLiteral {
   switch (type) {
      case 'integer':
         return Number.parseInt(value)
      case 'float':
         return Number.parseFloat(value)
      case 'json':
         return JSON.parse(value)
      case 'string':
      default:
         return value
   }
}

const ksec = 'f0fcdd65e29c4c8aa0c24246d59ff1fc2f7464300b0f288d6495a1f7dd4509b5'

export { TResults, DefaultResult, getErrorMessage, createRecursiveDirectory, ksec, parseValue }
