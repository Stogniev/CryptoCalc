import React from 'react'
import { HashRouter, BrowserRouter as Router, Route, /* Link*/ } from 'react-router-dom'
import { Cryptocalc } from './Cryptocalc'


const App = () => (
  <HashRouter>
    <div>
      <Route exact path="/" component={Cryptocalc} />
    </div>
  </HashRouter>
)
export default App
