import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { SysLanguage } from '@/entities'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from '@/commons/shared/shared.module'

@Module({
  controllers: [LanguageController],
  providers: [LanguageService],
  imports: [TypeOrmModule.forFeature([SysLanguage]), SharedModule]
})
export class LanguageModule {}
