import { Injectable, Logger } from '@nestjs/common'
import { DataTableService } from '@/commons/shared/data.table.service'
import { InjectRepository } from '@nestjs/typeorm'
import { SysLanguage } from '@/entities'
import { Repository } from 'typeorm'
import type { IRequestDatatable, TDatatableColumns, TResult } from '@/types'
import { DefaultResult, getErrorMessage } from '@/helpers'
import { SysLanguageDTO } from '@/admin/language/dto/sys.language.dto'

@Injectable()
export class LanguageService {
   private readonly logger = new Logger(LanguageService.name)

   constructor(private readonly dataTableService: DataTableService,
               @InjectRepository(SysLanguage)
               private readonly languageRepository: Repository<SysLanguage>) {}

   async list(request: IRequestDatatable): Promise<TResult> {
      const result = DefaultResult()
      try {
         const columns: TDatatableColumns = [
            { field: 'id' },
            { field: 'key', search: true },
            { field: 'name_es', search: true },
         ]
         if (request.terms.search) {
            request.filter = request.terms.search
         }
         result.dt = await this.dataTableService.execute(request, 'sys_language', 'id', columns)
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async fetch(id: number): Promise<TResult> {
      const result = DefaultResult()
      try {
         result.row = await SysLanguage.findOneBy({ id })
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async update(id: number, language: SysLanguageDTO): Promise<TResult> {
      const result = DefaultResult()
      try {
         await SysLanguage.update(id, language)
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }
}
