import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Cryptocalc } from './pages/Cryptocalc'
import { Docs } from './pages/Docs'

import { CommonHeader } from './pages/CommonHeader'

const colorSchemeSuffix = 'light'

const App = (props) => {
  return (
    <HashRouter>
      <div>

        <Route render={ (pp) =>
          (<CommonHeader {...pp} colorSchemeSuffix={colorSchemeSuffix} />)
        } />

        <Route exact path="/" component={Cryptocalc} />
        <Route path="/docs" component={Docs} />
      </div>
    </HashRouter>
  )
}

export default App
