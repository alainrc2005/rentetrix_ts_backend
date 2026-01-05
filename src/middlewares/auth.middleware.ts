import {
   HttpStatus,
   Injectable,
   NestMiddleware
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { ClsService } from 'nestjs-cls'
import { AuthService } from '@/auth/auth.service'
import { LocalCacheService } from '@/commons/local.cache/local.cache.service'
import { IUser, TUsers } from '@/types'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
   constructor(
      private readonly clsService: ClsService,
      private readonly authService: AuthService,
      private readonly localCacheService: LocalCacheService
   ) {
   }

   async use(req: Request, res: Response, next: NextFunction) {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(HttpStatus.UNAUTHORIZED).json({ code: 'e_unauthorized' }).end()
         return
      }

      const [, token] = authHeader.split(' ')
      try {
         const payload = await this.authService.verifyToken(token)
         const users = await this.localCacheService.getKey<TUsers>(
            LocalCacheService.C_USERS,
            [],
         )
         const findUser = users.find((u) => u.id === payload.user_id)
         if (!findUser) {
            res.status(HttpStatus.UNAUTHORIZED).json({ code: 'e_unauthorized' }).end()
            return
         }
         this.clsService.set<IUser>('currentUser', findUser)
         next()
      } catch {
         res.status(HttpStatus.UNAUTHORIZED).json({ code: 'e_unauthorized' }).end()
         return
      }
   }
}
