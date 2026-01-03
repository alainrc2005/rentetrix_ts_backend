import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import {
  IDatatableResult,
  IRequestDatatable,
  TDatatableColumns
} from '@/types'

@Injectable()
export class DataTableService {
  constructor(private readonly dataSource: DataSource) {}

  limit(request: IRequestDatatable): string {
    let result = ''
    if (request?.rowsPerPage && request?.rowsPerPage !== 0) {
      result += `LIMIT ${request.rowsPerPage}`
    }
    if (request?.startRow || request?.startRow === 0) {
      result += ` OFFSET ${request?.startRow}`
    }
    return result
  }

  order(request: IRequestDatatable): string {
    let result = ''
    if (request?.sortBy) {
      result += `ORDER BY ${request.sortBy} ${request?.descending ? 'DESC' : 'ASC'}`
    }
    return result
  }

  filter(request: IRequestDatatable, columns: TDatatableColumns, bindings: Array<any>): string {
    let result = ''
    const globalSearch = new Array<string>()
    if (request.filter) {
      let index = 1
      for (const column of columns) {
        if (column?.search) {
          bindings.push(`%${request.filter}%`)
          globalSearch.push(`${column.field} ILIKE $${index++}`)
        }
      }
    }
    if (globalSearch.length > 0) {
      result += 'WHERE (' + globalSearch.join(' OR ') + ')'
    }
    return result
  }

  async execute(
    request: IRequestDatatable,
    table: string,
    primaryKey: string,
    columns: TDatatableColumns,
    whereAll: string = '',
  ): Promise<IDatatableResult> {
    const result: IDatatableResult = { rows: [], recordsFiltered: 0 }
    const bindings = new Array<any>()
    let limit = ''
    if (Number(request?.rowsPerPage) > 0) {
      limit = this.limit(request)
    }
    const order = this.order(request)
    let where = this.filter(request, columns, bindings)
    if (whereAll.length !== 0) {
      if (where.length > 0) {
        where += ' AND ' + whereAll
      } else {
        where = `WHERE ${whereAll}`
      }
    }
    const sql = `SELECT ${columns.map(m => m.field).join(',')} FROM ${table} ${where} ${order} ${limit}`
    const count: Array<{ cnt: string }> = await this.dataSource.query(
      `SELECT count(${primaryKey}) as cnt
       FROM ${table} ${where}`,
      bindings
    )
    result.recordsFiltered = Number(count[0].cnt)
    result.rows = await this.dataSource.query(sql, bindings)
    return result
  }
}
