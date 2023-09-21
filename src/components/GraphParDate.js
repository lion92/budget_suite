import React from 'react';
import {Bar} from 'react-chartjs-2'

export default function GraphParDate(props) {
    return (
        <div>

            <div style={{width: '100%', height:'100%', display:'flex', justifyContent:'center',  alignItems:'center'}}>
                <Bar data={props.data}/>

            </div>

        </div>
    );
}
