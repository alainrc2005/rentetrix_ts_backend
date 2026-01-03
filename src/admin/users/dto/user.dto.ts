import { IsArray, IsBoolean, IsString } from 'class-validator'

export class UserDto {
   @IsString()
   readonly name: string

   @IsString()
   readonly email: string

   @IsString()
   readonly phone: string

   @IsArray()
   readonly roles: Array<number>

   @IsBoolean()
   readonly active: boolean
}
