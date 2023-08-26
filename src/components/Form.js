import React, {useCallback, useEffect, useState} from "react";
import Item from "./Item";
import Navigation from "./Navigation";
import lien from './lien'

export default function Form(props) {
    let [valueInput, setValue] = useState("");
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
        if (valueInput === "") {
            console.log("test0");
            await fetchAPI();
        } else {
            let f = await fetchAPI();
            await console.log(f);
            await valueInput;
            let tab = await f.filter((elemt) =>
                elemt.title === valueInput
                || elemt.description === valueInputDescription
            );
            await setText(tab);
            await console.log("bb");
        }
    };
    ////////////////////////////////////////////
    ///////////////////fectchApi/////////////////////////
    const fetchAPI = useCallback(async () => {
        let idUser=parseInt("" + localStorage.getItem("utilisateur"))
        const response = await fetch(lien.url+"todos/byuser/"+idUser);
        const resbis = await response.json();
        await setText(resbis);
        return resbis;
    }, [setText]);

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
            lien.url+"todos/" + idTodo,
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
            lien.url+"todos",
            {
                method: "POST",
                body: JSON.stringify({
                    title: valueInput,
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
            lien.url+"todos/" + idVal,
            {
                method: "PUT",
                body: JSON.stringify({
                    title: valueInput,
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

        if (valueInput.length > 20) {

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

        <> <Navigation></Navigation>
            <div>


                <form>
                    <label id="idLabel">
                        id:{idVal} </label>
                    <div className="containerGraph">
                        <div>
                            <label>Titre</label>
                            <input value={valueInput} onChange={(e) => Valuechange(e)}/>{" "}
                            <p className="error">{messageErrorTitre}</p>
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea value={valueInputDescription} onChange={(e) => valueChangeDescription(e)}/>{" "}
                            <p className="error">{messageErrorDescription}</p>
                        </div>
                        <div>
                            <button onClick={modifier}>modifier</button>
                            <button onClick={fetchCreer}>creer</button>
                            <button onClick={recherche}>Rechercher</button>
                        </div>

                    </div>
                </form>

            </div>
            {!load ? <div>


                    <div className="container">
                        {textp.map((item, index) => {
                            return (
                                <Item
                                    del={del}
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

                </div>
                : <h1>Chargement...</h1>}

        </>
    );
}
