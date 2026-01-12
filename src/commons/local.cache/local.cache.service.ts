import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { User } from '@/entities'
import { TSystemRole } from '@/helpers'

@Injectable()
export class LocalCacheService implements OnModuleInit {
   public static readonly C_USERS = 'users'
   private readonly logger = new Logger(LocalCacheService.name)

   constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
   }

   async onModuleInit() {
      this.logger.log('LocalCacheService load data Start')
      const now = Date.now()
      await this.refresh()
      this.logger.log(`LocalCacheService load data End [${Date.now() - now}ms]`)
   }

   async getKey<T>(key: string, defaultValue: T): Promise<T> {
      const cache = await this.cacheManager.get<T>(key)
      return cache ?? defaultValue
   }

   async refresh(): Promise<void> {
      await this.refreshUsers()
   }

   async refreshUsers(): Promise<void> {
      const users = await User.find({
         where: { active: true },
         relations: { roles: true, permissions: true },
         select: { id: true, roles: true, permissions: true, email: true }
      })
      const maps = users.map(u => ({
         id: u.id,
         email: u.email,
         roles: u.roles.map(r => r.name),
         permissions: [...new Set(u.roles.flatMap(r => r.permissions.map(p => p.name)))],
         isSuperAdmin: u.roles.some(r => r.name === TSystemRole.SUPERADMIN),
         isAdmin: u.roles.some(r => r.name === TSystemRole.ADMIN),
         isDriver: u.roles.some(r => r.name === TSystemRole.DRIVER),
         isOwner: u.roles.some(r => r.name === TSystemRole.OWNER),
      }))
      this.logger.log(`Refreshing users: ${users.length}`)
      await this.cacheManager.set(LocalCacheService.C_USERS, maps)
   }
}
