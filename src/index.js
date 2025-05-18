import React from 'react';
import ReactDOM from 'react-dom/client'; // ⚠️ React 18+
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

import NotFound from './components/NotFound';
import DashBoardBudget from "./components/DashBoardBudget";
import DashBoardTache from "./components/DashBoardTache";
import DashLogin from "./components/DashLogin";
import DashBoardCategorie from "./components/DashBoardCategorie";
import DashBoardInscription from "./components/DashInscription";
import DashBoardHello from "./components/DashBoardHello";
import DashAllSpend from "./components/DashAllSpend";
import DashBoardAgenda from "./components/DashBoardAgenda";
import DashAllSpendFilters from "./components/DashAllSpendFilters";
import DashPrediction from "./components/DashPrediction";
import DashEnveloppe from "./components/DashEnveloppe";

const Root = () => (
    <Router>
        <Routes>
            <Route path="/" element={<DashBoardHello />} />
            <Route path="/login" element={<DashLogin />} />
            <Route path="/inscription" element={<DashBoardInscription />} />
            <Route path="/categorie" element={<DashBoardCategorie />} />
            <Route path="/budget" element={<DashBoardBudget />} />
            <Route path="/form" element={<DashBoardTache />} />
            <Route path="/allSpend" element={<DashAllSpend />} />
            <Route path="/allSpendFilters" element={<DashAllSpendFilters />} />
            <Route path="/enveloppe" element={<DashEnveloppe />} />
            <Route path="/prediction" element={<DashPrediction />} />
            <Route path="/agenda" element={<DashBoardAgenda />} />
            <Route path="*" element={<NotFound />} /> {/* Remplace Route "catch-all" */}
        </Routes>
    </Router>
);

// ⚠️ Si tu es en React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
