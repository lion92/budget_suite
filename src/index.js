import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NotFound from './components/NotFound';
import DashBoardBudget from "./components/DashBoardBudget";
import DashBoardTache from "./components/DashBoardTache";
import DashLogin from "./components/DashLogin";
import DashBoardCategorie from "./components/DashBoardCategorie";
import DashBoardInscription from "./components/DashInscription";
import DashBoardHello from "./components/DashBoardHello";
import DashEnveloppe from "./components/DashEnveloppe";
import DashAllSpend from "./components/DashAllSpend";
import DashBoardAgenda from "./components/DashBoardAgenda";


const Root = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={DashBoardHello}/>
            <Route exact path="/login" component={DashLogin}/>
            <Route exact path="/inscription" component={DashBoardInscription}/>
            <Route exact path="/categorie" component={DashBoardCategorie}/>
            <Route exact path="/budget" component={DashBoardBudget}/>
            <Route exact path="/enveloppe" component={DashEnveloppe}/>
            <Route exact path="/form" component={DashBoardTache}/>
            <Route exact path="/allSpend" component={DashAllSpend}/>
            <Route exact path="/agenda" component={DashBoardAgenda}/>
            <Route component={NotFound}/>
        </Switch>
    </Router>
)

ReactDOM.render(<Root/>, document.getElementById('root'));




