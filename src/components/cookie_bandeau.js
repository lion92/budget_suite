import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent !== 'given') {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'given');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'violet', color: 'white', textAlign: 'center', padding: '10px' }}>
            <p>Nous utilisons des cookies pour améliorer votre expérience. En continuant à utiliser notre site, vous acceptez notre politique de cookies.</p>
            <button onClick={handleAccept} style={{ margin: '10px', padding: '5px 20px', cursor: 'pointer' }}>
                Accepter
            </button>
        </div>
    );
};

export default CookieConsent;
