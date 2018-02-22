import React from 'react';
import Helmet from 'react-helmet'
import { CommonHeader } from './CommonHeader'

export class Docs extends React.Component {
  render() {
    const colorSchemeSuffix = 'dark'
    return (
      <div>
        {/* NOTE: a little copypaste for simplicity */}
        <Helmet>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=0" />
          <title>Cripto Calc</title>
          <link rel="stylesheet" href="css/common.css" />
          <link rel="stylesheet" href={`css/${colorSchemeSuffix}.css`} />
          <link rel="stylesheet" href="css/fonts.css" />
        </Helmet>

        <CommonHeader colorSchemeSuffix={colorSchemeSuffix} />

        <main>
          <div className="container">
            <section className="conversion">
              <h2>Unit Conversion</h2>
              <p>With <span className="orange-color">in</span> (<span className="orange-color">into, as, to</span>) you can convert one unit into another.
                                                                                                                                                 Numi will automatically convert units to perform operations if it's needed during conversion.
              </p>
              <div className="example">
                <p><span className="blue-color">$</span>30 <span className="orange-color">in Euro</span></p>
                <p><span className="blue-color">$</span>30 <span className="blue-color">CAD + </span>5 <span className="blue-color">USD - </span>7<span className="blue-color">EUR</span></p>
              </div>
            </section>
            <section className="currency">
              <h2>Currency</h2>
              <p>
                You can use <u>ISO 4217</u> codes for currency (like <span className="blue-color">USD, RUB, CAD</span> etc).
                You can also use common currency names and signs, like <span className="blue-color">$</span> for the <span className="blue-color">US dollars</span>,
      roubles for Russian roubles, or <span className="blue-color">€</span> for Euro.
      Numi updates currency rates several times a day using <u>open exchange rates</u> service.
      You can use All <u>coinmarketcap</u> coins and tokens (API should update live every minute).
              </p>
              <h3>Operations</h3>
              <p>You can use sign and word operators. Several expressions might be stacked together.
                Notice, expressions will be multiplied if used in parentheses one after another.
              </p>
              <div className="example">
                <p>8 <span className="red-color">times</span> 9</p>
                <p>1 <span className="blue-color">meter</span> 20 <span className="blue-color">cm</span> <span className="orange-color">=</span> 120 <span className="blue-color">cm</span></p>
                <p>6 (3) <span className="orange-color">=</span> 18</p>
              </div>
              <div className="currency-table">
                <ul>
                  <li><span>Operation</span><span>Sample</span></li>
                  <li><span>Addition</span><span>+, plus, and, with</span></li>
                  <li><span>Subtraction</span><span>-, minus, subtract,</span></li>
                  <li><span>Multiplication</span><span>*, times, multiplied by, mul</span></li>
                  <li><span>Division</span><span>/, divide, divide by</span></li>
                  <li><span>Exponent</span><span>^</span></li>
                  <li><span>Left Shift</span><span>&lt;&lt;</span></li>
                  <li><span>Right Shift</span><span>&gt;&gt;</span></li>
                  <li><span>Modulo</span><span>mod</span></li>
                </ul>
              </div>
              <h2>Currency</h2>
              <p>In addition to general percentage operations like adding or subtracting percent of value ($10 - 40%),
                you also can use additional operations:
              </p>
              <div className="currency-table-percent">
                <ul>
                  <li><span>Operation</span><span>Sample</span></li>
                  <li><span>Percentage value</span><p>20% <span className="red-color">of</span> <span className="blue-color">$</span>10</p></li>
                  <li><span>Adding percentage</span><p>5% <span className="red-color">on</span> <span className="blue-color">$</span>30</p></li>
                  <li><span>Substracting percentage</span><p>6% <span className="red-color">off</span> 40<span className="blue-color">EUR</span></p></li>
                  <li><span>Percentage value of one value relative to another</span><p><span className="blue-color">$</span>50 <span className="red-color" />as a % of <span className="blue-color">$</span>100</p></li>
                  <li><span>Percentage addition of one value relative to another</span><p><span className="blue-color">$</span>70 <span className="red-color" />as a % on <span className="blue-color">$</span>20</p></li>
                  <li><span>Percentage subtraction of one value relative to another</span><p><span className="blue-color">$</span>20 <span className="red-color" />as a % off <span className="blue-color">$</span>70</p></li>
                  <li><span>Value by percent partt</span><p>5% <span className="red-color">of what is</span> 6 <span className="blue-color">EUR</span></p></li>
                  <li><span>Value by percent addition</span><p>5% <span className="red-color">of what is</span> 6 <span className="blue-color">EUR</span></p></li>
                  <li><span>Value by percent substraction</span><p>5% <span className="red-color">of what is</span> 6 <span className="blue-color">EUR</span></p></li>
                </ul>
              </div>
              <div className="scales">
                <h2>Scales</h2>
                <p>Scales used for shorter form of writing big numbers.
                  Please note that one-letter scales are case-sensitive, since <span className="blue-color">m</span> used for meters, and <span className="blue-color">K</span> used for Kelvins.
                  Supported scales: thousands (<span className="blue-color">k</span>, <span className="blue-color">thousand</span>), millions (<span className="blue-color">M, million</span>), billions (<span className="blue-color">billion</span>)
                </p>
                <div className="example">
                  <p><span className="blue-color">$</span>2<span className="blue-color">k</span></p>
                  <p>2<span className="blue-color">M eur</span></p>
                </div>
              </div>
              <div className="variables">
                <h2>Variables</h2>
                <p>You can declare variables and reuse them using the <span className="red-color">=</span> operator.
                  Please note some characters and keywords cannot be used as a variable.
                  For example, <span className="blue-color">K</span> might be used as a temperature unit in Kelvin.
                  Variable names should not contain whitespaces or special characters, and should not start with number:
                </p>
                <div className="example">
                  <p><span className="violet-color">v</span> <span className="orange-color">=</span> <span className="blue-color">$</span>20</p>
                  <p><span className="violet-color">v2</span> <span>=</span> 5%</p>
                  <p><span className="violet-color">v</span> <span className="orange-color">times</span> 7 <span className="orange-color">-</span> <span className="violet-color">v2</span></p>
                  <p><span className="violet-color">v</span> <span className="orange-color">+=</span> <span className="blue-color">$</span>10</p>
                </div>
              </div>
              <div className="previous-result">
                <h2>Previous Result</h2>
                <p>Use <span className="red-color">prev</span> token to use result from previous line</p>
                <div className="example">
                  <p><span className="violet-color">Cost:</span> <span className="blue-color">$</span>20 <span className="red-color">+</span> 56 <span className="blue-color">EUR</span></p>
                  <p><span className="violet-color">Discounted: prev</span> <span className="red-color">-</span> 5% discount</p>
                </div>
              </div>
              <div className="sum">
                <h2>Sum</h2>
                <p>You can calculate sum of all lines above (until empty line) using <span className="violet-color">sum</span> (<span className="violet-color">total</span> ) operator.</p>
                <div className="example">
                  <p><span className="violet-color">Line 1:</span> <span className="blue-color">$</span>20</p>
                  <p><span className="violet-color">Line 2:</span> <span className="blue-color">$</span>15</p>
                  <p><span className="violet-color">Result: sum</span></p>
                </div>
              </div>
              <div className="average">
                <h2>Average</h2>
                <p>You can calculate sum of all lines above (until empty line) using <span className="violet-color">average</span> (<span className="violet-color">avg</span> ) operator.</p>
                <div className="example">
                  <p><span className="violet-color">Line 1:</span> <span className="blue-color">$</span>20</p>
                  <p><span className="violet-color">Line 2:</span> <span className="blue-color">$</span>15</p>
                  <p><span className="violet-color">Result: average</span></p>
                </div>
              </div>
              <div className="format">
                <h2>Format</h2>
                <p>Use hash symbol at the beginning of the line to make a header.
                  If you want to comment part of the line, use double quotes.
                  To comment all line, use double slash. Use colon to make a label (label will not be evaluated).
                </p>
                <div className="example">
                  <p className="grey-color"># This is header</p>
                  <p><span className="blue-color">$</span>275 <span className="red-color">for the</span> "Model 227"</p>
                  <p className="grey-color">{"// This is comment"}</p>
                  <p><span className="violet-color">Price:</span> <span className="blue-color">$</span>11 <span className="red-color">+</span> <span className="blue-color">$</span>34.45</p>
                </div>
              </div>
              <div className="shortcuts">
                <h2>Shortcuts (should support also in PCs shortcuts)</h2>
                <div className="shortcuts-table">
                  <ul>
                    <li><span>Surround with parentheses</span><span>⇧⌘0</span></li>
                    <li><span>Copy result on current line</span><span>⇧⌘C</span></li>
                    <li><span>Select all</span><span>⌘A</span></li>
                    <li><span>Delete all</span><span>⎇⌘⌫</span></li>
                    <li><span>Copy all	</span><span>⎇⌘C</span></li>
                    <li><span>Import</span><span>⌘O</span></li>
                    <li><span>Export</span><span>⌘S</span></li>
                    <li><span>Print</span><span>⌘P</span></li>
                  </ul>
                </div>
              </div>
              <div className="constants">
                <h2>Constants</h2>
                <div className="constants-table">
                  <ul>
                    <li><span>Description</span><span>Value</span></li>
                    <li><span>Pi</span><span>3.1415926536</span></li>
                    <li><span>E</span><span>2.7182818285</span></li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </main>

      </div>
    )
  }

}
