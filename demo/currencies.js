// { 'USD': '$',  'BTC': '฿', ...}
const currencySymbols = require('currency-symbol-map').currencySymbolMap

const confusingCurrencySymbols = [
  '$', 'K', 'L', 'kr', '£', 'лв', '₨', '₱', '﷼', '฿',
]

//
function isCurrencySymbolConfusing(c) {
  return (
    confusingCurrencySymbols.includes(c)
      || !Number.isNaN(parseFloat(c)) // skip numeric currency symbols (like 365 for 365Coin)
  )
}

// currency symbol/name/ISO => ISO
// { '$': 'USD', '฿': 'BTC', 'rouble': 'RUB', 'buck': 'USD'...}
const symbolCurrencies = Object.assign({}, ...Object.entries(currencySymbols).map(
  ([iso, symbol]) => (isCurrencySymbolConfusing(symbol) ? null : {[symbol]: iso})
))


// but some confusingCurrencySymbols does has meaning
symbolCurrencies['$'] = 'USD' /* eslint dot-notation: off */
symbolCurrencies['£'] = 'GBP'
symbolCurrencies['₿'] = 'BTC'     // real but not yet wide supported bitcoin char
symbolCurrencies['฿'] = 'BTC' // use as "bitcoin" rather than "Thai baht"


// let z = Object.entries(currencySymbols).map(
//   ([iso, symbol]) => {
//     console.log(iso, symbol);
//     return (confusingCurrencySymbols.includes(symbol) ? null : {[symbol]: iso})
//   })
// console.log(z)

// {BTC: 'Bitcoin', ...}
const cryptoCurrencies = require('cryptocurrencies')

delete cryptoCurrencies.symbols


// from https://docs.openexchangerates.org/docs/supported-currencies
const openexchangeratesCurrencies = {
  AED: {name: 'United Arab Emirates Dirham', },
  AFN: {name: 'Afghan Afghani', },
  ALL: {name: 'Albanian Lek', },
  AMD: {name: 'Armenian Dram', },
  ANG: {name: 'Netherlands Antillean Guilder', },
  AOA: {name: 'Angolan Kwanza', },
  ARS: {name: 'Argentine Peso', },
  AUD: {name: 'Australian Dollar', },
  AWG: {name: 'Aruban Florin', },
  AZN: {name: 'Azerbaijani Manat', },
  BAM: {name: 'Bosnia-Herzegovina Convertible Mark', },
  BBD: {name: 'Barbadian Dollar', },
  BDT: {name: 'Bangladeshi Taka', },
  BGN: {name: 'Bulgarian Lev', },
  BHD: {name: 'Bahraini Dinar', },
  BIF: {name: 'Burundian Franc', },
  BMD: {name: 'Bermudan Dollar', },
  BND: {name: 'Brunei Dollar', },
  BOB: {name: 'Bolivian Boliviano', },
  BRL: {name: 'Brazilian Real', },
  BSD: {name: 'Bahamian Dollar', },
  BTC: {name: 'Bitcoin', },
  BTN: {name: 'Bhutanese Ngultrum', },
  BWP: {name: 'Botswanan Pula', },
  BYN: {name: 'Belarusian Ruble', },
  BYR: {name: 'Belarusian Ruble (pre-2016)', },
  BZD: {name: 'Belize Dollar', },
  CAD: {name: 'Canadian Dollar', },
  CDF: {name: 'Congolese Franc', },
  CHF: {name: 'Swiss Franc', },
  CLF: {name: 'Chilean Unit of Account (UF)', },
  CLP: {name: 'Chilean Peso', },
  CNH: {name: 'Chinese Yuan (Offshore)', },
  CNY: {name: 'Chinese Yuan', },
  COP: {name: 'Colombian Peso', },
  CRC: {name: 'Costa Rican Colón', },
  CUC: {name: 'Cuban Convertible Peso', },
  CUP: {name: 'Cuban Peso', },
  CVE: {name: 'Cape Verdean Escudo', },
  CZK: {name: 'Czech Republic Koruna', },
  DJF: {name: 'Djiboutian Franc', },
  DKK: {name: 'Danish Krone', },
  DOP: {name: 'Dominican Peso', },
  DZD: {name: 'Algerian Dinar', },
  EEK: {name: 'Estonian Kroon', },
  EGP: {name: 'Egyptian Pound', },
  ERN: {name: 'Eritrean Nakfa', },
  ETB: {name: 'Ethiopian Birr', },
  EUR: {name: 'Euro', },
  FJD: {name: 'Fijian Dollar', },
  FKP: {name: 'Falkland Islands Pound', },
  GBP: {name: 'British Pound Sterling', },
  GEL: {name: 'Georgian Lari', },
  GGP: {name: 'Guernsey Pound', },
  GHS: {name: 'Ghanaian Cedi', },
  GIP: {name: 'Gibraltar Pound', },
  GMD: {name: 'Gambian Dalasi', },
  GNF: {name: 'Guinean Franc', },
  GTQ: {name: 'Guatemalan Quetzal', },
  GYD: {name: 'Guyanaese Dollar', },
  HKD: {name: 'Hong Kong Dollar', },
  HNL: {name: 'Honduran Lempira', },
  HRK: {name: 'Croatian Kuna', },
  HTG: {name: 'Haitian Gourde', },
  HUF: {name: 'Hungarian Forint', },
  IDR: {name: 'Indonesian Rupiah', },
  ILS: {name: 'Israeli New Sheqel', },
  IMP: {name: 'Manx pound', },
  INR: {name: 'Indian Rupee', },
  IQD: {name: 'Iraqi Dinar', },
  IRR: {name: 'Iranian Rial', },
  ISK: {name: 'Icelandic Króna', },
  JEP: {name: 'Jersey Pound', },
  JMD: {name: 'Jamaican Dollar', },
  JOD: {name: 'Jordanian Dinar', },
  JPY: {name: 'Japanese Yen', },
  KES: {name: 'Kenyan Shilling', },
  KGS: {name: 'Kyrgystani Som', },
  KHR: {name: 'Cambodian Riel', },
  KMF: {name: 'Comorian Franc', },
  KPW: {name: 'North Korean Won', },
  KRW: {name: 'South Korean Won', },
  KWD: {name: 'Kuwaiti Dinar', },
  KYD: {name: 'Cayman Islands Dollar', },
  KZT: {name: 'Kazakhstani Tenge', },
  LAK: {name: 'Laotian Kip', },
  LBP: {name: 'Lebanese Pound', },
  LKR: {name: 'Sri Lankan Rupee', },
  LRD: {name: 'Liberian Dollar', },
  LSL: {name: 'Lesotho Loti', },
  LYD: {name: 'Libyan Dinar', },
  MAD: {name: 'Moroccan Dirham', },
  MDL: {name: 'Moldovan Leu', },
  MGA: {name: 'Malagasy Ariary', },
  MKD: {name: 'Macedonian Denar', },
  MMK: {name: 'Myanma Kyat', },
  MNT: {name: 'Mongolian Tugrik', },
  MOP: {name: 'Macanese Pataca', },
  MRO: {name: 'Mauritanian Ouguiya', },
  MTL: {name: 'Maltese Lira', },
  MUR: {name: 'Mauritian Rupee', },
  MVR: {name: 'Maldivian Rufiyaa', },
  MWK: {name: 'Malawian Kwacha', },
  MXN: {name: 'Mexican Peso', },
  MYR: {name: 'Malaysian Ringgit', },
  MZN: {name: 'Mozambican Metical', },
  NAD: {name: 'Namibian Dollar', },
  NGN: {name: 'Nigerian Naira', },
  NIO: {name: 'Nicaraguan Córdoba', },
  NOK: {name: 'Norwegian Krone', },
  NPR: {name: 'Nepalese Rupee', },
  NZD: {name: 'New Zealand Dollar', },
  OMR: {name: 'Omani Rial', },
  PAB: {name: 'Panamanian Balboa', },
  PEN: {name: 'Peruvian Nuevo Sol', },
  PGK: {name: 'Papua New Guinean Kina', },
  PHP: {name: 'Philippine Peso', },
  PKR: {name: 'Pakistani Rupee', },
  PLN: {name: 'Polish Zloty', },
  PYG: {name: 'Paraguayan Guarani', },
  QAR: {name: 'Qatari Rial', },
  RON: {name: 'Romanian Leu', },
  RSD: {name: 'Serbian Dinar', },
  RUB: {name: 'Russian Ruble', },
  RWF: {name: 'Rwandan Franc', },
  SAR: {name: 'Saudi Riyal', },
  SBD: {name: 'Solomon Islands Dollar', },
  SCR: {name: 'Seychellois Rupee', },
  SDG: {name: 'Sudanese Pound', },
  SEK: {name: 'Swedish Krona', },
  SGD: {name: 'Singapore Dollar', },
  SHP: {name: 'Saint Helena Pound', },
  SLL: {name: 'Sierra Leonean Leone', },
  SOS: {name: 'Somali Shilling', },
  SRD: {name: 'Surinamese Dollar', },
  SSP: {name: 'South Sudanese Pound', },
  STD: {name: 'São Tomé and Príncipe Dobra', },
  SVC: {name: 'Salvadoran Colón', },
  SYP: {name: 'Syrian Pound', },
  SZL: {name: 'Swazi Lilangeni', },
  THB: {name: 'Thai Baht', },
  TJS: {name: 'Tajikistani Somoni', },
  TMT: {name: 'Turkmenistani Manat', },
  TND: {name: 'Tunisian Dinar', },
  TOP: {name: 'Tongan Paʻanga', },
  TRY: {name: 'Turkish Lira', },
  TTD: {name: 'Trinidad and Tobago Dollar', },
  TWD: {name: 'New Taiwan Dollar', },
  TZS: {name: 'Tanzanian Shilling', },
  UAH: {name: 'Ukrainian Hryvnia', },
  UGX: {name: 'Ugandan Shilling', },
  USD: {name: 'United States Dollar', },
  UYU: {name: 'Uruguayan Peso', },
  UZS: {name: 'Uzbekistan Som', },
  VEF: {name: 'Venezuelan Bolívar Fuerte', },
  VND: {name: 'Vietnamese Dong', },
  VUV: {name: 'Vanuatu Vatu', },
  WST: {name: 'Samoan Tala', },
  XAF: {name: 'CFA Franc BEAC', },
  XAG: {name: 'Silver (troy ounce)', },
  XAU: {name: 'Gold (troy ounce)', },
  XCD: {name: 'East Caribbean Dollar', },
  XDR: {name: 'Special Drawing Rights', },
  XOF: {name: 'CFA Franc BCEAO', },
  XPD: {name: 'Palladium Ounce', },
  XPF: {name: 'CFP Franc', },
  XPT: {name: 'Platinum Ounce', },
  YER: {name: 'Yemeni Rial', },
  ZAR: {name: 'South African Rand', },
  ZMK: {name: 'Zambian Kwacha (pre-2013)', },
  ZMW: {name: 'Zambian Kwacha', },
}


// ALL currency codes
const currencyCodes = [...new Set([
  ...Object.keys(openexchangeratesCurrencies),
  ...Object.keys(cryptoCurrencies)
]).values()]


// add currency codes as self-aliases {'USD': 'USD' ... }
currencyCodes.forEach( c => symbolCurrencies[c] = c )



// {  USD: { name: 'United States Dollar', aliases: [ '$', 'dollar', 'dollars' ],
//           isCrypto: false },
//    ...
//    BTC: { name: 'Bitcoin', aliases: [ 'Bitcoin', '฿' ], isCrypto: true },
//    ...
// }
//

// const Currencies = {}
// 
// currencyCodes.forEach( c => {
//   Currencies[c] = {...openexchangeratesCurrencies[c]}
// 
//   const s = currencySymbols[c]
//   Currencies[c].aliases = [
//     cryptoCurrencies[c],
//     !confusingCurrencySymbols.includes(s) && s
//   ].filter(Boolean)
// 
//   Currencies[c].isCrypto = cryptoCurrencies.hasOwnProperty(c)
// })
// 
// // traditional names
// Currencies['USD'].aliases = ['$', 'dollar', 'dollars']
// Currencies['RUB'].aliases = ['$', 'ruble', 'rubles', 'rouble', 'roubles']
// Currencies['GBP'].aliases = ['$', 'pound', 'pounds']


function addCurrencyAliases(code, aliases) {
  aliases.forEach( v => symbolCurrencies[v] = code )
}


// add some traditional names
addCurrencyAliases('USD', ['$', 'dollar', 'dollars', 'buck', 'bucks'])
addCurrencyAliases('RUB', ['₽', 'ruble', 'rubles', 'rouble', 'roubles'])
addCurrencyAliases('UAH', ['₴', 'гривна', 'гривны', 'гривен'])
addCurrencyAliases('GBP', ['£', 'pound', 'pounds'])


//console.log(symbolCurrencies)

module.exports = { /* Currencies, */ symbolCurrencies }
