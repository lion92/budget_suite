import React from 'react';
import {Link} from "react-router-dom";

const Helloword = () => {

    return (
        <div>
            <h1>Hello</h1>
            <Link  onClick={() =>  {localStorage.removeItem('jwt'); localStorage.removeItem("utilisateur");}}to="/">Deconnexion</Link>
        </div>
    );
};

export default Helloword;