import React, {useCallback, useEffect, useState} from 'react';
import Navigation from "./Navigation";
import Item from "./Item";
import lien from './lien'

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
        let textebis = (data) => {
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
                lien.url+"categorie/" + idTodo,
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
            let idUser=parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url+"categorie/byuser/"+idUser);
            const resbis = await response.json();
            await setCategorieCard(resbis);

            return resbis;
        }, [setCategorieCard]);
        //////////////////////insert tache
        let fetchCreer = useCallback(async (e) => {
            e.preventDefault();
            const response = await fetch(
                lien.url+"categorie",
                {
                    method: "POST",
                    body: JSON.stringify({
                        categorie: categorie,
                        description: categorieDescription,
                        color:colorCategorie,
                        user: parseInt("" + localStorage.getItem("utilisateur"))
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
                lien.url+"categorie/" + idVal,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        categorie: categorie,
                        description: categorieDescription,
                        color:colorCategorie,
                        user: parseInt("" + localStorage.getItem("utilisateur"))
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
            <div>
                <Navigation></Navigation>
                <form>
                    <div className="containerGraph">
                        <div>
                            {colorCategorie}
                            <input type="color" id="favcolor" name="favcolor"  value={colorCategorie} onChange={(e) =>  {setColorCategorie(e.target.value); console.log(e.target.value)}}/>

                        </div>

                        <div>
                            <label>Description</label>
                            <input value={categorieDescription}
                                   onChange={(e) => setCategorieDescription(e.target.value)}/>{" "}
                        </div>
                        <div>
                            <label>Categorie</label>
                            <input value={categorie} onChange={(e) => setCategorie(e.target.value)}/>{" "}
                        </div>
                        <div className="containerGraph">
                            <button onClick={modifier}>modifier</button>
                            <button onClick={fetchCreer}>creer</button>
                            <button onClick={deleteMontant}>Supprimer</button>
                        </div>

                        <div className="container">

                            {categorieCard.map((item, index) => {
                                return (<div  className="container" style={{backgroundColor:item.color}}>

                                        <Item
                                            del={del}
                                            changeDec={textebisDesc}
                                            changetext={textebis}
                                            updatefunc={idchange}
                                            title={item.description}
                                            description={item.categorie}
                                            id={item.id}
                                        ></Item>

                                        <label>id</label>
                                        <span>{item.id}</span>
                                        {colorCategorie}

                                    </div>
                                );
                            })}
                        </div>
                    </div>


                </form>
            </div>
        );
    }
}
