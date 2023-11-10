import React from 'react'
import './enveloppe.scss'

function Enveloppe() {
    return <>
        <h1>projet à venir</h1>
        <div className="containerCote">
            <div id="enveloppe">
                <div id="back"></div>
                <div id="lid-top"></div>
                <div id="letter">
                    <div className="head line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <div id="lid-right-shadow"></div>
                <div id="lid-right"></div>
                <div id="lid-left-shadow"></div>
                <div id="lid-left"></div>
            </div>
        </div>
    </>
}

export default Enveloppe