import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from '@/entities'
import { DataTableService } from '@/services/data.table.service'

@Module({
   imports: [TypeOrmModule.forFeature([Role])],
   providers: [RolesService, DataTableService],
   controllers: [RolesController]
})
export class RolesModule {
}
