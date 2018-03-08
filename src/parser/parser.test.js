/* global test */
/* global expect */

import { createCalcEnvironment } from './environment'
import { refreshCurrencyUnits } from '../unitUtil'
import { fixedRates } from '../fixedRates'

// create units for all currencies (with fixed test rates)
refreshCurrencyUnits(fixedRates)

const env = createCalcEnvironment()
const call = env.call.bind(env)

//test('my sum', () => expect( (1+2) ).toBe(3) )


//TODO: use fixedRates everywhere instead of synthetic currencies like ZUSD

test(null, () => expect(call('123')).toBe(123) )

test(null, () => expect(call('3 + 2')).toBe(5))

test(null, () => expect(call('1 + 2 * 3')).toBe(7))
test(null, () => expect(call('1 + (2^3) - 2 * 3')).toBe(3))

test(null, () => expect(call('11 mod 4')).toBe(3))
test(null, () => expect(call('4 + 10 mod 4 * 2')).toBe(8))

test(null, () => expect(call('2 ^ 3')).toBe(8))
test(null, () => expect(call('(2 ^ 3)')).toBe(8))

test(null, () => expect(call('2(3)')).toBe(6))
test(null, () => expect(call('(2)3')).toBe(6))
test(null, () => expect(call('(2)(3)')).toBe(6))
test(null, () => expect(call('2(3)4')).toBe(24))

test(null, () => expect(call('(2 + 3) *4')).toBe(20))

test(null, () => expect(call('5(2 + 3)*4')).toBe(100))
test(null, () => expect(call('5*(2 + 3)4')).toBe(100))
test(null, () => expect(call('2*(3)*4')).toBe(24))


test(null, () => expect(call('2*(3)')).toBe(6))
test(null, () => expect(call('(2)*3')).toBe(6))
test(null, () => expect(call('(2)*(3)')).toBe(6))


test(null, () => expect(call('(2 + 3)*4')).toBe(20))
test(null, () => expect(call('5*(2 + 3)*4')).toBe(100))


// math constants
test(null, () => expect(call('E')).toBeCloseTo(Math.E, 5))
test(null, () => expect(call('Pi')).toBeCloseTo(3.14, 2))
test(null, () => expect(call('Pi + 1')).toBeCloseTo(4.14, 2))
test(null, () => expect(call('1 + Pi')).toBeCloseTo(4.141, 2))
//


// implicit multiplication "*"
test(null, () => expect(call('(3)7')).toBe(21))
test(null, () => expect(call('(1+7)3')).toBe(24))
test(null, () => expect(call('8(3)')).toBe(24))
test(null, () => expect(call('(3)(4)')).toBe(12))

test(null, () => expect(call('3(5-2)4')).toBe(36))
test(null, () => expect(call('(3-1) (8/4 + 1)')).toBe(6))
test(null, () => expect(call('(3-1)(8/4 + 1)')).toBe(6))
test(null, () => expect(call('3+ (7-4) 2')).toBe(9))
test(null, () => expect(call('2 (3 + 4)')).toBe(14))
test(null, () => expect(call('7 2')).toBe(14))
test(null, () => expect(call('2 + 3 (2+4) / 2')).toBe(11))
test(null, () => expect(call('1 + 3(5 + 4 - 6 / 3) / 2 * 4 - 3')).toBe(40))

test(null, () => expect(call('3.139 * 1')).toBeCloseTo(3.14, 2) )
test(null, () => expect(call('Pi (7 - 5) - Pi')).toBeCloseTo(3.14, 2) )
test(null, () => expect(call('Pi(7 - 5)Pi/(Pi*Pi) - 2')).toBe(0))

// exponents
test(null, () => expect(call('2^3')).toBe(8))
test(null, () => expect(call('2^3^2')).toBe(512))
test(null, () => expect(call('(2^3)^2')).toBe(64))
test(null, () => expect(call('2*3^2*3')).toBe(54))
test(null, () => expect(call('2 * 3 ^ 2 * 3')).toBeCloseTo(54, 2))
test(null, () => expect(call('2 * Pi ^ 2 * 3')).toBeCloseTo(59.22, 2))
// exponent + braces
test(null, () => expect(call('2^2(3)')).toBe(12))
test(null, () => expect(call('(3)2^2')).toBe(12))
test(null, () => expect(call('(2)Pi^2(3)')).toBeCloseTo(59.22, 2))
test(null, () => expect(call('4^-2')).toBe(4 ** -2))

// // word-described math expr
test(null, () => expect(call('3 + 2')).toBe(5))

test(null, () => expect(call('1 and 2 multiplied by 3')).toBe(7))
test(null, () => expect(call('(1 and 2) multiplied by 3')).toBe(9))
test(null, () => expect(call('1 with 62 without 2 times 3')).toBe(57))
test(null, () => expect(call('4 mul 2 + 3 ^ 2')).toBeCloseTo(17))
test(null, () => expect(call('18 divide by 2 multiplied by 2 ^ 2')).toBe(36))

// math operations space tolerancy
test(null, () => expect(call('18divide by2')).toBe(9))
test(null, () => expect(call('18divided by2multiplied by2 ^ 2')).toBe(36))
test(null, () => expect(call('18plus3minus1')).toBe(20))


// bitwise shift
test(null, () => expect(call('3 << 4')).toBe(48))
test(null, () => expect(call('99 >> 4')).toBe(6))
test(null, () => expect(call('3 << 4 << 2')).toBe(192))
test(null, () => expect(call('3 << (4 << 2)')).toBe(196608))
test(null, () => expect(call('3 << 4 + 1 << 2')).toBe(384))
test(null, () => expect(call('3 << 4 + 9 >> 2')).toBe(6144))

// standard functions
test(null, () => expect(call('sqrt(81)')).toBe(9))
//test(null, () => expect(call('sqrt(-4)'), NaN)

test(null, () => expect(call('sin(2 Pi)')).toBe(call('2 sin(Pi) cos(Pi)')))
test(null, () => expect(call('tan(3 Pi)')).toBe(call('sin(3 Pi)/cos(3 Pi)')))
test(null, () => expect(call('ln(E^5)')).toBe(5))

// unary "+" and "-"
test(null, () => expect(call('-5')).toBe(-5))
test(null, () => expect(call('-5+8')).toBe(3))
test(null, () => expect(call('-5+8')).toBe(3))
test(null, () => expect(call('-1 - -1')).toBe(0))
test(null, () => expect(call('-sin(-Pi/2)')).toBe(1))
test(null, () => expect(call('-(-1)')).toBe(1))
test(null, () => expect(call('-(-2 - -1)')).toBe(1))

//consts
test(null, () => expect(call('Pi + E')).toBe(Math.PI + Math.E))

// floats
test(null, () => expect(call('12.95 + 3.10')).toBeCloseTo(16.05, 2))

// units
test(null, () => expect(call('10 cm').toString()).toBe('10 cm'))
test(null, () => expect(call('-10 cm').toString()).toBe('-10 cm'))

test(null, () => expect(call('3 cm + 2 cm').toString()).toBe('5 cm'))
test(null, () => expect(call('3 km + 2m + 1  mm').value).toBeCloseTo(3002.001))

test(null, () => expect(call('3 km - 500 m').toString()).toBe('2.5 km'))

test(null, () => expect(call('8m / 2').toString()).toBe('4 m'))
test(null, () => expect(call('(5+3)km').toString()).toBe('8 km'))


test(null, () => expect(call('2 kg + 4 cm').message).toBe('Units do not match'))


test(null, () => expect(call('2 fakeUnit').message).toContain('invalid'))

test(null, () => expect(call('2 tonne * 4 gram ').message).toContain('invalid'))

test(null, () => expect(call('4 kg  2').toString()).toBe('8 kg'))
test(null, () => expect(call('4 kg (1 - 0.5) + 100g').toString()).toBe('2.1 kg'))

test(null, () => expect(call('69 cm * 3 / 2 + 2km').toString()).toBe('2.001035 km'))

test(null, () => expect(call('2 kg ^ 2').message).toContain('Unexpected'))

test(null, () => expect(call('3(4kg - 2000 gram / 2) /2').toString()).toBe('4.5 kilogram'))

// negative units
test(null, () => expect(call('-2 m - (-3m)').value).toBeCloseTo(1, 2))

test(null, () => expect(call('2 kg << 2 ').message).toContain('Unexpected'))

test(null, () => expect(call('12 / 2kg ').message).toContain('invalid'))

test(null, () => expect(call('(3+5) 2 kg * 2').value).toBe(32))

// mixed subunits
test(null, () => expect(String(call('1 meter 20 cm').toSI())).toBe('1.2 m'))
test(null, () => expect(String(call('-1 meter 20 cm').toSI())).toBe('-1.2 m'))

test(null, () => expect(String(call('1 meter 20 cm * 2').toSI())).toBe('2.4 m'))
test(null, () => expect(String(call('1 meter 20 cm + 2m 50 cm * 3').toSI())).toBe('8.7 m'))

test(null, () => expect(String(call('1 kg 300 gram / -2').toSI())).toBe('-0.65 kg'))

test(null, () => expect(call('1 m 70 cm + 1 ft').toSI().value).toBeCloseTo(2.0048, 2))

test(null, () => expect(call('0.1km 11m 11 cm + 0.5 * 2 km 2 mm').toSI().toNumber()).toBeCloseTo(1111.111, 2))

//money
test(null, () => expect(call('10 USD').toString()).toBe('10 USD'))
test(null, () => expect(call('10 usd').toString()).toBe('10 USD'))


test(null, () => expect(call('10 Euro').toString()).toBe('10 EUR'))
test(null, () => expect(call('€ 10').toString()).toBe('10 EUR'))
test(null, () => expect(call('Eur10').toString()).toBe('10 EUR'))
test(null, () => expect(call('eUro10').toString()).toBe('10 EUR'))
//
// different writing forms
test(null, () => expect(call('12.34 ₴').toString()).toBe('12.34 UAH'))
test(null, () => expect(call('12.35₴').toString()).toBe('12.35 UAH'))
test(null, () => expect(call('₴12.36').toString()).toBe('12.36 UAH'))
test(null, () => expect(call('₴ 12.37').toString()).toBe('12.37 UAH'))
test(null, () => expect(call('uAh12.38').toString()).toBe('12.38 UAH'))
test(null, () => expect(call('uAh 12.39').toString()).toBe('12.39 UAH'))
test(null, () => expect(call('12.40uAh').toString()).toBe('12.4 UAH'))
test(null, () => expect(call('12.41 uAh').toString()).toBe('12.41 UAH'))


test(null, () => expect(call('₴ 12.42 uaH').toString()).toBe('12.42 UAH'))
test(null, () => expect(call('₴12.43uaH').toString()).toBe('12.43 UAH'))

test(null, () => expect(call('2.5 $').toString()).toBe('2.5 USD'))
test(null, () => expect(call('$ 2.5').toString()).toBe('2.5 USD'))
test(null, () => expect(call('2.5 ₴').toString()).toBe('2.5 UAH'))
test(null, () => expect(call('₴ 2.5').toString()).toBe('2.5 UAH'))
test(null, () => expect(call('UAH 2.5').toString()).toBe('2.5 UAH'))


test(null, () => expect(call('-10 USD').toString()).toBe('-10 USD'))

test(null, () => expect(call('3 USD + 2 USD').toString()).toBe('5 USD'))

test(null, () => expect(call('10$ + 20 ZUAH').value).toBeCloseTo(10.71, 2))

test(null, () => expect(call('$8 / 2').toString()).toBe('4 USD'))
test(null, () => expect(call('(5+3)$').toString()).toBe('8 USD'))

test(null, () => expect(call('-2.5 USD + $3.1 +(1/2)usd').toString()).toBe('1.1 USD'))

test(null, () => expect(call('2 kg + 4 USD').message).toContain('Units do not match'))

test(null, () => expect(call('4 UAH  2').toString()).toBe('8 UAH'))


test(null, () => expect(call('2 GBP ^ 2').message).toContain(('Unexpected')))

// negative units
test(null, () => expect(call('-2 UAH - (-3UAH)').toString()).toBe('1 UAH'))


test(null, () => expect(call('2 UAH << 2 ').message).toContain('Unexpected'))

test(null, () => expect(call('12 / 2UAH ').message).toContain('invalid'))

test(null, () => expect(call('(3+5) 2 Euro * 2').toString()).toBe('32 EUR'))

test(null, () => expect(call('1 UAH * Pi').toNumber()).toBeCloseTo(3.14, 2))

// mixed currencies
test(null, () => expect(call('1 USD + 1 TENDOLL').toNumber('USD')).toBe(11))
test(null, () => expect(call('1 TENDOLL + 1 USD').toNumber('USD')).toBe(11))
test(null, () => expect(call('1 ZUAH + 1 USD + 1 ZEUR').toNumber('ZUAH')).toBeCloseTo(1 + 28 + 28*1.1, 2))
test(null, () => expect(call('(1 USD)2 + 1 ZEUR').value).toBeCloseTo(1*2 + 1.1))
test(null, () => expect(call('1 USD + 1 EUR').value).toBeCloseTo(call('1 EUR + 1 USD').value, 2))


// fixedRates checks
test(null, () => expect(call('$1 CAD').toNumber('USD')).toBeCloseTo(1/fixedRates['CAD'], 2))
test(null, () => expect(call('$1 CAD + 1 EUR ').toNumber('USD')).toBeCloseTo(
  1/fixedRates['CAD'] + 1/fixedRates['EUR'], 2))


// implicit conversion: "number ± unit" treat as "unit ± unit"
test(null, () => expect(call('3 USD + 2').toString()).toBe('5 USD'))
test(null, () => expect(call('3 + 2 USD').toString()).toBe('5 USD'))
test(null, () => expect(call('3 - 1 cad').toNumber('CAD')).toBeCloseTo(2, 2))
test(null, () => expect(call('3 CAD - 1').toNumber('CAD')).toBeCloseTo(2, 2))


// units conversion
test(null, () => expect(call('1 kg to gram').toString()).toBe('1000 gram'))
test(null, () => expect(call('0.4 + 0.6 inch to cm').toString()).toBe('2.54 cm'))
test(null, () => expect(call('4.5 kg to gram').toString()).toBe('4500 gram'))
test(null, () => expect(call('3(4km - 2000 m / 2) /200 to dm').toString()).toBe('450 dm'))
test(null, () => expect(call('1 yard into cm').toString()).toBe('91.44 cm'))
test(null, () => expect(call('2 * 2 ft as mm').toString()).toBe('1219.2 mm'))
test(null, () => expect(call('0 degC to K').toString()).toBe('273.15 K'))



// money conversion (used z-prefixes artifictial fixed-rate currencies for testing)
test(null, () => expect(call('1 ZUSD to ZUAH').toString()).toBe('28 ZUAH'))
test(null, () => expect(call('0.4 + 0.6 ZEUR in ZUSD').toString()).toBe('1.1 ZUSD'))
test(null, () => expect(call('110 USD to ZEUR').toNumber('ZEUR')).toBeCloseTo(100))
test(null, () => expect(call('56 ZUAH in ZUSD').toNumber('ZUSD')).toBeCloseTo(2))
test(null, () => expect(call('56 ZUAH into ZUSD').toNumber('ZUSD')).toBeCloseTo(2))

// test: E const & ETH currency conversion
test(null, () => expect(call('E ETH to USD').value).toBeCloseTo(Math.E/fixedRates['ETH']) )


// %: simple operations
test(null, () => expect(call('10 %').toString()).toBe('10 PERCENT'))
test(null, () => expect(call('3%+2').toString()).toBe('5 PERCENT'))
test(null, () => expect(call('10% + 5%').toString()).toBe('15 PERCENT'))
test(null, () => expect(call('-3%+5 %').toNumber('PERCENT')).toBeCloseTo(2, 2))
test(null, () => expect(call('7% / 2').toString()).toBe('3.5 PERCENT'))

test(null, () => expect(call('300% of 2')).toBe(6))


// % operations (by sheet order)
test(null, () => expect(call('2%+3%').toString()).toBe('5 PERCENT'))
test(null, () => expect(call('2% - 3%').toString()).toBe('-1 PERCENT'))
test(null, () => expect(call('2% + 5').toString()).toBe('7 PERCENT'))
test(null, () => expect(call('200 + 3%')).toBe(206))
test(null, () => expect(call('200 - 3%')).toBe(194))
test(null, () => expect(call('2% - 5').toString()).toBe('-3 PERCENT'))
test(null, () => expect(call('300% - 6').toString()).toBe('294 PERCENT'))

test(null, () => expect(call('6% + 3cm').message).toContain('invalid'))

test(null, () => expect(call('400 km + 5%').toString()).toBe('420 km'))

test(null, () => expect(call('7% + 3kg').message).toContain('invalid'))

test(null, () => expect(call('500 kg - 120%').toString()).toBe('-100 kg'))
test(null, () => expect(call('600 - 10%')).toBe(540))

test(null, () => expect(call('300% of 2')).toBe(6))

// random complex operations with %
test(null, () => expect(call('(3%+2%) (1 +1)').toString()).toBe('10 PERCENT'))

// TODO: mul& div with percents
test(null, () => expect(call('200 * 10%')).toBe(20))

test(null, () => expect(call('200 / 5%')).toBe(4000))

test(null, () => expect(call('200% * 2').toString()).toBe('400 PERCENT'))
test(null, () => expect(call('-100% * 3').toString()).toBe('-300 PERCENT'))

test(null, () => expect(call('200kg * 10%').toString()).toBe('20 kg'))
test(null, () => expect(call('300 * 10%')).toBe(30))

test(null, () => expect(call('200kg / 5%').toNumber('kg')).toBe(4000))
test(null, () => expect(call('200 / 10%')).toBe(2000))

// as a % of/on/off for numbers
test(null, () => expect(call('24 as a % of 120').toString()).toBe('20 PERCENT'))
test(null, () => expect(call('70 as a % on 20').toString()).toBe('250 PERCENT'))

test(null, () => expect(call('20 as a % off 70').value).toBeCloseTo(28.57, 2))

// Tests from Specification
test(null, () => expect(call('8 times 9')).toBe(72))
test(null, () => expect(call('1 meter 20 cm').toString()).toBe('1.2 meter'))
test(null, () => expect(call('6(3)')).toBe(18))
test(null, () => expect(call('$30 CAD + 5 USD - 7EUR').toNumber('USD')).toBeCloseTo(30 * 1/fixedRates['CAD'] + 5 - 7 * 1/fixedRates['EUR'], 2))
test(null, () => expect(call(`${fixedRates['RUB']} roubles - 1 $`).toNumber('USD')).toBeCloseTo(0, 2))
test(null, () => expect(call('20% of 10$').toString()).toBe('2 USD'))
test(null, () => expect(call('5% on $30').toString()).toBe('31.5 USD'))
test(null, () => expect(call('5% on 30')).toBe(31.5))
test(null, () => expect(call('6% off 40 EUR').toString()).toBe('37.6 EUR'))
test(null, () => expect(call('6% off 40')).toBe(37.6))
test(null, () => expect(call('50$ as a % of 100$').toString()).toBe('50 PERCENT'))
test(null, () => expect(call('50 as a % of 100').toString()).toBe('50 PERCENT'))
test(null, () => expect(call('50 kg as a % of 1 tonne').toString()).toBe('5 PERCENT'))
test(null, () => expect(call('50 as a % of 1000').toString()).toBe('5 PERCENT'))
test(null, () => expect(call('$70 as a % on $20').toString()).toBe('250 PERCENT'))
test(null, () => expect(call('70 as a % on 20').toString()).toBe('250 PERCENT'))
test(null, () => expect(call('$20 as a % off $70').value).toBeCloseTo(28.57) )
test(null, () => expect(call('20 as a % off 70').value).toBeCloseTo(28.57) )
test(null, () => expect(call('5% of what is 6 EUR').toNumber('USD')).toBeCloseTo(0.37, 2))
test(null, () => expect(call('5% of what is 6')).toBeCloseTo(0.30, 2))
test(null, () => expect(call('5% on what is 6 EUR').toNumber('EUR')).toBeCloseTo(6.30, 2))
test(null, () => expect(call('5% on what is 6')).toBeCloseTo(6.30, 2))
test(null, () => expect(call('5% off what is 6 EUR').toNumber('EUR')).toBeCloseTo(5.70, 2))
test(null, () => expect(call('5% off what is 6')).toBeCloseTo(5.70, 2))

// Scales
test(null, () => expect(call('4k')).toBe(4000))
test(null, () => expect(call('-1000 + 4.5k + 1000')).toBe(4500))
test(null, () => expect(call('1.5thousand')).toBe(1500))
test(null, () => expect(call('5M')).toBe(5000000))
test(null, () => expect(call('6 billion')).toBe(6000000000))
test(null, () => expect(call('1k-4M')).toBe(-3999000))
test(null, () => expect(call('1000k - 1M')).toBe(0))

test(null, () => expect(call('2k K').toString()).toBe('2000 K') )  //Kelvins
test(null, () => expect(call('$2k').toString()).toBe('2000 USD'))
test(null, () => expect(call('2M eur').toNumber('EUR')).toBe(2000000))

test(null, () => expect(call('2k mm + 2m').toString()).toBe('4 m'))

test(null, () => expect(call('$2.2k in ZEUR').toNumber('ZEUR')).toBeCloseTo(2000))


// when sum/subtract measures use LAST operand measure
test(null, () => expect(call('10ZUSD + 20 ZUAH').toString()).toBe('300 ZUAH'))
test(null, () => expect(call('280ZUAH + 1 ZUSD').toString()).toBe('11 ZUSD'))

test(null, () => expect(call('10ZUSD - 20 ZUAH').toString()).toContain('260')) //ZUAH
test(null, () => expect(call('280ZUAH - 1 ZUSD').toString()).toContain('9')) //ZUSD

test(null, () => expect(call('1m + 1cm').toString()).toBe('101 cm'))


// assign variables
test(null, () => expect(call('var1 = 2').value).toBe(2))
test(null, () => expect(call('var2 = 2 + 3').value).toBe(5))
test(null, () => expect(call('var2 = 2 * 10 kg').value.toString()).toBe('20 kg'))
test(null, () => expect(call('var4 = 2 + $4.4').value.toString()).toBe('6.4 USD'))
test(null, () => expect(call('0wrongvar = 1 + 3').message).toContain('Unexpected'))
test(null, () => expect(call('sum = 1 + 3').message).toContain('Empty'))
test(null, () => expect(call('USD = 2 + 5').message).toContain('Unexpected'))
test(null, () => expect(call('kg = 4 + 9').message).toContain('Empty'))
test(null, () => expect(call('K = 5 + 10').message).toContain('Empty'))
test(null, () => expect(call('var4 = 2 + $4.4').value.toString()).toBe('6.4 USD'))


// reuse number variables
test(null, () => expect(call('varfive = 2 + 3').value).toBe(5))
test(null, () => expect(call('varfive + 4 ')).toBe(9))
test(null, () => expect(call('varten = varfive * 2 ').value).toBe(10))
test(null, () => expect(call('varfifty = varfive * varten ').value).toBe(50))

// reuse measure variables
test(null, () => expect(call('five_cm = 2.5 * 2 cm').value.toString()).toBe('5 cm'))
test(null, () => expect(call('five_cm').toNumber('cm')).toBe(5))
test(null, () => expect(call('five_cm + 4').toNumber('cm')).toBe(9))
test(null, () => expect(call('ten_cm = five_cm * 4 - 10').value.toString()).toBe('10 cm'))
test(null, () => expect(call('six = 6').value).toBe(6))
test(null, () => expect(call('five_cm * six').toNumber('cm')).toBeCloseTo(30, 2))

// 20 % of 300 kg with values
test(null, () => expect(call('perc = 20 %').value.toString()).toBe('20 PERCENT'))
test(null, () => expect(call('weight = 300 kg').value.toString()).toBe('300 kg'))
test(null, () => expect(call('val = perc of weight').value.toNumber('kg')).toBeCloseTo(60, 2))

// increase veriable
test(null, () => expect(call('z = 20 km').value.toString()).toBe('20 km'))
test(null, () => expect(call('z = z + 1 km').value.toString()).toBe('21 km'))


// combined assignments operations (+=)
test(null, () => expect(call('var = 30$').value.toString()).toBe('30 USD'))
test(null, () => expect(call('var += 5').value.toString()).toBe('35 USD'))
test(null, () => expect(call('var *= 3').value.toString()).toBe('105 USD'))
test(null, () => expect(call('var /= 3 + 2').value.toString()).toBe('21 USD') )



// variable tests from specification
test(null, () => expect(call('v = $20').value.toString()).toBe('20 USD'))
test(null, () => expect(call('v2 = 5%').value.toString()).toBe('5 PERCENT'))
test(null, () => expect(call('v times 7 - v2').toString()).toBe('133 USD'))
test(null, () => expect(call('v += 10').value.toString()).toBe('30 USD'))
test(null, () => expect(call('v').toString()).toBe('30 USD'))


// 'prev' variable
test(null, () => expect(call('prev = 1 + 2').message).toContain('Empty'))

test(null, () => expect(call('30 ₴').toString()).toBe('30 UAH'))
test(null, () => expect(call('prev').to('UAH').toString()).toBe('30 UAH'))

test(null, () => expect(call('v = 10 ₴ * 2').value.toString()).toBe('20 UAH'))
test(null, () => expect(call('v = prev + 1').value.toString()).toBe('21 UAH'))
test(null, () => expect(call('prev + prev').toNumber('UAH')).toBeCloseTo(42, 2))

//test clearing variables
test(null, () => {
  call('var = 1 + 1')
  env.reset()
  expect(call('var').message).toContain('Unexpected')
})

//
// testing prev of different types
test(null, () => {
  call('v = 1')
  call('30')
  expect(call('prev + v')).toBe(31)
})

test(null, () => {
  call('v = 40 km')
  call('2')
  expect(call('v + prev').toString()).toBe('42 km')
})


test(null, () => {
  call('v = 5')
  call('v *= 6 cm ')
  expect(call('prev').toString()).toBe('30 cm')
})

// prev is error after error
test(null, () => {
  call('v = 123')
  expect(call('zzzdsfads').message).toContain('Unexpected')
  expect(env.prev.value.message).toContain('Unexpected')
})

// test sum aggregation
test(null, () => {
  env.reset()
  env.call('v = 1')           // 1
  env.call('10')              // 10
  env.call('50 + 50')         // 100
  env.call('prev * 10')       // 1000
  expect(env.call('sum'), 1111)
})


// test sum currency + number(auto-converted to currency)
test(null, () => {
  env.reset()
  env.call('v = 2 UAH')           // 2 UAH
  env.call('20')              // 20 (converted to UAH)
  env.call('100 + 100')         // 200 UAH
  env.call('10 * prev')       // 2000 UAH
  expect(env.call('sum').to('UAH').toString()).toBe('2222 UAH')
})

// test sum units
test(null, () => {
  env.reset()
  env.call('3.1 km')
  env.call('5 m')
  env.call('prev')
  expect(env.call('sum').to('m').toString()).toBe('3110 m')
})

// prev test from specification
test(null, () => {
  env.reset()
  env.call('Cost: $20 ZUSD + 56 ZEUR')  // 20 + 56*1.1 = 81.6
  env.call('Discounted: prev - 5%')  // 77.52
  expect(env.call('prev').to('ZUSD').value).toBeCloseTo(77.52, 2)
})

// test sum percent
test(null, () => {
  env.reset()
  env.call('-100%')
  env.call('30 %')
  expect(env.call('total').to('PERCENT').toString()).toBe('-70 PERCENT')
})

// test average
test(null, () => {
  env.reset()
  env.call('50 cm')
  env.call('0.0015 km')
  env.call('1 m')
  expect(env.call('average').to('m').toString()).toBe('1 m')
})



// test incorrect sum
test(null, () => {
  env.reset()
  env.call('280 ZUAH')  // 10 ZUSD
  env.call('5 ZUSD')    // 5 ZUSD
  expect(env.call('avg').to('ZUSD').toString()).toBe('7.5 ZUSD')
})

// sum with errors
test(null, () => {
  env.reset()
  env.call('1')
  env.call('someErrorneous1')
  env.call('3')
  expect(env.call('sum')).toBe(null)
})

// avg with errors
test(null, () => {
  env.reset()
  env.call('1')
  env.call('someErrorneous1')
  env.call('3')
  expect(env.call('avg')).toBe(null)
})

//internal test: storing expressions
test(null, () => {
  env.reset()
  env.call('1')
  env.call('2')
  expect(env.expressions[0]).toBe('1<EOL>')
  expect(env.expressions[1]).toBe('2<EOL>')
  expect(env.expressions.length).toBe(2)
})

// operations with sum
test(null, () => {
  env.reset()
  env.call('1')
  env.call('2')
  expect(env.call(' sum+1')).toBe(4)
})

// operations with average
test(null, () => {
  env.reset()
  env.call('10')
  env.call('20')
  expect(env.call('average+1')).toBe(16)
})



// test skipping all type comments, headers
test(null, () => expect(env.call('1 + 2 // comment')).toBe(3))
test(null, () => expect(call(' # 1 + 3').message).toContain('Empty'))
test(null, () => expect(env.call(' 1 "just one" + "four" 4 ')).toBe(5))

// sum test from specification
test(null, () => {
  env.reset()
  env.call('Line 1: $10')
  env.call('Line 2: $15')
  expect(env.call('Result: sum').toString()).toBe('25 USD')
})

// average test from specification
test(null, () => {
  env.reset()
  env.call('Line 1: $10')
  env.call('Line 2: $20')
  expect(env.call('Result: average').toString()).toBe('15 USD')
})

// format test from specification
test(null, () => {
  env.reset()
  env.call('# This is header')
  env.call('$275 "for the "Model 227"')
  env.call('// This is comment')
  env.call('Price: $11 + $34.45')
  expect(env.call('prev').toString()).toBe('45.45 USD')
})



