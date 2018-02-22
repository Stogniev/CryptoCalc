import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Cryptocalc } from './Cryptocalc'


const App = () => (
  <HashRouter>
    <div>
      <Route exact path="/" component={Cryptocalc} />
    </div>
  </HashRouter>
)
export default App
