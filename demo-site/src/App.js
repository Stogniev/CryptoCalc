import React from 'react';
//import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import math from 'mathjs'
import { prepareAndParse, formatAnswerExpression } from './demo/calculator2'
import Helmet from 'react-helmet'
//import nearley from 'nearley'
//import grammar from './demo/grammar2'

// const moo = require('moo')
import { tokenize } from './demo/test_moo'
/*eslint no-use-before-define: ["error", { "variables": false }]*/




const B = true

function getTextNodeAtPosition(root, index) {
  //let lastNode = null;

  const treeWalker = document.createTreeWalker(
    root, NodeFilter.SHOW_TEXT, function next(elem) {
      if (index > elem.textContent.length) {
        index -= elem.textContent.length
        //lastNode = elem;
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    })
  const c = treeWalker.nextNode();
  return {
    node: c || root,
    position: c ? index: 0
  }
}

function saveCaretPosition(context) {
  const selection = window.getSelection()
  let range = selection.getRangeAt(0)
  range.setStart(context, 0)
  const len = range.toString().length

  return function restore() {
    const pos = getTextNodeAtPosition(context, len)
    selection.removeAllRanges()
    range = new Range()
    range.setStart(pos.node ,pos.position)
    selection.addRange(range)
  }
}


function reactReplace(s, oldStr, fun) {
  let l = s.split(oldStr);
  if (l.length > 1) {
    l = l.reduce( (o, v, i) => {
      o.push(v);
      if (i < l.length - 1) o.push(fun(v));
      return o
    }, [])
  }
  return l
}


class App extends React.Component {
  static _defaultState = {
    lastExpression: '',
    expression: null, // succesful expression
    result: null,     // succesful result
    error: null,
    inputs: [], // input lines

    e1: 'e1',
    e1HTML: '33 + 22',
    e2: '10 + 5',
    r1: 'r1',
    r1HTML: 'r1HTML',
    r2: '15'
  }

  constructor(props) {
    super(props)
    this.state = App._defaultState
    //this.parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart) //.feed(txt);
  }

  //state = App._defaultState

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
      const parser = prepareAndParse(lastExpression, 'verbose')
      console.log('parser:', parser)
      newState = {...newState,
        expression: formatAnswerExpression(parser.lexer.buffer),
        result: parser && parser.results[0],
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


  render0() {
    const { result, expression } = this.state
    return (
      <div className="App">

        <Helmet>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=0" />
          <title>Cripto Calc</title>
          <link rel="stylesheet" href="css/light.css" />
          {/*<link rel="stylesheet" href="dark.css">*/}
          <link rel="stylesheet" href="css/fonts.css" />
        </Helmet>

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Calculator demo 2018-01-22_18:38</h1>
        </header>
        <p className="center">
          <input placeholder="2 + 2" onChange={this.expressionChanged} autoFocus
                 value={this.state.lastExpression} />
          <br />
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
    )
  }

  test = () => {
    const textHolder = document.getElementById('textHolder')

    const restore = saveCaretPosition(textHolder)
    let text = textHolder.textContent
    text = text.replace(/[0-9]+/g, '<span class="hl-number">$&</span>')
    text = text.replace(/EQ/g, `<br />\n=15`)
    textHolder.innerHTML = text

    restore()
  }

  onInput2 = (event) => {
    const expressionHolder = document.getElementById('expressionHolder')

    const restore = saveCaretPosition(document.getElementById('textHolder'))
    const text = expressionHolder.textContent


    console.log(text, this.renderEHTML(text))

    this.setState( {
      e1: text,
      e1HTML: this.renderEHTML(text),
      r1: '=10',
      r1HTML: this.renderRHTML(text),
    }, restore)

    /* text = text.replace(/[0-9]+/g, '<span class="hl-number">$&</span>')
     * text = text.replace(/EQ/g, `<br />\n=15`)
     * textHolder.innerHTML = text*/

    //restore()
  }

  renderEHTML(e) {
    //let html = e
    //html = html.replace(/[0-9]+/g, '<span class="hl-number">$&</span>')
    //return html
    return <div>{e}<span className="hl-number">+</span>22</div>
  }

  renderRHTML(e) {
    //let html = e
    //html = html.replace(/[0-9]+/g, '<span class="hl-number">$&</span>')
    //return html
    return <div>=<span className="hl-blue">r of: {e}</span></div>
  }

  renderE(e) {
    return this.state.e1HTML
  }

  renderR() {
    return <div contentEditable={false}>=<span>{this.state.e1HTML}</span></div>
  }

  onInput = () => {
    const inputs = [...document.getElementById('inputList').getElementsByTagName('li')]
      .map(x => x.textContent)
    console.log(inputs)
    this.setState( {inputs} )
  }

  componentDidUpdate(prevProps, prevState) {
//    this.state.inputs
  }

  componentDidMount() {
    // make here to surpress react warning (1)
    if (B) document.getElementById('inputList').setAttribute('contenteditable', true)
  }

  // html-format expression
  formatExpression(exp) {
    let r;
    //return exp.split('+'), <mark>+</mark>)
    //return exp
    r = reactReplace(exp, '+', v => (<span className="hl-plus">+</span>))
    //exp = reactReplace(exp, '$', v => (<span className="blue-color">$</span>))

    return r
  }

  render() {
    const { inputs } = this.state
    return (
      <div>
        <div className="autodraw">
          <div className="highlights">
            <ul>
              { inputs.map(inp => <li>{this.formatExpression(inp)}</li>) }
              {/* <li>1 <mark>+</mark> 1</li>
              <li>3 <mark>+</mark> 2</li>
              <li>5 <mark>+</mark> 10</li> */}
            </ul>
          </div>
          <div className="results">
            <ul>
              <li>=<mark>2</mark></li>
              <li>=<mark>5</mark></li>
              <li>=<mark>10</mark></li>
            </ul>
          </div>
        </div>
        <div id="textholder" >
          <ul id="inputList" onInput={this.onInput} /* contentEditable (1) */ >
            {/* { inputs.map( inp => <li>{inp}</li> ) } */}
            <li></li>
            {/* <li>I + I</li>
                <li>З + Z</li>
                <li>S + IО</li> */}
          </ul>
        </div>
        {/* <div contentEditable>
            <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            </ul>
            </div> */}
        {/* <div id="textHolder" contentEditable onInput={this.onInput2}>
            <span id="expressionHolder" >{ this.state.e1HTML }</span>
            <div contentEditable={false}>=<span>{this.state.r1HTML}</span></div>
            <span id="expressionHolder2" >e2</span>
            <div contentEditable={false}>=<span>=er2</span></div>
            {/ * { this.renderE(this.state.e2) }
            { this.renderR(this.state.r2) } * /}

            {/ * <div>2<span className="hl-plus">with</span>3</div>
            <div contentEditable="false">5</div>
            <div>10<span className="hl-plus">with</span>5</div>
            <div contentEditable="false">10+5=15</div>
          * /}
            </div> */}
        <button onClick={this.test}>test</button>
        <Helmet>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=0" />
          <title>Cripto Calc</title>
          <link rel="stylesheet" href="css/light.css" />
          {/*<link rel="stylesheet" href="dark.css">*/}
          <link rel="stylesheet" href="css/fonts.css" />
        </Helmet>

        <header>
          <div className="container">
            <a className="logo light" href="#">
              <img src="img/logo-light.svg" alt="logo" />cryptocalc
            </a>
            <a className="logo dark" href="#">
              <img src="img/logo-dark.svg" alt="logo" />cryptocalc
            </a>
            <ul className="menu">
              <li><a href="#">Calculator</a></li>
              <li><a href="#">Docs</a></li>
            </ul>
          </div>
        </header>
        <main className="main">
          <section className="change">
            <div className="container">
              <div className="switch">
                <img src="img/light-icon.svg" alt="light" className="light" />
                <img src="img/sun.svg" alt="light" className="dark" />
                <div>
                  <input type="checkbox" className="checkbox" id="checkbox" />
                  <label htmlFor="checkbox" />
                </div>
                <img src="img/dark-icon.svg" alt="dark" className="change-img-light" />
                <img src="img/dark-icon-change.svg" alt="dark" className="change-img-dark" />
              </div>
              <div className="total"><span>Tolal:</span><span>€ 1,000,000,00</span></div>
              <div className="holder">
                <span className="plus-black"><img src="img/plus.svg" alt="plus" /></span>
                <span className="plus-white"><img src="img/plus-white.svg" alt="plus" /></span>
                <span className="open-search black"><img src="img/burger.svg" alt="burger" /></span>
                <span className="open-search white"><img src="img/burger-white.svg" alt="burger" /></span>
                <form className="search-form">
                  <input type="text" defaultValue="text" />
                  <ul>
                    <li>Summary</li>
                    <li>1 add 1 <span /></li>
                    <li>Sample</li>
                  </ul>
                </form>
              </div>
            </div>
          </section>
          <div className="container">
            <div className="calc-example">
              <div>
                <span className="grey-color"># Example</span>
                <p><span className="blue-color">$</span>30 <span className="blue-color">CAD</span> + 5 <span className="blue-color">USD</span> - 7<span className="blue-color">EUR</span></p>
                <p>1000 <span className="orange-color">times</span> 1</p>
                <p><span className="blue-color">$</span>50 <span className="orange-color"> as a % of </span> <span className="blue-color">$</span>100</p>
              </div>
              <div>
                <span className="green-bg sum">100,000,000</span>
                <div className="copy">
                  <span>Click to copy</span>
                </div>
                <span className="green-color">50%</span>
              </div>
            </div>
            <div className="calc-example_results">
              <div>
                <p className="grey-color"># User write long verbal math expression</p>
                <p>6 <span className="orange-color">divided by </span>2 plus 7 multiply by 2</p>
                <div className="result sum">
                  <p className="grey-bg"><span className="grey-color">6</span> <span className="red-color">/</span> <span className="grey-color">2</span> <span className="red-color">+</span> <span className="grey-color">7</span> <span className="red-color">*</span> <span className="grey-color">2</span></p>
                  <p><span className="grey-color">=</span>17</p>
                </div>
                <p className="grey-color"># User calculate results that consist several different
                  inner calculations.
                </p>
                <div className="result">
                  <p><span className="violet-color">v</span> <span className="orange-color">=</span> <span className="blue-color">$</span>20
                  </p>
                  <p><span className="grey-color">=</span>$20</p>
                </div>
                <div className="result">
                  <p><span className="violet-color">v2</span> <span className="orange-color">=</span> 5%</p>
                  <p><span className="grey-color">=</span>5%</p>
                </div>
                <div className="result">
                  <p><span className="violet-color">v</span> <span className="orange-color">times</span> 7 <span className="orange-color">-</span> v2</p>
                </div>
                <div className="result sum">
                  <p className="grey-bg">
                    <span className="blue-color">$</span><span className="grey-color">20</span> <span className="red-color">*</span> <span className="grey-color">7</span> <span className="red-color">-</span> <span className="grey-color">5%</span>
                  </p>
                  <p><span className="grey-color">=</span>$133</p>
                </div>
                <div className="result">
                  <p><span className="violet-color">v</span><span className="orange-color"> += </span><span className="blue-color">$</span>10
                  </p>
                  <p><span className="grey-color">=</span>$30</p>
                </div>
                <p className="grey-color"># User calculate several different calculation.</p>
                <div className="result">
                  <p><span className="violet-color">Line 1</span> <span className="blue-color">$10</span></p>
                  <p><span className="grey-color">=</span>$10</p>
                </div>
                <div className="result">
                  <p><span className="violet-color">Line 2</span> <span className="blue-color">$15</span></p>
                  <p><span className="grey-color">=</span>$15</p>
                </div>
                <div className="result">
                  <p><span className="violet-color">Result:</span> <span className="orange-color">sum</span></p>
                </div>
                <div className="result sum">
                  <p className="grey-bg">
                    <span className="blue-color">$</span><span className="grey-color">10</span> <span className="red-color">+</span> <span className="blue-color">$</span><span className="grey-color">15</span>
                  </p>
                  <p><span className="grey-color">=</span>$25</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
  
}

const info = `
Implemented:
  - math calculations
  - unit calculations (including same-type mixed dimensions, scales)
  - implicit number-> unit conversion (Example: "1 + 2 USD" -> "3 USD")
  - currensy calculations (including mixed) (rates are just fixed for demo purpoces)
  - unit and money conversions (see examples below)
  - %-based expressions
  - math scales
  - money and units scales

Not implemented yet:
  - multiline input
  - summarizes, average,
  - variables, prev,
  - format



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

4k
-1000 + 4.5k + 1000
1.5thousand
5M
6 billion
1k-4M

2k K
$2k
2M eur
2k mm + 2m
$2.2k in ZEUR
`

export default App;
