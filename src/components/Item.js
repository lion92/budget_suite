import React, {useState} from "react";

export default function Item(props) {

    const [iditem, setItemid] = useState(-1);
    return (
        <>
            <div className="card" style={{height: "400px", boxShadow: "7px 7px 7px black", position:"relative"}} onClick={() => {
                props.updatefunc(props.id);
                props.changeDec(props.description);
                props.changetext(props.title);
                props.changeColor(props.color);
            }}>
                <h1 className="card-title">{props.title}</h1>

                <p>{props.description}</p>
                <button style={{position:"absolute", bottom:"0", padding:"1px" ,margin:"auto", left:28}} onClick={(e) => props.del(e, props.id)}>x</button>
            </div>

        </>
    );
}
