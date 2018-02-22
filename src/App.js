import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Cryptocalc } from './pages/Cryptocalc'
import { Docs } from './pages/Docs'


const App = () => (
  <HashRouter>
    <div>
      {/* <Route exact path="/" component={Cryptocalc} /> */}

      <Route exact path="/" component={Cryptocalc} />
      <Route path="/docs" component={Docs} />
    </div>
  </HashRouter>
)
export default App
