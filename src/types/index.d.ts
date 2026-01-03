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


export type { Nullable, Optional, TMetaFileStorage, TResult }
