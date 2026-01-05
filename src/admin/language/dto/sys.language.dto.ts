import { IsString } from 'class-validator'

export class SysLanguageDTO {
   @IsString()
   readonly key: string

   @IsString()
   readonly name_es: string

   @IsString()
   readonly name_en: string

   @IsString()
   readonly name_fr: string
}
