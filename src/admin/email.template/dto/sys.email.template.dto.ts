import { IsOptional, IsString } from 'class-validator'

export class SysEmailTemplateDTO {
   @IsString()
   readonly name: string

   @IsString()
   readonly mail_es: string

   @IsString()
   readonly mail_en: string

   @IsString()
   readonly mail_fr: string

   @IsString()
   readonly subject_es: string

   @IsString()
   readonly subject_en: string

   @IsString()
   readonly subject_fr: string

   @IsOptional()
   @IsString()
   readonly action_es: string

   @IsOptional()
   @IsString()
   readonly action_en: string

   @IsOptional()
   @IsString()
   readonly action_fr: string
}
