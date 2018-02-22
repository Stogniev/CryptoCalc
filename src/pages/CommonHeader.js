import React from 'react';
import { Link } from 'react-router-dom'


export const CommonHeader = ({colorSchemeSuffix}) => (
  <header>
    <div className="container">
      <Link className={`logo ${colorSchemeSuffix}`} to="/">
        <img src={`img/logo-${colorSchemeSuffix}.svg`} alt="logo" />
        cryptocalc
      </Link>
      <ul className="menu">
        <li><Link to="/">Calculator</Link></li>
        <li><Link to="/docs">Docs</Link></li>
      </ul>
    </div>
  </header>
)
