import { Module } from '@nestjs/common'
import { LocalCacheService } from './local.cache.service'

@Module({
   providers: [LocalCacheService],
   exports: [LocalCacheService]
})
export class LocalCacheModule {
}
