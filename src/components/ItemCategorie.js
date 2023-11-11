import React, {useState} from "react";

export default function ItemCategorie(props) {

    const [iditem, setItemid] = useState(-1);
    return (
        <>
            <div className="card" style={{width: "200px", height:"300px"}} onClick={() => {
                props.idFunc(props.id);;
                props.changeTitle(props.title)
                props.changeAnnee(props.annee)
                props.changeMonth(props.month)
                props.changecategorie(props.categorie)
                props.changeBudgetDebutMois(props.budgetDebutMois)
            }}>
                <h1 style={{color: 'black'}}>{props.title}</h1>

                <p style={{color: 'blue'}}>{props.categorie}</p>
                <p>Mois : {props.month}</p>
                <p>Anneee:  {props.annee}</p>
                <p>Budget du mois: {props.budgetDebutMois}</p>

                <button style={{width: '100%'}} onClick={(e) => props.del(e, props.id)}>delete</button>
            </div>
        </>
    );
}
