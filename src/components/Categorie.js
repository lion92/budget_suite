import React, {useCallback, useEffect, useState} from 'react';
import Item from "./Item";
import lien from './lien'
import ItemCategorie from "./ItemCategorie";

export function Categorie(props) {


    {
        let [categorieDescription, setCategorieDescription] = useState("");
        let [idCategorieValue, setidCategorieValue] = useState(-1);
        let [categorie, setCategorie] = useState("");
        let [valueInput, setValue] = useState("");
        let [valueInputDescription, setDescription] = useState("");
        let [idVal, setId] = useState(-1);
        let [categorieCard, setCategorieCard] = useState([]);
        let [colorCategorie, setColorCategorie] = useState("red");
        let [month, setMonth] = useState("");
        let [annee, setAnnee] = useState("");
        let [budgetDebutMois, setbudgetDebutMois] = useState(0);

        const [load, setLoad] = useState(false);


        let attendre = () => {
            setLoad(true);
            setTimeout(() => {
                setLoad(false);
            }, 2000);
            console.log(load);
        };
        useEffect(() => {
            attendre();
        }, []);
        ////////////////////////Rechercher/////////////

        ////////////////////////////////////////////
        ///////////////////fectchApi/////////////////////////

        /////////////////////////////////////////
        ///////////////remonter au parent//////////////////////////////iddata/////////
        let idchange = (data) => {
            setId(data);
        };
        let changeAnnee = (data) => {
            setAnnee(data);
        };
        let changeMonth = (data) => {
            setMonth(data);
        };

        let changeBudgetDebutMois = (data) => {
            setbudgetDebutMois(data);
        };

        //////////////////////////appel api en debut
        useEffect(() => {
            fetchAPI();

        }, []);
        ////////////////////////////////////////supprimme des tache
        let del = (e, data) => {
            e.preventDefault();
            fetchdelete(data);
        };
        ///////////////////////////////////////////////////////////remonter le texte
        let title = (data) => {
            setCategorieDescription(data);
        };
        ///////////////////////////////////////////////////////////remonter le texte
        let textebisDesc = (data) => {
            setCategorie(data);
        };
        /////////////////////////////
        ///////////////////////////appel delete
        let fetchdelete = useCallback(async (data) => {
            let idTodo = parseInt(data, 10)
            const response = await fetch(
                lien.url + "categorie/" + idTodo,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            await fetchAPI();

            const resbis = await response;
        });
        const fetchAPI = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "categorie/byuser/" + idUser);
            const resbis = await response.json();
            await setCategorieCard(resbis);

            return resbis;
        }, [setCategorieCard]);
        //////////////////////insert tache
        let fetchCreer = useCallback(async (e) => {
            e.preventDefault();
            const response = await fetch(
                lien.url + "categorie",
                {
                    method: "POST",
                    body: JSON.stringify({
                        categorie: categorie,
                        description: categorieDescription,
                        color: colorCategorie,
                        user: parseInt("" + localStorage.getItem("utilisateur")),
                        month:month,
                        annee:annee,
                        budgetDebutMois:budgetDebutMois
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            await fetchAPI();
        });
        ////////////////////update////////////
        let fetchAPIupdate = useCallback(async () => {
            const response = await fetch(
                lien.url + "categorie/" + idVal,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        categorie: categorie,
                        description: categorieDescription,
                        color: colorCategorie,
                        user: parseInt("" + localStorage.getItem("utilisateur")),
                        month:month,
                        annee:annee,
                        budgetDebutMois:budgetDebutMois

        }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resbis = await response;
            await fetchAPI()
        });
        ////////////////////////input change value
        let Valuechange = (e) => {
            let a = e.target.value;
            console.log(a);

            if (valueInput.length > 20) {


            } else {

            }
            setValue(a);
            return a;
        };
        ////////////////////////input change description
        let valueChangeDescription = (e) => {
            let a = e.target.value;
            console.log(a);

            if (valueInputDescription.length > 50) {

            } else {


            }
            return a;
        };
        /////////////////////////modifier
        let modifier = (e) => {
            e.preventDefault();
            fetchAPIupdate();
            setValue("");

        };
        /////////////////////////modifier
        let deleteMontant = (e) => {
            e.preventDefault();
            fetchdelete(idCategorieValue);
            setValue("");

        };
        /////////////////////////
        return (
            <div className="container2">
                <div className="containerButton">
                    <div style={{"margin": "2px", "padding": "2px"}} className="containerButton">
                        <div>

                            <input type="color" id="favcolor" name="favcolor" value={colorCategorie} onChange={(e) => {
                                setColorCategorie(e.target.value);
                                console.log(e.target.value)
                            }}/>

                        </div>

                        <div>
                            <label>Categorie</label>
                            <input placeholder="Categorie" value={categorie}
                                   onChange={(e) => setCategorie(e.target.value)}/>{" "}
                        </div>
                        <div>
                            <label>Month</label>
                            <p>Ecrire le mois exemple Janvier</p>
                            <input placeholder="Month" value={month}
                                   onChange={(e) => setMonth(e.target.value)}/>{" "}
                        </div>
                        <div>
                            <label>Annee</label>
                            <input placeholder="Annee" value={annee}
                                   onChange={(e) => setAnnee(e.target.value)}/>{" "}
                        </div>
                        <div>
                            <label>budget Debut Mois</label>
                            <input placeholder="budget Debut Mois" value={budgetDebutMois}
                                   onChange={(e) => setbudgetDebutMois(e.target.value)}/>{" "}
                        </div>

                        <div className="containerGraph">
                            <button onClick={modifier}>modifier</button>
                            <button onClick={fetchCreer}>creer</button>
                            <button onClick={deleteMontant}>Supprimer</button>
                        </div>

                        <div style={{"marginTop": "5px"}}
                             className="containerCote">

                            {categorieCard.map((item, index) => {
                                return (<div className="container" style={{backgroundColor: item.color, margin: "5px"}}>

                                        <ItemCategorie
                                            del={del}
                                            changeDec={textebisDesc}
                                            changeTitle={title}
                                            idFunc={idchange}
                                            changeMonth={ changeMonth}
                                            changeBudgetDebutMois={changeBudgetDebutMois}
                                            changeAnnee={changeAnnee}
                                            categorie={item.categorie}
                                            annee={item.annee}
                                            month={item.month}
                                            budgetDebutMois={item.budgetDebutMois}
                                            id={item.id}
                                        ></ItemCategorie>


                                    </div>
                                );
                            })}
                        </div>
                    </div>


                </div>
            </div>
        );
    }
}
