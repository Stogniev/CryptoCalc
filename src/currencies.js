// { 'USD': '$',  'BTC': '฿', ...}
const currencySymbols = require('currency-symbol-map').currencySymbolMap

const confusingCurrencySymbols = [
  '$', 'K', 'L', 'kr', '£', 'лв', '₨', '₱', '﷼', '฿', 'MOD', 'D', 'G', 'M', 'T', 'R', 'AND', 'KM', 'TIME', 'MM', 'GRAM', 'Ft', 'E', 'S'
]

//
function isCurrencySymbolConfusing(c) {
  return (
    confusingCurrencySymbols.includes(c)
      // assume any numeric currency symbols is confusing (like 365 for 365Coin)
      || !Number.isNaN(parseFloat(c))
  )
}

// currency symbol/name/ISO => ISO
// { '$': 'USD', 'USD': 'USD', '฿': 'BTC', 'rouble': 'RUB', 'buck': 'USD'...}
// const symbolToCode = Object.assign({}, ...Object.entries(currencySymbols).map(
//   ([iso, symbol]) => (isCurrencySymbolConfusing(symbol) ? null : {[symbol]: iso})
// ))
const symbolToCode = {}

// {USD: ['$', 'USD', 'buck',...], ...}
const codeToSymbols = {}

function addCurrencyAlias(iso, alias, force=false) {
  if (force || !isCurrencySymbolConfusing(alias)) {
    symbolToCode[alias] = iso

    codeToSymbols[iso] = codeToSymbols[iso] || []
    codeToSymbols[iso].push(alias)
  }
}

function addCurrencyAliases(iso, aliases, force=false) {
  aliases.forEach( a => addCurrencyAlias(iso, a, force) )
}


// add add currency symbols as aliases
Object.entries(currencySymbols).forEach(
  ([iso, symbol]) => addCurrencyAlias(iso, symbol) )


//const cryptoCurrencyRatesData = require('./cryptoCurrencyRatesData')
//const cryptoCurrenciesList = cryptoCurrencyRatesData.map( data => data.symbol )

// from http://coincap.io/coins/
const cryptoCurrenciesList = ['300', '611', '808', '888', 'EOS', 'QSP', 'MONA', 'PLBT', 'SRC', 'POT', 'VIA', 'OCL', 'ICN', 'XLM', 'LBC', 'HPB', 'BTM2', 'APX', 'LSK', 'LOG', 'AIR', 'YTN', 'XNN', 'NOBL', 'POP', 'PHO', 'XLR', 'XPM', 'TRDT', 'PBL', 'MNX', 'ICE', 'REC', 'XAUR', 'BUMBA', 'SOJ', 'REX', 'XRE', 'MUSIC', 'MILO', 'CL', 'WISH', 'EMD', 'HORSE', 'MAX', 'DUO', 'EVIL', 'UNIT', 'POLIS', 'SAFEX', 'SPK', 'ZCL', 'EVE', 'ADX', 'LBTC', 'LNK', 'VIU', 'HUC', 'ERC20', 'PURE', 'CARBON', 'TAG', 'DOT', 'GXS', 'POST', 'TRIG', 'GLD', 'ATS', 'UTC', 'VLT', 'NBT', 'IND', 'HKN', 'EL', 'GLT', 'FNC', 'ECN', 'ZENI', 'AIB', 'KRM', 'AU', 'XBTS', 'TNT', 'EVC', 'BCY', 'ETBS', 'PLR', 'DTB', 'CV', 'FST', 'CRM', 'PPP', 'GAIA', 'GRIM', 'CHESS', 'OBITS', 'CON', 'CAT', 'RLC', 'CVC', 'CDT', 'KMD', 'PIX', 'GTC', 'SKC', 'ELTCOIN', 'STA', 'GRLC', 'BET', 'BLN', 'DOVU', 'MDA', 'BUZZ', 'ARN', 'UNI', 'XJO', 'ATL', 'SOC', 'PROC', 'GAT', 'ZEPH', 'ELLA', 'SBD', 'BENJI', 'LKK', 'INXT', 'ICN2', 'SPRTS', 'POSW', 'XST', 'ERO', 'IMS', 'ANC', 'BTCZ', 'TGT', 'COLX', 'MAO', 'HONEY', 'SEND', 'ANT', 'TRC', 'GAP', 'SNGLS', 'SCORE', 'AMM', 'UFO', 'HUSH', 'FLIXX', 'BLT', 'METAL', 'FYP', 'PAY', 'DSH', 'DASH', 'CCN', 'MYB', 'MKR', 'HOLD', 'BTG2', 'LIFE', 'STX', 'UNIC', 'ITT', 'TYCHO', 'GVT', 'MAY', 'ENT', 'LINK', 'XZC', 'RC', 'STEEM', 'CMT', 'COVAL', 'HTML', 'KURT', 'RHOC', 'XMCC', 'START', 'SNM', 'DYN', 'INSN', 'AE', 'EDO', 'BIX', 'MST', 'INFX', 'RPX', 'AMB', 'LCT', 'LINDA', 'HAT', 'YYW', 'RMT', 'HERO', 'STR', 'PING', 'LOCI', 'ECC', 'BTDX', 'CCO', 'HDG', 'FUN', 'XRL', 'DBIX', 'BITEUR', 'BPL', 'GB', 'VEN', 'XSPEC', 'DIBC', 'RAIN', 'R', 'NXS', 'ELF', 'PRO', 'IXT', 'OK', 'NRO', 'XPY', 'ITNS', 'BTA', 'GUN', 'XMR', 'OMNI', 'BCO', 'PHS', 'ZRX', 'MAGE', 'BITUSD', 'NEBL', 'XPA', 'EDR', 'AEON', 'QRK', 'VOX', 'XVG', 'STRC', 'BIGUP', 'BLUE', 'HTC', 'MGO', 'XGR', 'DRP', 'ECA', 'FOR', 'SLR', 'EVR', 'ATMS', 'DAR', 'CTX', 'COV', 'UBQ', 'SOON', 'SLEVIN', 'FAIR', 'UQC', 'ZET', 'XIOS', 'CXT', 'ALIS', 'HSR', 'BLAS', 'CAG', 'RMC', 'BCN', 'RBY', 'SRN', 'CXO', 'ICON', 'LMC', 'XVC', 'UNITS', 'FTC', 'BRO', 'SUR', 'BMC', 'SUPER', 'XEM', 'KEY', 'VIBE', 'EMC2', 'MONK', 'XRA', 'PIRL', 'UNITY', 'GNT', 'NLG', 'QCN', 'ZRC', 'SPF', 'FUCK', 'PKB', 'EVO', 'QASH', 'FLDC', 'PXI', 'DGPT', 'TKN', 'SOAR', 'AGRS', 'AGI', 'NETKO', 'STV', 'HNC', 'CPC', 'MANNA', 'FLASH', 'HWC', 'TRF', 'LEND', 'PXC', 'STORJ', 'INS', 'PURA', 'OXY', 'CAPP', 'KLN', 'PIPL', 'AUR', 'VSX', 'WTC', 'BCPT', 'NDC', 'SCL', 'NOTE', 'BASH', 'RBIES', 'SPACE', 'DAT', 'COSS', 'VIDZ', 'HODL', 'ECOB', 'USDT', 'TIPS', '8BIT', 'JC', 'ALQO', 'LRC', 'BTC', 'ENJ', 'YOC', 'BQ', 'GCR', 'VTR', 'VRC', 'ING', 'PDC', 'ACE', 'ESP', 'YOYOW', 'DIME', 'TAJ', 'SPT', 'ITI', 'DFT', 'BNB', 'ETG', 'RADS', 'AMS', 'ATM', 'PARETO', 'MAG', 'BTCR', 'XPD', 'LTC', 'DBC', 'XPTX', 'I0C', 'RIC', 'RUPX', 'SKIN', 'BRK', 'TRUST', 'SYS', 'VOT', 'INPAY', 'EBET', 'VRM', 'TTC', 'ATB', 'GTO', 'MEE', 'NYC', 'LINX', 'XRP', 'MEC', 'REE', 'SUB', 'XCN', 'C20', 'PTOY', 'AION', 'BLC', 'TGC', 'CHAN', 'APPC', 'DCN', 'TRI', 'PR', 'SPANK', 'ZPT', 'PZM', 'STARS', 'BSTAR', 'SPHTX', 'TX', 'WAVES', 'FLT', 'RCN', 'GBX', 'SIGT', 'BRIT', 'FUEL', 'ACC', 'ADCN', 'POS', 'LTCU', 'STN', 'UNIFY', 'QUN', 'GAME', 'HYP', 'BAY', 'MNM', 'UIS', 'ZEC', 'CLOAK', 'TEL', 'MSP', 'EXN', 'NLC2', 'KRONE', 'RLT', 'REQ', 'GRE', 'MEME', 'MARS', 'SPHR', 'ALTCOM', 'NXC', 'BNT', 'CRED', 'SLG', 'ERC', 'CAT2', 'XHI', 'TRST', 'NKA', 'SXC', 'BNTY', 'GCC', 'ETP', 'MOTO', 'CCRB', 'SPR', 'ALT', 'MTL', 'QBIC', 'CNNC', 'BOAT', 'DAY', 'SHDW', 'BTX2', 'CJ', 'ACOIN', 'EVX', 'OTN', 'EUC', 'CRC', 'FIRE', 'CPAY', 'ODN', 'SNOV', 'ETC', 'OPC', 'CREDO', 'TOKC', 'ADL', 'DGC', 'MINT', 'ABY', 'HOT', 'LEA', 'PKT', 'QSH', 'ICOO', 'DOGE', 'XP', 'RBT', 'MDC', 'CDN', 'BLK', 'DRGN', 'QWARK', 'TNB', 'DEW', 'DFS', 'FLO', 'PINK', 'XWC', 'ACT', 'DENT', 'PCOIN', 'PRL', 'BTG', 'INT', 'DTR', 'ORME', 'SC', 'STRAT', 'VOISE', 'AIT', 'GET', 'GRWI', 'ZCG', 'PIGGY', 'QBT', 'ARCO', 'CHC', 'KBR', 'BLITZ', 'SOIL', 'XCRE', 'SLT', 'SIB', 'ZZC', 'KAYI', 'NEOS', 'CACH', 'POE', 'MNA', 'PRG', 'QTM', 'CFI', 'COB', 'EUR', 'QLC', 'BON', 'UFR', 'EBST', 'DDF', 'ION', 'ASAFE2', 'NMR', 'IDH', 'DNA', 'CDX', 'USNBT', 'BWK', 'JNT', 'ZLA', 'RDD', 'EMV', 'MANA', 'PHR', 'SWT', 'XCT', 'CAD', 'CAN', 'LEV', 'PND', 'MOJO', 'BIP', 'FCT', 'NMC', 'EAGLE', 'IMX', 'DP', 'CLAM', 'XMG', 'LCP', 'GUP', 'FLAX', 'KLC', 'IPL', 'TRAC', 'CCT', 'SXUT', 'SAGA', 'DAI', 'IFT', 'LDOGE', 'NEC', 'VERI', 'DPY', 'POLL', 'EQT', 'HEAT', 'XCXT', 'VIB', 'XBC', 'BBT', 'DIX', 'BTPL', 'TRX', 'EMC', 'PASL', 'WHL', 'UNY', 'WDC', 'RDN', 'GBYTE', 'CTO', 'ENG', 'SAN', 'BTO', 'ARI', 'FRC', 'BIS', 'BCF', 'ERY', 'CASH', 'VTC', 'BUCKS', 'RNS', 'AIX', 'B2B', 'COAL', 'RUP', 'TSE', 'ONION', 'TKR', 'MSCN', 'WILD', 'HMP', 'HXX', 'ADT', 'ADZ', 'EFYT', 'C2', 'KUSH', 'GAS', 'MAR', 'BTWTY', 'MTNC', 'MER', 'XTO', 'DRT', 'MAC', 'BLOCK', 'XUC', 'BTB', 'INK', 'TEK', 'UET', 'TRK', 'PRA', 'ZMC', 'DSR', 'ZIL', 'MYST', 'AURA', 'DIVX', 'SEQ', 'BAS', 'BURST', 'NYAN', 'PAC', 'SGR', 'CMPCO', 'NAS', 'BTCS', 'TES', 'XCPO', 'CND', 'STAK', 'TSL', 'OCT', 'FYN', 'BYC', 'HGT', 'ICOB', 'ECO', 'HAC', 'XDG', 'PFR', 'ADA', 'NEO', 'GAM', 'ROOFS', 'PPC', 'ICX', 'PTC', 'TOA', 'MDS', 'MCAP', 'TRUMP', 'POWR', 'DCY', 'DEM', 'QAU', 'EOT', 'DCT', 'DAXX', 'EFL', 'GPL', 'SYNX', 'BXT', 'OCN', 'GRS', 'DATA', 'RIYA', 'BITCNY', 'EBTC', 'OMG', 'LA', 'NAV', 'HST', 'BSTY', 'SONG', 'DMD', 'CURE', 'DGB', 'PBT', 'SCT', 'CFT', 'BITGOLD', 'ZEIT', 'Q2C', 'KOBO', 'UKG', 'TAU', 'WGO', 'DALC', 'ETH', 'GRC', 'PEPECASH', 'MOD', 'RPC', 'JET', 'VPRC', 'PAK', 'GBP', 'ETHOS', 'CTR', 'BBP', 'PPY', 'MXT', 'ARDR', 'XBL', 'SWFTC', 'ZUR', 'LEAF', 'ART', 'PRE', 'PRIX', 'HMQ', 'UNB', 'XBY', 'TIX', 'BLU', 'KEK', 'MCO', 'KICK', 'CNX', 'EXCL', 'QTL', 'NGC', 'GCN', 'XMY', 'CVCOIN', 'HBN', 'BITB', 'V', 'MAID', 'CHIPS', 'BPC', 'ZOI', 'XRB', 'IOST', 'VSL', 'STORM', 'RNT', 'DCR', 'SALT', 'EDG', 'BTCD', 'BPT', 'LOC', 'VIVO', 'VUC', 'WABI', 'MRJA', 'PUT', 'OPT', 'QRL', 'CRB', 'ULA', 'LUN', 'PGL', 'THC', 'KED', 'TNC', 'MBRS', 'TIT', 'GJC', 'UCASH', 'EAC', 'MOT', 'KCS', 'MLN', 'BOST', 'NVST', 'CSNO', 'SNG', 'XEL', 'CUBE', 'FCN', 'ARK', 'DGD', 'GPU', 'VEE', 'LANA', 'GOOD', 'XDN', 'KRB', 'FJC', 'QBC', 'FUZZ', 'XGOX', 'BTS', 'STU', 'PLAY', 'SSS', 'BRD', 'RKC', 'USD', 'AMMO', 'SLS', 'NSR', 'NEVA', 'ENRG', 'PPT', 'IFLT', 'VISIO', 'IXC', 'VC', 'THETA', '1ST', 'RED', '2GIVE', 'DRS', 'BRIA', 'RRT', 'DNT', 'XFT', 'ONG', 'IOP', 'HAL', 'BERN', 'BCH', 'TZC', 'LTB', 'MOIN', 'NEU', 'NTRN', 'RVT', 'WPR', 'CBX', 'RISE', 'TAAS', 'OAX', 'FRST', 'BLZ', 'UNO', 'TIE', 'NTO', 'NUKO', 'ALL', 'BRAT', 'XCO', 'AHT', 'TROLL', 'JS', 'ETHD', 'EPY', 'XAS', 'SWING', 'HBC', 'MNE', 'SMLY', 'ARC', 'JPY', 'NXT', 'AVT', 'SFC', 'HPC', 'SHIFT', 'ADST', 'PASC', 'TCC', 'HVN', 'CREA', 'BTM', 'TIO', 'GBG', 'CNO', 'IETH', 'KIN', 'ETN', 'FRD', 'GEO', 'SMART', 'MOON', 'NANO', 'MNC', 'MBI', 'DRXNE', 'REP', 'KORE', 'BXC', 'NVC', 'EXP', 'BDL', 'BUN', 'BTCRED', 'ZNY', 'QVT', 'CNT', 'DLT', 'MRT', 'BBR', 'UTK', 'NULS', 'CPN', 'LUX', 'MED', 'SUMO', 'GP', 'MUE', 'GNO', 'XLC', 'DOPE', 'OTX', 'WCT', 'WGR', 'FLIK', 'BELA', 'IGNIS', 'POLY', 'FC2', 'DBET', 'ETT', 'DICE', 'ELIX', 'SNRG', 'BTQ', 'XVP', 'NET2', 'ONX', 'KNC', 'SDRN', 'PLU', 'SKY', 'BDG', 'ADC', 'IOT', 'CRW', 'ZER', 'MTH', 'EBCH', 'BAT', 'ELE', 'PST', 'CLUB', 'LEO', 'EGC', 'BITS', 'GOLOS', 'PIVX', 'BOT', 'TRCT', 'SMC', 'ERA', 'AID', 'WAX', 'CFD', 'ABJ', 'SWIFT', 'ARG', 'ITC', 'OPAL', 'DNR', 'AST', 'MZC', 'INN', 'WINGS', 'RBX', 'TKS', 'XCP', 'AMP', 'FUNC', 'NIO', 'PART', 'IOC', 'ZEN', 'CANN', 'WAND', 'TFL', 'XSH', 'MCRN', 'OST', 'LGD', 'BSD', 'ARY', 'ECASH', 'CRX', 'PYLNT', 'ATOM', 'INCNT', 'NET', 'OFF', 'BRX', 'QTUM', 'AC', 'TIME', 'SNC', 'ICOS', 'BOLI', 'WRC', 'NEWB', 'ZSC', 'SNT']


const skippingCurrencies = [
  'OFF', // grammar keyword
  '300', // started with numbner (math.js not support)
  '611', // started with numbner (math.js not support)
  '808', // started with numbner (math.js not support)
  '888', // started with numbner (math.js not support)
  '1ST', // started with numbner (math.js not support)
  '2GIVE', // started with numbner (math.js not support)
  '8BIT', // started with numbner (math.js not support)
  'V', // same name as more popular unit
]


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


// Artificial currencies for tests
openexchangeratesCurrencies['TENDOLL'] = {}
openexchangeratesCurrencies['ZUAH'] = {}
openexchangeratesCurrencies['ZUSD'] = {}
openexchangeratesCurrencies['ZEUR'] = {}


// ALL currency codes
let codes = [...new Set([
  ...cryptoCurrenciesList,
  ...Object.keys(openexchangeratesCurrencies),
])]


// skip some currencies
codes = codes.filter( c => !(skippingCurrencies.includes(c)) )



// add all currency codes as self-aliases {'USD': 'USD' ... }
codes.forEach( c => addCurrencyAlias(c, c) )


// add some traditional names
addCurrencyAliases('USD', ['$', 'DOLLAR', 'DOLLARS', 'BUCK', 'BUCKS'], 'force')
addCurrencyAliases('RUB', ['₽', 'RUBLE', 'RUBLES', 'ROUBLE', 'ROUBLES'], 'force')
addCurrencyAliases('UAH', ['₴', 'ГРИВНА', 'ГРИВНЫ', 'ГРИВЕН'], 'force')
addCurrencyAliases('GBP', ['£', 'POUND', 'POUNDS'], 'force')
addCurrencyAliases('EUR', ['€', 'EURO', 'EUROS'], 'force')
addCurrencyAliases('BTC', ['฿', '₿', 'BITCOINS', 'BITCOIN'], 'force')



//console.log(symbolToCode['﷼'])
//console.log(Object.values(symbolToCode).includes('MOD'))
//console.log(Object.keys(symbolToCode).includes('MOD'))
//console.log(symbolToCode)

//console.log(codeToSymbols)
//console.log(symbolToCode['USD'])

// detect currency and return iso
function detect(s) {
  return symbolToCode[s.toLocaleUpperCase()]
}

module.exports = { symbolToCode, detect, codes, codeToSymbols, skippingCurrencies }
