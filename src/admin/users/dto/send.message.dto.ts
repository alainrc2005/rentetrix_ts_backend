import { IsNumber, IsString } from 'class-validator'

export class SendMessageDto {
   @IsNumber()
   readonly value: string

   @IsString()
   readonly message: string

   @IsString()
   readonly type: string
}
