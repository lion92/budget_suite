import React from 'react';
import {Bar} from 'react-chartjs-2'

export default function BarGraph(props) {
    return (
        <div className="divCentrer">
            <Bar data={props.data}></Bar>
        </div>
    );
}
