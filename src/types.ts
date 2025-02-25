/**
 * Prisma types --
 *
 * We're copying just what we need for local type safety
 * without importing Prisma-generated types, as the location
 * of the generated client can be unknown (when using custom
 * or multiple client locations).
 */

// Prisma types --
import { z } from 'zod'

/**
 * Not ideal to use `any` on model & action, but Prisma's
 * strong typing there actually prevents using the correct
 * type without excessive generics wizardry.
 */
 export type MiddlewareParams<Models extends string, Actions extends string> = {
  model?: Models
  action: Actions
  args: any
  dataPath: string[]
  runInTransaction: boolean
}

export type Middleware<
  Models extends string,
  Actions extends string,
  Result = any
> = (
  params: MiddlewareParams<Models, Actions>,
  next: (params: MiddlewareParams<Models, Actions>) => Promise<Result>
) => Promise<Result>

const dmmfFieldParser = z.object({
  name: z.string(),
  isList: z.boolean(),
  isUnique: z.boolean(),
  isId: z.boolean(),
  type: z.any(),
  documentation: z.string().optional()
})

const dmmfModelParser = z.object({
  name: z.string(),
  fields: z.array(dmmfFieldParser)
})

export const dmmfDocumentParser = z.object({
  datamodel: z.object({
    models: z.array(dmmfModelParser)
  })
})

export type DMMFModel = z.TypeOf<typeof dmmfModelParser>
export type DMMFField = z.TypeOf<typeof dmmfFieldParser>
export type DMMFDocument = z.TypeOf<typeof dmmfDocumentParser>

// Internal types --

export type EncryptionFn = (clearText: any) => string
export type DecryptionFn = (cipherText: string) => any

export type CipherFunctions = {
  encryptFn: EncryptionFn
  decryptFn: DecryptionFn
  dmmf?: DMMFDocument
  encryptionKey?: never
  decryptionKeys?: never
}

export type Keys = {
  encryptionKey?: string
  decryptionKeys?: string[]
  dmmf?: DMMFDocument
  encryptFn?: never
  decryptFn?: never
}

export type Configuration = CipherFunctions | Keys | {
  encryptionKey?: string
  decryptionKeys?: string[]
  dmmf?: DMMFDocument
  encryptFn: EncryptionFn
  decryptFn: DecryptionFn
}

export interface FieldConfiguration {
  encrypt: boolean
  strictDecryption: boolean
}

export interface FieldMatcher {
  regexp: RegExp
  fieldConfig: FieldConfiguration
}
