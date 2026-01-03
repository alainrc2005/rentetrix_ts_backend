/**
 * @author Alain Ramírez Cabrejas <alainrc2005@gmail.com>
 */

type Nullable<T> = T|null
type Optional<T> = T|undefined

type TMetaFileStorage = {
   uuid: string,
   filename: string,
   mimeType: string,
   size: number
}

type TResult = { [key: string]: any }

interface IRequestDatatable {
   filter?: string
   sortBy?: string
   descending: boolean
   startRow?: number
   rowsPerPage?: number

   [key: string]: any
}

type TDatatableColumn = {
   field: string
   search?: boolean
}
type TDatatableColumns = TDatatableColumn[]

interface IDatatableResult {
   recordsFiltered: number
   rows: Array<any>
}

export type { Nullable, Optional, TMetaFileStorage, TResult,
   IRequestDatatable, TDatatableColumns, IDatatableResult, TDatatableColumn }
