import React from 'react';
import { NavLink } from 'react-router-dom'


export const CommonHeader = ({colorSchemeSuffix}) => (
  <header>
    <div className="container">
      <NavLink className={`logo ${colorSchemeSuffix}`} to="/">
        <img src={`img/logo-${colorSchemeSuffix}.svg`} alt="logo" />
        cryptocalc
      </NavLink>
      <ul className="menu">
        <li><NavLink exact to="/">Calculator</NavLink></li>
        <li><NavLink exact to="/docs">Docs</NavLink></li>
      </ul>
    </div>
  </header>
)
