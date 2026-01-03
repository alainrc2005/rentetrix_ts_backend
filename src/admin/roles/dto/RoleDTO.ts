import { IsBoolean, IsString, IsArray } from 'class-validator'

export class RoleDTO {
   @IsString()
   readonly name: string

   @IsString()
   readonly description: string

   @IsArray()
   readonly permissions: Array<number>

   @IsBoolean()
   readonly system: boolean
}
