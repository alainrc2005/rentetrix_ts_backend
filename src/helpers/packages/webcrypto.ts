/**
 * Originally from https://github.com/QwantResearch/masq-common/
 * with improvements by Andrei Sambra
 */

import { Buffer } from 'buffer';

interface CipherData {
   ciphertext: string;
   iv: string;
}

interface DerivationParams {
   salt: string;
   iterations: number;
   hashAlgo: string;
}

interface ProtectedMasterKey {
   derivationParams: DerivationParams;
   encryptedMasterKey: CipherData;
}

const checkCryptokey = (key: CryptoKey) => {
   if (!key.type || key.type !== 'secret') {
      throw new Error('Invalid key type')
   }
}

const genRandomBuffer = (len = 16) => {
   const values = globalThis.crypto.getRandomValues(new Uint8Array(len))
   return Buffer.from(values)
}

const genRandomBufferAsStr = (len = 16, encodingFormat: BufferEncoding = 'hex') => {
   if (encodingFormat) {
      checkEncodingFormat(encodingFormat)
   }
   const buf = genRandomBuffer(len)
   return buf.toString(encodingFormat)
}

const checkPassphrase = (str: string) => {
   if (typeof str !== 'string' || str === '') {
      throw new Error(`Not a valid value`)
   }
}


const bufferToArrayBuffer = (buffer: Buffer): ArrayBuffer => {
   return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
}

const checkEncodingFormat = (format: BufferEncoding) => {
   if (format !== 'hex' && format !== 'base64') throw new Error('Invalid encoding')
}


// Helper to correctly select return type based on format argument.
type KeyBufferEncoding = BufferEncoding | 'raw';
type SelectKeyType<TFormat extends KeyBufferEncoding> = TFormat extends 'raw' ? Uint8Array : string;


/**
 * Import a raw|jwk as a CryptoKey
 *
 * @param {arrayBuffer|Object} key - The key
 * @param {string} [type] - The type of the key to import ('raw', 'jwk')
 * @param {string} [mode] - The mode of the key to import (default 'AES-GCM')
 * @returns {Promise<arrayBuffer>} - The cryptoKey
 */
const importKey = (key: ArrayBuffer, type: 'pkcs8' | 'spki' | 'raw' = 'raw', mode = 'AES-GCM') => {
   const parsedKey = (type === 'raw') ? Buffer.from(key as unknown as string, 'base64') : key
   return globalThis.crypto.subtle.importKey(type, parsedKey, { name: mode }
      , true, ['encrypt', 'decrypt'])
}

/**
 * Export a CryptoKey into a raw|jwk key
 *
 * @param {CryptoKey} key - The CryptoKey
 * @param {string} [type] - The type of the exported key: raw|jwk
 * @returns {Promise<arrayBuffer>} - The raw key or the key as a jwk format
 */
const exportKey = async (key: CryptoKey, type: 'pkcs8' | 'spki' | 'raw' = 'raw') => {
   const exportedKey = await globalThis.crypto.subtle.exportKey(type, key)
   return (type === 'raw') ? new Uint8Array(exportedKey as ArrayBuffer) : exportedKey as ArrayBuffer
}

/**
 * Encrypt buffer
 *
 * @param {ArrayBuffer} key - The AES CryptoKey
 * @param {ArrayBuffer} data - Data to encrypt
 * @param {Object} cipherContext - The AES cipher parameters
 * @returns {ArrayBuffer} - The encrypted buffer
 */
const encryptBuffer = async <TCipherContext extends Algorithm>(key: CryptoKey, data: Buffer, cipherContext: TCipherContext) => {
   const encrypted = await globalThis.crypto.subtle.encrypt(cipherContext, key, bufferToArrayBuffer(data) as BufferSource)
   return new Uint8Array(encrypted)
}

/**
 * Decrypt buffer
 * @param {ArrayBuffer} key - The AES CryptoKey
 * @param {ArrayBuffer} data - Data to decrypt
 * @param {Object} cipherContext - The AES cipher parameters
 * @returns {Promise<ArrayBuffer>} - The decrypted buffer
 */
const decryptBuffer = async <TCipherContext extends Algorithm>(key: CryptoKey, data: ArrayBuffer, cipherContext: TCipherContext) => {
   // TODO: test input params
   try {
      const decrypted = await globalThis.crypto.subtle.decrypt(cipherContext, key, data)
      return new Uint8Array(decrypted)
   } catch (e) {
      if (e instanceof Error && e.message === 'Unsupported state or unable to authenticate data') {
         throw new Error('Unable to decrypt data')
      } else if (typeof e === 'string') {
         throw new Error(e);
      }
   }
}

/**
 * Encrypt data
 *
 * @param {CryptoKey} key - The AES CryptoKey
 * @param {string | Object} - The data to encrypt
 * @param {string} [format] - The ciphertext and iv encoding format
 * @returns {Object} - The stringified ciphertext object (ciphertext and iv)
 */
const encrypt = async (key: CryptoKey, data: string | object, format: BufferEncoding = 'hex'): Promise<CipherData> => {
   checkCryptokey(key)
   const context = {
      iv: genRandomBuffer(key.algorithm.name === 'AES-GCM' ? 12 : 16),
      plaintext: Buffer.from(JSON.stringify(data))
   }

   // Prepare cipher context, depends on cipher mode
   const cipherContext = {
      name: key.algorithm.name,
      iv: context.iv
   }

   const encrypted = await encryptBuffer(key, context.plaintext, cipherContext)
   return {
      ciphertext: Buffer.from(encrypted).toString(format),
      iv: Buffer.from(context.iv).toString(format)
   }
}

/**
 * Decrypt data
 *
 * @param {CryptoKey} key - The AES CryptoKey
 * @param {string | Object} - The data to decrypt
 * @param {string} [format] - The ciphertext and iv encoding format
 */
const decrypt = async (key: CryptoKey, ciphertext: CipherData, format: BufferEncoding = 'hex') => {
   checkCryptokey(key)

   const context = {
      ciphertext: Buffer.from(Object.prototype.hasOwnProperty.call(ciphertext, 'ciphertext') ? ciphertext.ciphertext : '', (format)),
      // IV is 128 bits long === 16 bytes
      iv: Object.prototype.hasOwnProperty.call(ciphertext, 'iv') ? Buffer.from(ciphertext.iv, (format)) : ''
   }

   // Prepare cipher context, depends on cipher mode
   const cipherContext = {
      name: key.algorithm.name,
      iv: context.iv
   }
   try {
      const decrypted = await decryptBuffer(key, bufferToArrayBuffer(context.ciphertext), cipherContext)
      if (decrypted === undefined) {
         throw new Error();
      }
      return JSON.parse(Buffer.from(decrypted).toString())
   } catch (error) {
      throw new Error('Unable to decrypt data')
   }
}


export {
   importKey,
   exportKey,
   encrypt,
   decrypt,
   encryptBuffer,
   decryptBuffer,
   bufferToArrayBuffer
}
export type { CipherData, DerivationParams, ProtectedMasterKey }
