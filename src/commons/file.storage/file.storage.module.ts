import { Module } from '@nestjs/common'
import { FileStorageService } from './file.storage.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileStorage } from '@/entities'

@Module({
   imports: [TypeOrmModule.forFeature([FileStorage])],
   providers: [FileStorageService],
   exports: [FileStorageService],
})
export class FileStorageModule {

}
