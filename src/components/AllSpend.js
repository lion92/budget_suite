import React, {useCallback, useEffect, useState} from 'react';
import lien from "./lien";

const AllSpend = () => {
    const [year, setYear] = useState("2023");
    let [listDesDepense, setListDesDepense] = useState([]);
    useEffect(() => {
        fetchAPI();
    }, []);
    const fetchAPI = useCallback(async () => {
        let idUser = parseInt("" + localStorage.getItem("utilisateur"))
        const response = await fetch(lien.url + "action/byuser/" + idUser);
        const resbis = await response.json();
        await setListDesDepense(resbis);
        return resbis;
    }, [setListDesDepense]);
    return (
        <>
            <h1 style={{fontSize:20, color:"blueviolet", textAlign:"center"}}>Toutes vos dépenses</h1>
            <div className="container">

                {listDesDepense.map((item, index) => {
                    return <div>
                        <div className="card">
                            <th>{item.id}</th>
                            <th style={{color:"red"}}>Montant: {item.montant}</th>
                            <th className="description">Description: {item.description}</th>
                            <th className="description">Categorie: {item.categorie}</th>
                            <th className="description">{item.dateTransaction}</th>
                        </div>

                    </div>;
                })}
            </div>
        </>
    );
};

export default AllSpend;