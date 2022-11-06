import React from "react";
import { render } from "react-dom";
import TwitterApp from './TwitterApp.js'
import { BrowserRouter } from 'react-router-dom'
import history from "./History";

render((
    <>
    <div id="dialog" />
    <TwitterApp />
    </>
),document.getElementById('root'))
