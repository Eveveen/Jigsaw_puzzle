import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Puzzle from '../../component/Puzzle'

export default class Portal extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Redirect exact from="/" to="/puzzle" />
                    <Route path="/puzzle" component={Puzzle} />
                </Switch>
            </Router>
        )
    }
}