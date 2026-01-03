import * as WebCrypto from './packages/webcrypto'
import { Buffer } from 'node:buffer'

export class RentetrixCrypto {

   public static async cryptoAesEncrypt(key: string, value: any): Promise<string> {
      const keyImport = await WebCrypto.importKey(WebCrypto.bufferToArrayBuffer(Buffer.from(key, 'hex')))
      const encrypted = await WebCrypto.encrypt(keyImport, value)
      return encrypted.iv + ':' + encrypted.ciphertext
   }

   public static async cryptoAesDecrypt(key: string, value: string): Promise<any> {
      const keyImport = await WebCrypto.importKey(WebCrypto.bufferToArrayBuffer(Buffer.from(key, 'hex')))
      const [ iv, ciphertext ] = value.split(':')
      const cipherData: WebCrypto.CipherData = { iv, ciphertext }
      return WebCrypto.decrypt(keyImport, cipherData)
   }
}
