/**
 * Servicio de Almacenamiento de Archivos del sistema
 * @author Alain Ramírez Cabrejas <alainrc2005@gmail.com>
 */
import { Injectable, Logger, Res, StreamableFile } from '@nestjs/common'
import { createRecursiveDirectory, DefaultResult, getErrorMessage, TResults } from '@/helpers'
import { join } from 'node:path'
import { v4 as uuidV4 } from 'uuid'
import * as fs from 'node:fs'
import type { IUser, Optional, TMetaFileStorage, TResult } from '@/types'
import { ClsService } from 'nestjs-cls'
import { FileStorage } from '@/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { createReadStream } from 'node:fs'
import type { Response } from 'express'
import * as assert from 'node:assert'

@Injectable()
export class FileStorageService {
   private readonly logger = new Logger(FileStorageService.name)
   constructor(private readonly clsService: ClsService,
               @InjectRepository(FileStorage)
               private readonly fileStorageRepository: Repository<FileStorage>,
               ){}

   /**
    * Coloca archivos en el almacenamiento del sistema
    * @param files Arreglo de Archivos
    * @return TResult.files: Array<TMetaFileStorage>
    */
   async store(files: Express.Multer.File[]): Promise<TResult> {
      const result = DefaultResult()
      result.files = new Array<TMetaFileStorage>()
      try {
         const now = new Date()
         const year = now.getFullYear()
         const month = now.getMonth() + 1
         const storagePath = join(process.cwd(), 'storage/files', year.toString(), month.toString())
         createRecursiveDirectory(storagePath)
         if (files && files.length > 0) {
            for (const file of files) {
               const meta: TMetaFileStorage = {
                  uuid: uuidV4(),
                  filename: file.originalname,
                  mimeType: file.mimetype ?? 'application/octet-stream',
                  size: file.size
               }
               fs.writeFileSync(join(storagePath, meta.uuid), file.buffer)
               const user = this.clsService.get<IUser>('currentUser')
               const fileStorage = this.fileStorageRepository.create({
                  uuid: meta.uuid,
                  meta,
                  year,
                  month,
                  created_by: user.id,
                  updated_by: user.id,
               })
               await this.fileStorageRepository.save(fileStorage)
               result.files.push(meta)
            }
         }
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   getFilePath(file: FileStorage) {
      return join(process.cwd(), 'storage/files', file.year.toString(), file.month.toString(), file.uuid)
   }

   /**
    * Obtiene el path de un archivo a partir del UUID
    * @param uuid Identificador del Archivo
    */
   async getFilePathByUuid(uuid: string): Promise<string> {
      const file = await this.fileStorageRepository.findOneBy({ uuid })
      assert.ok(file !== null, TResults.E_RECORD_NOT_FOUND)
      return this.getFilePath(file)
   }

   /**
    * Borra un archivo del almacenamiento del sistema
    * @param uuid Identificador del Archivo
    */
   async delete(uuid: string): Promise<TResult> {
      const result = DefaultResult()
      try {
         const file = await this.fileStorageRepository.findOneBy({ uuid })
         if (file) {
            const storageFilePath = this.getFilePath(file)
            fs.unlinkSync(storageFilePath)
            await this.fileStorageRepository.delete({ uuid: file.uuid })
         }
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   /**
    * Obtiene un objeto StreamableFile a partir de un archivo del almacenamiento del sistema
    * @param uuid Identificador del Archivo
    * @return StreamableFile | undefined
    */
   async getStreamableFile(uuid: string): Promise<Optional<StreamableFile>> {
      const file = await this.fileStorageRepository.findOneBy({ uuid })
      if (file) {
         const storageFilePath = this.getFilePath(file)
         const fileStream = createReadStream(storageFilePath)
         return new StreamableFile(fileStream)
      }
   }

   /**
    * Obtiene un archivo del almacenamiento del sistema y lo inyecta en el Response
    * @param uuid Identificador del Archivo
    * @param response Express.Response
    */
   async getFileResponse(uuid: string, @Res() response: Response): Promise<void> {
      const file = await this.fileStorageRepository.findOneBy({ uuid })
      if (file) {
         const storageFilePath = this.getFilePath(file)
         const fileStream = createReadStream(storageFilePath)
         response.setHeader('Content-Type', file.meta.mimeType)
         response.setHeader('Content-Disposition', `attachment; filename="${file.meta.filename}"`);

         fileStream.pipe(response)
      }
   }
}
