import React from 'react';
import './Popup.css';

const Popup = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <button className="popup-close-button" onClick={onClose}>
                    ✕
                </button>
                <div className="popup-content">{children}</div>
            </div>
        </div>
    );
};

export default Popup;
