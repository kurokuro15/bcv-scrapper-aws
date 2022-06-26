// 'ts-check'
/**
 * @typedef {Object} Currency
 * @property {string} currency
 * @property {number} exchange
 */
/**
 * @typedef {Object} CurrencyIdentification
 * @property {string} dolar
 * @property {string} euro
 * @property {string} lira
 * @property {string} rublo
 * @property {string} yuan
 */
/**
 * @typedef {import '@supabase/supabase-js'.SupabaseClient} SupabaseClient
 */
/**
 * @typedef {Object} insertData
 * @property {SupabaseClient} db
 * @property {Currency | Currency[]} data
 */
const playwright = require('playwright-aws-lambda')
// const sdk = require('aws-sdk')
const identifications = require('./currencies.json')

// Create a single supabase client for interacting with your database as service_role

/**
  * función asíncrona para insertar los datos en la base de datos
  * @param {insertData} object
  * @returns {Promise<PostgrestResponse>} for testing
  */
const insert = async ({ db, data }) => {
  return await db
    .from('currency_bolivar')
    .insert(data)
    .then(res => {
      console.log('Currencies inserted', JSON.stringify({ data: res.data }, null, 2))
      return res
    })
}

/**
  * Obtenemos los datos de la página web del banco central de venezuela
  * @param {string} url dirección del banco central de venezuela
  * @returns {Promise<Currency[]>}
  */
const scraper = async (url) => {
  const browser = await playwright.launchChromium()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(url)
  let dolar = await page.$('div#dolar strong')
  dolar = await dolar.textContent()
  let euro = await page.$('div#euro strong')
  euro = await euro.textContent()
  let rublo = await page.$('div#rublo strong')
  rublo = await rublo.textContent()
  let lira = await page.$('div#lira strong')
  lira = await lira.textContent()
  let yuan = await page.$('div#yuan strong')
  yuan = await yuan.textContent()
  await browser.close()

  return {
    dolar,
    euro,
    lira,
    rublo,
    yuan
  }
}

/**
  * Función asíncrona para mapear la información obtenida del banco central de venezuela
  * @param {string[]} currencies
  * @returns {Currency[]}
  */
const mapper = currencies => {
  // currency, exchange
  const data = []
  for (const currency in currencies) {
    if (Object.hasOwnProperty.call(currencies, currency)) {
      const exchange = Number(currencies[currency].trim().replace(',', '.'))
      data.push({ currency: identifications[currency], exchange })
    }
  }
  return data
}

module.exports = {
  insert,
  scraper,
  mapper
}
