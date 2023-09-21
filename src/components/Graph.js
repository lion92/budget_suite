import React from 'react';
import {Bar, Pie} from 'react-chartjs-2'

export default function Graph(props) {
    return (
        <div style={{display:'flex'}}>
            <div style={{width: '100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}} >
                <Pie data={props.data}

                />

            </div>
            <div style={{width: '100%', height:'100%', display:'flex', justifyContent:'center',  alignItems:'center'}}>
                <Bar data={props.data}></Bar>

            </div>

        </div>
    );
}
