const AWSXRay = require('aws-xray-sdk-core')
AWSXRay.setContextMissingStrategy(() => {})
const { createClient } = require('@supabase/supabase-js')
const { scraper, insert, mapper } = require('./declarations.js')
const { url, dbUrl, key } = require('./config.js')
// inicializamos el cliente de supabase.
const supabase = createClient(dbUrl, key)

// ejecutamos el scraper dentro de la función asíncrona de AWS Lambda
exports.handler = async () => {
  const data = await scraper(url)
  const mappedData = mapper(data)
  const insertedData = await insert({ db: supabase, data: mappedData })
  return insertedData
}

AWSXRay.captureAsyncFuncion(exports.handler)
