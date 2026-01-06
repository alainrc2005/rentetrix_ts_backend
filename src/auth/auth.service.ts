import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import * as assert from 'node:assert'
import moment from 'moment'
import { AuthDto } from './dto/auth.dto'
import { DefaultResult, TResults, RentetrixCrypto, getErrorMessage, ksec } from '@/helpers'
import { UsersService } from '@/admin/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { User, PersonalAccessToken } from '@/entities'
import { ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'
import type { StringValue } from 'ms'
import { TResult } from '@/types'

@Injectable()
export class AuthService {
   private readonly logger = new Logger(AuthService.name)
   constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      private readonly dataSource: DataSource
   ) {}

   async login(auth: AuthDto): Promise<TResult> {
      const result: TResult = DefaultResult()
      try {
         const user = await this.usersService.findByEmail(auth.email)
         assert.ok(user !== null, TResults.E_BAD_USER_PASSWORD)
         assert.ok(user.active, TResults.E_USER_BANNED)
         const isMatch = bcrypt.compareSync(auth.password, user.password)
         assert.ok(isMatch, TResults.E_BAD_USER_PASSWORD)
         const token = await this.createToken(user)
         const row = {
            userid: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles.map((r) => r.name),
            permissions: [...new Set(user.roles.flatMap((r) => r.permissions.map((p) => p.name)))],
            token
         }
         result.row = await RentetrixCrypto.cryptoAesEncrypt(ksec, row)
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async createToken(user: User): Promise<string> {
      type TPayload = {
         user_id: number
         user_email: string
      }
      const payload: TPayload = {
         user_id: user.id,
         user_email: user.email
      }
      const token = await this.jwtService.signAsync<TPayload>(payload, {
         secret: this.configService.get<string>('jwt.secret')!,
         expiresIn: this.configService.get<StringValue>('jwt.expiresIn')!
      })
      await this.dataSource.transaction(async (tem) => {
         await tem.delete(PersonalAccessToken, { user_id: user.id })
         const pat = tem.create(PersonalAccessToken, {
            user_id: user.id,
            token,
            last_used_at: new Date(),
            expired_at: moment().add(4, 'day').toDate()
         })
         return tem.save(pat)
      })
      return token
   }

   async verifyToken(token: string): Promise<any> {
      const pat = await PersonalAccessToken.findOne({ where: { token } })
      if (!pat) {
         throw new UnauthorizedException('Token not found')
      }
      return this.jwtService.verifyAsync(token, {
         secret: this.configService.get<string>('jwt.secret')
      })
   }

   async destroyTokens(user_id: number) {
      await PersonalAccessToken.delete({ user_id })
   }

   async logout(user_id: number): Promise<TResult> {
      const result = DefaultResult()
      try {
         await this.destroyTokens(user_id)
      } catch (e) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }
}
