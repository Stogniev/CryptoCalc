import React from 'react';
//import PropTypes from 'prop-types';
import Helmet from 'react-helmet'
import is from 'is'

//import './Cryptocalc.css';
import { createCalcEnvironment } from '../parser/environment'
import { isError } from '../common'
import { humanizeExpression, formatResult } from '../parser/formatting'

import { highlightLexer } from '../highlighter'
/*eslint no-use-before-define: ["error", { "variables": false }]*/

import { loadjs, canUseDOM } from '../domutil'
import LS from '../localStorageUtil'
import { refreshCurrencyUnits } from '../unitUtil'
//import { CommonHeader } from './CommonHeader'

const NBSP = '\u00A0'

/* eslint-disable jsx-a11y/href-no-hash */  //
export class Cryptocalc extends React.Component {
  static _defaultState = {
    lastExpression: '',
    expression: null, // succesful expression
    result: null,     // succesful result
    error: null,
    env: null,  // calculator environment

    menuInput: '',
    //inputText: '',

    //saved documents ("expression states") as {<name>: <inputText> ...}
    savedDocs: {}, //LS.getObject('savedDocs') || {},

    menuActive: false,

    // TODO: maybe merge to one structore
    inputs: [], // input lines
    //parsedInputs: [], // parsed input lines
    expressions: [],  //active expressions
    results: [],   // calculated results of inputs
    lightColorScheme: true,
  }

  constructor(props) {
    super(props)

    this.state = {
      ...Cryptocalc._defaultState,
      lightColorScheme: LS.getItem('colorScheme') !== 'dark',
      savedDocs: LS.getObject('savedDocs') || {},

    }
    this.db = null;  // firebase
    this.textToRestore = LS.getItem('textToRestore')
  }

  //state = Cryptocalc._defaultState


  // componentWillUpdate(nextProps, nextState) {
  //   if (this.state.expression !== nextState.expression) {
  //     componentWillUpdate(nextProps, nextState) {
  //   }
  // }

  // onKeyPress = (event) => {
  //   const lines = event.target.innerText.split('\n')
  //   console.log('lns', event.target.innerText, lines)
  //   if ( lines.some( l => l.trim().length > 10 ) ) {
  //     event.preventDefault()
  //   }
  // }

  patchEmptyTextholder() {
    // goal: make empty textholder contain div (to deny user-input first line to appear without div => first its style problems)
    if (this.textHolderREF) {
      if (this.textHolderREF.children.length > 0) return;

      const div = document.createElement('div');
      div.style.minHeight = '1em'  // to allow click to edit
      div.setAttribute('data-hint', '10% of 200 USD + 3 EUR')
      this.textHolderREF.appendChild(div);
    }
  }

  // restore text (once)
  restoreText() {
    if (this.textToRestore) {
      this.setUserText(this.textToRestore)
      this.textToRestore = null
    }
  }

  componentDidMount() {
    if (canUseDOM) {
      this.initFirebase()
      this.patchEmptyTextholder()
      this.restoreText()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('updated. Inputs:', this.state.inputs)

    // to init firebase on development mode
    this.initFirebase()

    // focus menu input after show
    if (!prevState.menuActive && this.state.menuActive) {
      document.getElementById('menuInput').focus()
    }

    if (prevState.lightColorScheme !== this.state.lightColorScheme) {
      LS.setItem('colorScheme', this.state.lightColorScheme ? 'light' : 'dark')
    }

    if (Object.keys(prevState.savedDocs).length !== Object.keys(this.state.savedDocs).length) {
      LS.setObject('savedDocs', this.state.savedDocs)
    }

    this.fixVisualHeights()
  }

  onPlusClicked = () => {
    this.setUserText('')
    this.focusUserText()
    this.setState({ menuActive: false })
  }


  onBurgerClicked = () => {
    this.setState({
      menuActive: !this.state.menuActive,
      menuInput: this.generateDocName()
    })
  }

  onLoadDocClicked = (key, event) => {
    this.setUserText(this.state.savedDocs[key])
  }

  onSavingKeyPress = (event) => {
    const inputDOM = event.target
    const name = inputDOM.value

    if (is.equal(event.key, 'Enter') && !is.empty(name)) {
      const savedDocs = {...this.state.savedDocs}
      savedDocs[name] = this.getUserText()
      this.setState( {savedDocs, menuActive: false, menuInput: ''} )
    }
  }

  textHolderDOM() {
    return document.getElementById('textholder')
  }

  // note: direct dom manipulation because of contentEditablebecause of contentEditable
  getUserText() {
    return this.textHolderDOM().innerText.trim()
  }

  // note: direct dom manipulation because of contentEditable
  setUserText(text) {
    this.textHolderDOM().innerText = text
    this.onInput() // ~~ call handler manually
  }

  deleteDocClicked = (name, event) => {
    const savedDocs = {...this.state.savedDocs}
    delete savedDocs[name]
    this.setState( {savedDocs} )
  }

  generateDocName = () => {
    let s = this.getUserText().trim().replace('\n', ';')
    const isLong = s.length > 10
    s = s.slice(0, 10)
    if (isLong) s += '...'
    return s
  }

  focusUserText() {
    this.textHolderDOM().focus()
  }

  onInput = (event) => {
    const text = this.getUserText()
    const inputs = text.split('\n')

    const env = createCalcEnvironment()
    inputs.forEach( input => env.call(input) )

    //console.log('env results:', env.expressions, env.results)
    // recreate expressions and results (keeping old if only succesful)
    const oldExpressions = this.state.expressions
    const oldResults = this.state.results

    const expressions = []
    const results = []
    for (const i in env.expressions) {
      const oldExpression = (i < oldExpressions.length) && oldExpressions[i]
      const oldResult = (i < oldResults.length) && oldResults[i]
      const expression = humanizeExpression(env.expressions[i])
      const result = env.results[i]

      if ( (expression !== '')  // empty expressions just forget
           // broken because of EXPR changed (not something before for example)
           && (expression !== oldExpression)
           && isError(result)
           && oldResult
           && !isError(oldResult) ) {
        // keep old succesful expression & result if expression is changed to broken
        expressions.push(oldExpression)
        results.push(oldResult)
      } else {
        if (!isError(result)) {
          expressions.push(expression)
          results.push(result)
        } else {
          // if both errors  (to sync with input)
          expressions.push(null)
          results.push(null)
        }
      }
    }
    //const expressions = env.expressions.map( e => formatAnswerExpression(e) )
    //const results = env.results
    //console.log('ier:', inputs, expressions, results)

    LS.setItem('textToRestore', text)
    this.setState( {inputs, expressions, results, env} )
  }

  fixVisualHeights = () => {
    // set expressions/results margins considering possible multiline

    const highlights = document.getElementById('highlights').children
    const results = document.getElementById('results').children
    const textholders = document.getElementById('textholder').children

    Array.from(highlights).forEach( (h, i) => {
      highlights[i].style.marginBottom = `${results[i].clientHeight}px`
      if (textholders[i]) {
        textholders[i].style.marginBottom = `${results[i].clientHeight}px`
      }

      if (results[i]) {
        results[i].style.marginTop = `${h.clientHeight}px`
      }
    })
  }

  onPaste = (e) => {
    // prevent pasting formatted text (that broke highilghting overlay)
    // https://stackoverflow.com/a/12028136/1948511

    //alert(e.clipboardData.getData("text/plain"))
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')

    document.execCommand('insertText', false, text)
    // NOTE: insertText maybe nw in IE11. possible solution: (https://stackoverflow.com/questions/12027137/javascript-trick-for-paste-as-plain-text-in-execcommand#comment57489893_12028136)
  }


  initFirebase() {
    if (typeof firebase !== 'undefined') return; // avoid reinitialize on live refresh

    Promise.resolve(
    ).then( () => loadjs('https://www.gstatic.com/firebasejs/4.9.1/firebase.js')
    ).then( () => loadjs('https://www.gstatic.com/firebasejs/4.9.1/firebase-firestore.js')
    ).then( () => {
      const config = {   // keep firebase db readonly
        apiKey: 'AIzaSyA4HThdnU1J0rD4mHKmmDVPYVRMjoGE-Nw',
        authDomain: 'cryptocalc1-76acb.firebaseapp.com',
        databaseURL: 'https://cryptocalc1-76acb.firebaseio.com',
        projectId: 'cryptocalc1-76acb',
        storageBucket: 'cryptocalc1-76acb.appspot.com',
        messagingSenderId: '89798210406'
      }
      /* eslint-disable no-undef */
      firebase.initializeApp(config)
      this.db = firebase.firestore()
      /* eslint-enable no-undef */

      this.db.collection('rates').doc('all').onSnapshot(
        (doc) => {
          const rates = doc.data()

          console.log(`Currency rates for ${new Date()}:`, rates)
          //document.getElementById('rates').innerText = `Live rates (for 1 USD): UAH: ${rates.UAH}, EUR: ${rates.EUR}, BTC: ${rates.BTC} (see console for others)`

          refreshCurrencyUnits(rates)
        },
        (e) => console.error('Snapshot init error', e)
      )
    }).catch( e => console.error('initFirebase error:', e) )
  }

  renderHighlighted(exp) {
    let r = []
    highlightLexer.reset(exp)
    try {
      for (const item of highlightLexer) {
        //console.log('-', item.value, item.type)
        switch (item.type) {
          case 'comment':
          case 'hashComment':
          case 'stringComment':
            r.push(<span className="grey-color" key={item.offset}>{item.value}</span>)
            break;
          case 'label':
            r.push(<span className="violet-color" key={item.offset}>{item.value}</span>)
            break;
          case 'plus':
          case 'minus':
          case 'mul':
          case 'divide':
          case 'exp':
          case 'convert':
          case 'mod':
          case 'leftShift':
          case 'rightShift':
          case 'assign':
            r.push(<span className="orange-color" key={item.offset}>{item.value}</span>)
            break;
          case 'currency':
          case 'unit':
            r.push(<span className="blue-color" key={item.offset}>{item.value}</span>)
            break;
          case 'constant':
          case 'variable':
          case 'specVariables':
            r.push(<span className="violet-color" key={item.offset}>{item.value}</span>)
            break;
          default:
            r.push(<span key={item.offset}>{item.value}</span>)
            //r.push(' ') // add breakable space between highlighted parts
        }
      }
    } catch(e) {
      // in case of parsing error just return parsed text (TODO: process parsing error ONLY)
      console.log('Parsing error', e)
      //return r //exp
      r = exp  // don't highlight unparsed expression
    }

    if (r.length === 0) return null

    return r
  }

  switchColorScheme = () => {
    this.setState({ lightColorScheme: !this.state.lightColorScheme })
  }

  render() {
    const { inputs, expressions, results, env, savedDocs, menuActive, lightColorScheme } = this.state
    const total = env && env.sum()

    const colorSchemeSuffix = lightColorScheme ? 'light': 'dark'

    return (
      <div>
        <Helmet>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=0" />
          <title>Cripto Calc</title>
          <link rel="stylesheet" href="css/common.css" />
          <link rel="stylesheet" href={`css/${colorSchemeSuffix}.css`} />
          <link rel="stylesheet" href="css/fonts.css" />
        </Helmet>

        {/* <CommonHeader colorSchemeSuffix={colorSchemeSuffix} /> */}

        <section className="change">
          <div className="container">
            <div className="switch">
              <img src={`img/sun-${colorSchemeSuffix}.svg`} alt="light" />
              <div>
                <input type="checkbox" className="checkbox" id="checkbox"
                       checked={!lightColorScheme}
                       onChange={this.switchColorScheme} />
                <label htmlFor="checkbox"></label>
              </div>
              <img src={`img/moon-${colorSchemeSuffix}.svg`} alt="dark" />
            </div>
            <div className={`total ${total || 'hidden'}`}
                 onClick={ (e) => this.copyToCliboard(`Total: ${formatResult(total)}`)}
                 >
              <span>Total:{NBSP}</span>
              <span>{ formatResult(total) }</span>
            </div>
            <div className="holder">
              <span className="plus" onClick={this.onPlusClicked}>
                <img src={`img/plus-${colorSchemeSuffix}.svg`} alt="+" />
              </span>
              <span className={`open-search ${menuActive ? 'active' : ''}`}>
                <img src={`img/burger-${colorSchemeSuffix}.svg`} alt="≣"
                     onClick={this.onBurgerClicked} />
              </span>
              <form className={`search-form ${menuActive ? 'active': ''}`}>
                <input id="menuInput" type="text"
                       value={this.state.menuInput}
                       onKeyPress={this.onSavingKeyPress}
                       onChange={
                         (event) => this.setState({ menuInput: event.target.value })
                       }
                />
                <ul>
                  { Object.keys(savedDocs).map( key =>
                      <li onClick={this.onLoadDocClicked.bind(null, key)} key={`sd_${key}`}>
                        {key}
                        <span onClick={this.deleteDocClicked.bind(null, key)}></span>
                      </li>
                    )
                  }
                </ul>
              </form>
            </div>
          </div>
        </section>

        <div className="main-container">
          <div className="autodraw">
            <div id="highlights" className="highlights">
              { inputs.map( (inp, i) =>
                <div key={`h__${i}_${inp}`}
                     /* className={[
                         expressions[i] !== inputs[i] && 'semi-transparent',
                         ].join(' ')} */
                  >
                  {this.renderHighlighted(inp) || NBSP}
                </div>)
              }
            </div>
            <div className="results" id="results" >
              { results.map( (r, i) => ([
                  (r !== null)
                  ?
                  <div className="result-sum" key={`rs_${i}_${r}`}
                       id={`result-sum-${i}`}
                       >
                    <span className="parsed-expression">
                      { this.renderHighlighted(expressions[i]) }
                    </span>
                    <div className="res">
                      = { formatResult(r) }
                    </div>
                  </div>
                  :
                  <div className="result-sum"
                       key={`rs_${i}_${r}`} id={`result-sum-${i}`}
                       >
                    <span className="parsed-expression hidden">
                      <span>{NBSP}</span>
                    </span>
                    <div className="res hidden">{NBSP}</div>
                  </div>
              ]))
              }
            </div>
          </div>
          <div id="textholder-keeper" className="textholder-keeper" >
            <div id="textholder" className="textholder" contentEditable /*onKeyPress={this.onKeyPress}*/
                 data-hint="10% of 200 USD + 2 EUR"
                 onInput={this.onInput}
                 onPaste={this.onPaste}
                 onFocus={() => this.setState({ menuActive: false })}
                 ref={(element) => { this.textHolderREF = element }}
            >
            </div>
          </div>
        </div>

        <br />

        <input id="clipboard" />
      {/* <hr />
      <p id="rates"></p>
      <pre>{info}</pre> */}

      </div>
    )
  }


  copyToCliboard(text) {
    const elem = document.getElementById('clipboard')
    elem.value = text
    elem.select()
    document.execCommand('copy')
  }

}
