import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import math from 'mathjs'
import { prepareAndParse, formatAnswerExpression } from './demo/calculator2'

//console.log('mmmmmmmmmmmmmm', math, math.eval('1+1'))

//const r = runmath('2 UAH + 1 USD ')  //math.eval('1+1')
//console.log(r)



class App extends Component {

  static _defaultState = {
    lastExpression: '',
    expression: null, // succesful expression
    result: null,     // succesful result
    error: null
  }

  state = App._defaultState

  formatResult = () => {
    let { result } = this.state
    if (result instanceof math.type.Unit) {
      //console.log('redult.toNumber:', result.clone().toNumber())
      //console.log('result:', result.clone())
      result = result.clone().toString()
    }
    return result
  }

  expressionChanged = (event) => {
    const lastExpression = event.target.value

    if (lastExpression === '') {
      this.setState(App._defaultState)
      return
    }

    let newState = { lastExpression }

    try {
      const answer = prepareAndParse(lastExpression, 'verbose')
      newState = {...newState,
        expression: formatAnswerExpression(answer),
        result: answer && answer.results[0],
        error: null
      }
    } catch(e) {
      let error = `${e}`
      newState = {...newState, error}
    }

    this.setState( newState )
  }

  // componentWillUpdate(nextProps, nextState) {
  //   if (this.state.expression !== nextState.expression) {
  //     componentWillUpdate(nextProps, nextState) {
  //   }
  // }

  render() {
    let { result, expression } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Calculator demo (2018-01-16_20:34)</h1>
        </header>
        <p className="center">
          <input placeholder="2 + 2" onChange={this.expressionChanged} autoFocus={true}
                 value={this.state.lastExpression} /> <br />
          { result
            && [
              <span className="successful-expression">{ expression }</span>,
              <span> = { this.formatResult() }</span>
            ]
          }
        </p>
        <p className="center error">{ this.state.error }</p>
        <pre>{info}</pre>
      </div>
    );
  }
}

const info = `
Implemented:
  - math calculations
  - unit calculations (including same-type mixed dimensions, scales)
  - implicit number-> unit conversion (Example: "1 + 2 USD" -> "3 USD")
  - currensy calculations (including mixed) (rates are just fixed for demo purpoces)
  - unit and money conversions (see examples below)
  - (NEW) %-based expressions

Not implemented yet:
  - summarizes, variables, prev, average, format
  - math scales
  - money scales



Expression examples:

123
3 + 2

1 + 2 * 3
1 + (2^3) - 2 * 3

11 mod 4
4 + 10 mod 4 * 2

2 ^ 3
(2 ^ 3)

2(3)
(2)3
(2)(3)
2(3)4

(2 + 3) *4

5(2 + 3)*4
5*(2 + 3)4
2*(3)*4

2*(3)
(2)*3
(2)*(3)

(2 + 3)*4
5*(2 + 3)*4

e
pi
pi + 1
1 + pi

(3)7
(1+7)3
8(3)
(3)(4)

3(5-2)4
(3-1) (8/4 + 1)
(3-1)(8/4 + 1)
3+ (7-4) 2
2 (3 + 4)
7 2
2 + 3 (2+4) / 2
1 + 3(5 + 4 - 6 / 3) / 2 * 4 - 3

3.139 * 1
pi (7 - 5) - pi
pi(7 - 5)pi/(pi*pi) - 2

2^3
2^3^2
(2^3)^2
2*3^2*3
2 * 3 ^ 2 * 3
2 * pi ^ 2 * 3
// exponent + braces
2^2(3)
(3)2^2
(2)pi^2(3)
4^-2



// word-described math expressions
3 + 2

1 and 2 multiplied by 3
(1 and 2) multiplied by 3
1 with 62 without 2 times 3
4 mul 2 + 3 ^ 2
18 divide by 2 multiplied by 2 ^ 2

// spaceless operations
18divided by2plus2


// bitwise shift
3 << 4
99 >> 4
3 << 4 << 2
3 << (4 << 2)
3 << 4 + 1 << 2
3 << 4 + 9 >> 2

// standard functions
sqrt(81)

sin(2 pi)
tan(3 pi)
ln(e^5)


// unary "+" and "-"
-5
-5+8
-5+8
-1 - -1
-sin(-pi/2)
-(-1)
-(-2 - -1)

//consts
pi + e

// floats
12.95 + 3.10

// units
10 cm
-10 cm

3 cm + 2 cm
3 km + 2m + 1  mm

3 km - 500 m

8m / 2
(5+3)km

4 kg  2
4 kg (1 - 0.5) + 100g


69 cm * 3 / 2 + 2km


3(4kg - 2000 gram / 2) /2

// negative units
-2 m - (-3m)


(3+5) 2 kg * 2

// mixed subunits
1 meter 20 cm
-1 meter 20 cm

1 meter 20 cm * 2
1 meter 20 cm + 2m 50 cm * 3

1 kg 300 gram / -2

1 m 70 cm + 1 ft

0.1km 11m 11 cm + 0.5 * 2 km 2 mm






//money
10 USD
10 usd

10 Euro
€ 10
Eur10
eUro10

// different writing forms
12.34 ₴
12.34₴
₴12.34
₴ 12.34
uAh12.34
uAh 12.34
12.34uAh
12.34 uAh
₴ 12.34 uaH
₴12.34uaH


2.5 $
$ 2.5
2.5 ₴
₴ 2.5
UAH 2.5


-10 USD

3 USD + 2 USD

$8 / 2
(5+3)$

-2.5 USD + $3.1 +(1/2)usd

4 UAH  2


// negative units
-2 UAH - (-3UAH)


(3+5) 2 Euro * 2

1 UAH * pi


// mixed currencies
1 USD + 1 TENDOLL
1 TENDOLL + 1 USD
1 UAH + 1 USD + 1 EUR
(1 USD)2 + 1 EUR
1 USD + 1 EUR


// rates checks
//console.log(rcd:
$1 CAD
$1 CAD + 1 EUR 

// % operations
//TODO


// Tests from Specification
8 times 9
1 meter 20 cm
6(3)
$30 CAD + 5 USD - 7EUR

// unit conversion
1 kg to gram
0.4 + 0.6 inch to cm
4.5 kg to gram
3(4km - 2000 m / 2) /200 to dm
1 yard into cm
'2 * 2 ft as mm
0 degC to K

// money conversion
1 USD to UAH
0.4 + 0.6 EUR in USD0.4 + 0.6 EUR in USD
110 USD into EUR

// percentage
$10 - 40%
20% of $10
5% on $30
6% off 40 EUR
$50 as a % of $100
$70 as a % on $20
$20 as a % off $70
5% of what is 6 EUR
5% on what is 6 EUR
5% off what is 6 EUR
`

export default App;
