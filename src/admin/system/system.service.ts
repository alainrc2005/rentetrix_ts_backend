import { Injectable, Logger } from '@nestjs/common'
import { TResult } from '@/types'
import * as si from 'systeminformation'
import { getErrorMessage, DefaultResult } from '@/helpers'

@Injectable()
export class SystemService {
   private readonly logger = new Logger(SystemService.name)

   async getSystemInfo(): Promise<TResult> {
      const result = DefaultResult()
      try {
         const cpu = await si.currentLoad()
         const mem = await si.mem()
         const disk = await si.fsSize()
         const findRoot = disk.find(d => d.mount === '/')
         result.stats = {
            cpu: cpu.currentLoad,
            mem: (mem.used / mem.total) * 100,
            swap: (mem.swapused / mem.swaptotal) * 100,
            disk: findRoot ? (findRoot.used / findRoot.size) * 100 : 0
         }
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }
}
