import { Module } from '@nestjs/common'
import { EmailTemplateController } from './email.template.controller'
import { EmailTemplateService } from './email.template.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysEmailTemplate } from '@/entities'
import { SharedModule } from '@/commons/shared/shared.module'

@Module({
   controllers: [EmailTemplateController],
   providers: [EmailTemplateService],
   imports: [TypeOrmModule.forFeature([SysEmailTemplate]), SharedModule]
})
export class EmailTemplateModule {
}
