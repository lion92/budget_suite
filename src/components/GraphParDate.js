import React from 'react';
import {Bar} from 'react-chartjs-2'

export default function GraphParDate(props) {
    return (
        <>
        <div className="containerGraph">
            <div className="cardGraph">
                <Bar data={props.data}/>

            </div>

        </div>
        </>
    );
}
