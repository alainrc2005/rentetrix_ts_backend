import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { EmailTemplateService } from './email.template.service'
import type { IRequestDatatable } from '@/types'
import { SysEmailTemplateDTO } from './dto/sys.email.template.dto'

@Controller('email-template')
export class EmailTemplateController {
   constructor(private readonly service: EmailTemplateService) {
   }

   @Post()
   list(@Body() request: IRequestDatatable) {
      return this.service.list(request)
   }

   @Get('fetch/:id')
   fetch(@Param('id', ParseIntPipe) id: number) {
      return this.service.fetch(id)
   }

   @Put('update/:id')
   update(@Param('id', ParseIntPipe) id: number, @Body() email: SysEmailTemplateDTO) {
      return this.service.update(id, email)
   }
}
