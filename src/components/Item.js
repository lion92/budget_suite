import React, {useState} from "react";

export default function Item(props) {

    const [iditem, setItemid] = useState(-1);
    return (
        <>
            <div className="card" style={{width:'20em'}} onClick={() => {
                props.updatefunc(props.id);
                props.changeDec(props.description);
                props.changetext(props.title)
            }}>
                <h1 style={{color:'black'}}>{props.title}</h1>

                <p style={{color:'blue'}}>{props.description}</p>
                <button style={{width:'100%'}} onClick={(e) => props.del(e, props.id)}>delete</button>
            </div>
        </>
    );
}
