import { Module } from '@nestjs/common';
import { DataTableService } from './data.table.service'
import { TemplateService } from './template.service'

@Module({
  providers: [DataTableService, TemplateService],
  exports: [DataTableService, TemplateService]
})
export class SharedModule {}
