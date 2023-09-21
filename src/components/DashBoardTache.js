import React from 'react';
import './dashboard.scss'
import Navigation from "./Navigation";
import Form from "./Form";

const DashBoardTache = () => {

    return (
        <div className="container2">
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
                     <Form></Form>
                    </div>


                </div>
            </div>

        </div>
    );
};

export default DashBoardTache;