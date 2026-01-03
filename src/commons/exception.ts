import { Optional } from '@/types'
import { ObjectLiteral } from 'typeorm'

/**
 * Clase para el tratamiento de excepciones
 * @author Alain Ramírez Cabrejas <alain.ramirez@wimixsolutions.com>
 */
export class RentetrixException extends Error {
   public readonly code: string
   public readonly data: Optional<ObjectLiteral>

   constructor(code: string, message?: string, data?: ObjectLiteral) {
      super()
      this.name = 'RentetrixException'
      this.code = code
      this.message = message ?? code
      this.data = data

      Error.captureStackTrace(this, this.constructor);
   }
}