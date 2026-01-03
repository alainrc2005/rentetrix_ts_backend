import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RoleDTO } from './dto/RoleDTO'
import type { IRequestDatatable } from '@/types'

@Controller('roles')
export class RolesController {
   constructor(private readonly rolesService: RolesService) {}

   @Post()
   list(@Body() request: IRequestDatatable) {
      return this.rolesService.list(request)
   }

   @Get('fetch/:id')
   fetch(@Param('id', ParseIntPipe) id: number) {
      return this.rolesService.fetch(id)
   }

   @Post('store')
   store(@Body() role: RoleDTO) {
      return this.rolesService.store(role)
   }

   @Put('update/:id')
   update(@Param('id', ParseIntPipe) id: number, @Body() role: RoleDTO) {
      return this.rolesService.update(id, role)
   }

   @Delete('destroy/:id')
   destroy(@Param('id', ParseIntPipe) id: number) {
      return this.rolesService.destroy(id)
   }

   @Get('all')
   getAllRoles() {
      return this.rolesService.getAll()
   }

   @Get('permissions')
   getPermissions() {
      return this.rolesService.getPermissions()
   }
}
