import { IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator'
import type { Optional } from '@/types'

/**
 * Clase DTO para el usuario autenticado, será utilizada en todos los microservicios
 * @author Alain Ramírez Cabrejas <alain.ramirez@wimixsolutions.com>
 */
export class AuthUserDto {
   @IsNotEmpty()
   @IsNumber()
   id: number

   @IsArray()
   roles: Array<string>

   @IsArray()
   permissions: Array<string>

   @IsOptional()
   @IsNumber()
   crm_branch_id: Optional<number>
}
