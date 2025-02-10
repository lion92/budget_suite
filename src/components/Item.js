import React, {useState} from "react";

export default function Item(props) {

    const [iditem, setItemid] = useState(-1);
    return (
        <>
            <div className="card" style={{width: "240px", height:"400px", boxShadow:"7px 7px 7px black"}} onClick={() => {
                props.updatefunc(props.id);
                props.changeDec(props.description);
                props.changetext(props.title);
                props.changeColor(props.color);
            }}>
                <h1 className="card-title">{props.title}</h1>

                <p className="card-description">{props.description}</p>
                <button style={{width: '100%'}} onClick={(e) => props.del(e, props.id)}>delete</button>
            </div>
        </>
    );
}
