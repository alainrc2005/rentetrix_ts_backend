import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/entities'
import { FileStorageModule } from '@/commons/file.storage/file.storage.module'
import { DataTableService } from '@/services/data.table.service'

@Module({
   imports: [TypeOrmModule.forFeature([User]), FileStorageModule],
   controllers: [UsersController],
   providers: [UsersService, DataTableService],
   exports: [UsersService]
})
export class UsersModule {
}
