import React from 'react'
import { BrowserRouter as Router, Route, /* Link*/ } from 'react-router-dom'
import { Cryptocalc } from './Cryptocalc'


const App = () => (
  <Router>
    <Route exact path="/" component={Cryptocalc} />
    <Route exact path="/CryptoCalc" component={Cryptocalc} />
  </Router>
)
export default App
