import { Injectable, Logger, StreamableFile } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { DefaultResult, getErrorMessage } from '@/helpers'
import { IRequestDatatable, IUser, Nullable, TDatatableColumns, TResult } from '@/types'
import { UserHasRole, User } from '@/entities'
import { plainToInstance } from 'class-transformer'
import generator from 'generate-password-ts'
import { UserDto } from './dto'
import * as process from 'node:process'
import * as bcrypt from 'bcrypt'
import { join } from 'node:path'
import { createReadStream } from 'node:fs'
import { DataTableService } from '@/commons/shared/data.table.service'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class UsersService {
   private readonly logger = new Logger(UsersService.name)

   constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly dataTableService: DataTableService,
      private readonly dataSource: DataSource,
      private readonly clsService: ClsService
   ) {}

   async list(request: IRequestDatatable): Promise<TResult> {
      const result = DefaultResult()
      try {
         const currentUser = this.clsService.get<IUser>('currentUser')
         const columns: TDatatableColumns = [
            { field: 'id' },
            { field: 'name', search: true },
            { field: 'email', search: true },
            { field: 'phone', search: true },
            { field: 'active' }
         ]
         const where = new Array<string>()
         if (!currentUser.isSuperAdmin) {
            where.push('id>1')
         }
         result.dt = await this.dataTableService.execute(request, 'users', 'id', columns, where.join(' AND '))
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async fetch(id: number): Promise<TResult> {
      const result = DefaultResult()
      try {
         result.user = await User.findOne({ where: { id }, relations: { roles: true, permissions: true } })
         result.user.roles = result.user.roles.map((r) => r.id)
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async store(user: UserDto): Promise<TResult> {
      const result = DefaultResult()
      try {
         const password = generator.generate({
            length: 8,
            numbers: true
         })
         const currentUser = this.clsService.get<IUser>('currentUser')
         await this.dataSource.manager.transaction(async (em) => {
            const repo = em.withRepository(this.userRepository)
            const record = repo.create({
               name: user.name,
               email: user.email,
               password: await bcrypt.hash(password, 10),
               phone: user.phone,
               active: user.active,
               created_by: currentUser.id,
               updated_by: currentUser.id
            })
            const row = await repo.save(record)
            return this.syncRoles(row.id, user.roles, em)
         })
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async update(id: number, user: UserDto): Promise<TResult> {
      const result = DefaultResult()
      try {
         const currentUser = this.clsService.get<IUser>('currentUser')
         await this.dataSource.manager.transaction(async (em) => {
            const repo = em.withRepository(this.userRepository)
            await repo.update(id, {
               name: user.name,
               email: user.email,
               phone: user.phone,
               active: user.active,
               updated_by: currentUser.id
            })
            return this.syncRoles(id, user.roles, em)
         })
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async destroy(id: number): Promise<TResult> {
      const result = DefaultResult()
      try {
         await this.userRepository.delete(id)
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async findByEmail(email: string): Promise<Nullable<User>> {
      return this.userRepository.findOne({
         where: { email },
         relations: { roles: true, permissions: true }
      })
   }

   async syncRoles(id: number, roles: Array<number>, transaction: EntityManager) {
      await transaction.delete(UserHasRole, { user: id })
      for (const role of roles) {
         await transaction.save(
            plainToInstance(UserHasRole, {
               user: id,
               role
            })
         )
      }
   }

   async getUserPhotoById(id: number): Promise<StreamableFile> {
      const user = await User.findOne({ where: { id }, select: { photo: true } })
      let filePath = join(process.cwd(), 'resources/assets')
      if (user?.photo && id) {
         filePath = join(filePath, user.photo)
      } else {
         filePath = join(filePath, 'avatar.png')
      }
      const fileStream = createReadStream(filePath)
      return new StreamableFile(fileStream)
   }
}
