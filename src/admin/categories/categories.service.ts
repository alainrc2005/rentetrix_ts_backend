import { Injectable, Logger } from '@nestjs/common'
import type { TResult } from '@/types'
import { DataSource } from 'typeorm'
import { DefaultResult, getErrorMessage, parseValue } from '@/helpers'
import moment from 'moment'
import { SysAppSetting } from '@/entities'

@Injectable()
export class CategoriesService {
   private readonly logger = new Logger(CategoriesService.name)
   private readonly commonFields = [
      ['id', 'name', 'active', 'system'], // 0
   ]

   private readonly tables: { [key: string]: number } = {
      fuel_types: 0,
      satisfaction_levels: 0,
      phone_gps_status: 0,
      payment_status: 0,
      genders: 0,
      countries: 0,
      contact_forms: 0,
      channels: 0,
      car_status: 0,
   }

   constructor(private readonly dataSource: DataSource) {
   }

   async getCategories(): Promise<TResult> {
      const result = DefaultResult()
      try {
         result.lookups = {}
         for (const table in this.tables) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            result.lookups[table] = await this.dataSource.manager
               .query(`select ${this.commonFields[this.tables[table]].join(',')}
                       from ${table}`)
         }
         const options = await SysAppSetting.findBy({ system: false })
         result.options = []
         for (const option of options) {
            result.options.push({
               code: option.id,
               value: parseValue(option.parse, option.value)
            })
         }
         result.today = moment().format('YYYY-MM-DD')
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }
}
