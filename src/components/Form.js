import React, {useCallback, useEffect, useState} from "react";
import Item from "./Item";
import lien from './lien'
import {Link} from "react-router-dom";

export default function Form(props) {
    let [titre, setValue] = useState("");
    let [messageErrorDescription, setmessageErrorDescription] = useState("");
    let [messageErrorTitre, setMessageerrorTitre] = useState("");
    let [valueInputTitre, setTitre] = useState("");
    let [valueInputDescription, setDescription] = useState("");
    let [idVal, setId] = useState(-1);
    let [textp, setText] = useState([]);
    ///////////////////////////
    const [load, setLoad] = useState(false);


    let attendre = () => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false);
        }, 500);
        console.log(load);
    };
    useEffect(() => {
        attendre();
    }, []);
    ////////////////////////Rechercher/////////////
    let recherche = async (e) => {
        e.preventDefault();
        if (titre === "") {
            console.log("test0");
            await fetchAPI();
        } else {
            let f = await fetchAPI();
            await console.log(f);
            await titre;
            let tab = await f.filter((elemt) =>
                elemt.title === titre
                || elemt.description === valueInputDescription
            );
            await setText(tab);
            await console.log("bb");
        }
    };
    ////////////////////////////////////////////
    ///////////////////fectchApi/////////////////////////
    const fetchAPI = useCallback(async () => {
        let idUser = parseInt("" + localStorage.getItem("utilisateur"))
        const response = await fetch(lien.url + "todos/byuser/" + idUser);
        const resbis = await response.json();
        await setText(resbis);
        return resbis;
    }, [setText]);

    /////////////////////////////////////////
    ///////////////remonter au parent//////////////////////////////iddata/////////
    let idchange = (data) => {
        setId(data);
    };
    //change color
    let changeColor = (data) => {

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
        setValue(data);
    };
    ///////////////////////////////////////////////////////////remonter le texte
    let textebisDesc = (data) => {
        setDescription(data);
    };
    /////////////////////////////
    ///////////////////////////appel delete
    let fetchdelete = useCallback(async (data) => {
        let idTodo = parseInt(data, 10)
        const response = await fetch(
            lien.url + "todos/" + idTodo,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const resbis = await response;
        await fetchAPI();
    });
    //////////////////////insert tache
    let fetchCreer = useCallback(async (e) => {
        let userid = "" + localStorage.getItem("utilisateur");
        let userid2 = parseInt(userid)
        e.preventDefault();
        const response = await fetch(
            lien.url + "todos",
            {
                method: "POST",
                body: JSON.stringify({
                    title: titre,
                    description: valueInputDescription,
                    user: userid2
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const resbis = await response;
        await fetchAPI();

    });
    ////////////////////update////////////
    let fetchAPIupdate = useCallback(async () => {
        let userid = "" + localStorage.getItem("utilisateur");
        await console.log(userid);
        let id = parseInt(userid);
        const response = await fetch(
            lien.url + "todos/" + idVal,
            {
                method: "PUT",
                body: JSON.stringify({
                    title: titre,
                    description: valueInputDescription,
                    user: id
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const resbis = await response;
        await fetchAPI();
    });
    ////////////////////////input change value
    let Valuechange = (e) => {
        let a = e.target.value;
        console.log(a);

        if (titre.length > 20) {

            setMessageerrorTitre("La valeur du titre ne doit pas dépasser 20 caracteres")
        } else {
            setMessageerrorTitre("");

        }
        setValue(a);
        return a;
    };
    ////////////////////////input change description
    let valueChangeDescription = (e) => {
        let a = e.target.value;
        console.log(a);

        if (valueInputDescription.length > 50) {
            setmessageErrorDescription("La valeur du titre ne doit pas dépasser 50 caracteres")
        } else {
            setmessageErrorDescription("");

        }
        setDescription(a)
        return a;
    };
    /////////////////////////modifier
    let modifier = (e) => {
        e.preventDefault();
        fetchAPIupdate();
        setValue("");
        setTitre("");
    };
    /////////////////////////

    return (

        <div>
            <Link style={{width: '20px', margin: '0'}} onClick={() => {
                localStorage.removeItem('jwt');
                localStorage.removeItem("utilisateur");
            }} to="/">
                <button style={{color: 'red'}}>Deconnexion</button>
            </Link>
            <div className="div2">


                <div>
                    <label id="idLabel">
                        id:{idVal} </label>
                    <div className="divCentrer">
                        <div>
                            <label>Titre</label>
                            <input placeholder="Titre" value={titre} onChange={(e) => Valuechange(e)}/>{" "}
                            <p className="error">{messageErrorTitre}</p>
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea placeholder="Description" value={valueInputDescription}
                                      onChange={(e) => valueChangeDescription(e)}/>{" "}
                            <p className="error">{messageErrorDescription}</p>
                        </div>
                        <div className="containerCote">
                            <button onClick={modifier}>modifier</button>
                            <button onClick={fetchCreer}>creer</button>

                        </div>

                    </div>
                </div>
                {!load ? <div className="containerCote">


                        {textp.map((item, index) => {
                            return (
                                <Item
                                    del={del}
                                    changeColor={changeColor}
                                    changeDec={textebisDesc}
                                    changetext={textebis}
                                    updatefunc={idchange}
                                    title={item.title}
                                    description={item.description}
                                    id={item.id}
                                ></Item>
                            );
                        })}

                    </div>
                    : <h1>Chargement...</h1>}

            </div>
        </div>

    );
}
