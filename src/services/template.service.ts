import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { join } from 'node:path'
import * as nunjucks from 'nunjucks'
import { ObjectLiteral } from 'typeorm'
import * as fs from 'node:fs'

@Injectable()
export class RentetrixTemplateService implements OnModuleInit {
   private readonly logger = new Logger(RentetrixTemplateService.name)

   constructor(private readonly configService: ConfigService) {
   }

   onModuleInit() {
      const path = join(process.cwd(), './resources')
      this.logger.log(`RentetrixTemplateService loaded: ${path}`)
      nunjucks.configure(path)
         .addGlobal('APP_URL', this.configService.get<string>('app.url'))
         .addGlobal('APP_NAME', this.configService.get<string>('app.name'))
   }

   public renderToString(njkFilePath: string, context: ObjectLiteral): string {
      return nunjucks.render(njkFilePath, context)
   }

   public renderToFile(njkFilePath: string, htmlFilePath: string, context: ObjectLiteral): void {
      const html = this.renderToString(htmlFilePath, context)
      if (!fs.existsSync(htmlFilePath)) {
         fs.mkdirSync(htmlFilePath, { recursive: true })
      }
      fs.writeFileSync(htmlFilePath, html, 'utf8')
   }
}
