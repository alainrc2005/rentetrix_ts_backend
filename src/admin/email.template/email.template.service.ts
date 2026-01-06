import { Injectable, Logger } from '@nestjs/common'
import { DataTableService } from '@/commons/shared/data.table.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SysEmailTemplate } from '@/entities'
import type { IRequestDatatable, TDatatableColumns, TResult } from '@/types'
import { DefaultResult, getErrorMessage, TResults } from '@/helpers'
import { SysEmailTemplateDTO } from '@/admin/email.template/dto/sys.email.template.dto'
import assert from 'node:assert'

@Injectable()
export class EmailTemplateService {
   private readonly logger = new Logger(EmailTemplateService.name)
   constructor(private readonly dataTableService: DataTableService,
               @InjectRepository(SysEmailTemplate)
               private readonly repository: Repository<SysEmailTemplate>) {}

   async list(request: IRequestDatatable): Promise<TResult> {
      const result = DefaultResult()
      try {
         const columns: TDatatableColumns = [
            { field: 'id' },
            { field: 'name', search: true },
            { field: 'updated_at' },
         ]
         if (request.terms.search) {
            request.filter = request.terms.search
         }
         result.dt = await this.dataTableService.execute(request, 'sys_email_templates', 'id', columns)
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async fetch(id: number): Promise<TResult> {
      const result = DefaultResult()
      try {
         result.row = await SysEmailTemplate.findOneBy({ id })
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async update(id: number, email: SysEmailTemplateDTO): Promise<TResult> {
      const result = DefaultResult()
      try {
         const et = await this.repository.findOneBy({ id })
         assert.ok(et != null, TResults.E_RECORD_NOT_FOUND)
         this.repository.merge(et, email)
         await this.repository.save(et)
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }
}
