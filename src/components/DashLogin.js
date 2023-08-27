import React from 'react';
import './dashboard.scss'
import Navigation from "./Navigation";
import App from "../App";
import Budget from "./Budget";
import DashLogin from "./DashLogin";
import Connection from "./connection";

const DashBoardLogin = () => {

    return (
        <div>
            <div className="app">
                <header className="app-header">
                    <div className="app-header-logo">
                        <div className="logo">
				<span className="logo-icon">
				</span>
                            <h1 className="logo-title">
                                <span>Gestion</span>
                                <span>Budget</span>
                            </h1>
                        </div>
                    </div>

                    <div className="app-header-actions">
                        <button className="user-profile">
                            <span>Kriss CLOTILDE</span>
                            <span>
					<div className="kriss"/>
				</span>
                        </button>
                    </div>

                </header>
                <div className="app-body">
                    <div className="app-body-navigation">
                        <Navigation></Navigation>
                        <footer className="footer">
                            <h1>Kriss CLOTILDE<small>©</small></h1>
                            <div>
                                Kriss CLOTILDE ©<br/>
                                All Rights Reserved 2023
                            </div>
                        </footer>
                    </div>
                    <div className="div2">
                        <Connection></Connection>
                    </div>


                </div>
            </div>

        </div>
    );
};

export default DashBoardLogin;