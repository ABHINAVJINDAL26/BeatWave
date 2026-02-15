import React from "react";
import "../../css/common/Modal.css";
const Modal = ({ children, onclose }) => {
    return <div className="modal-backdrop"
        onClick={onclose}
        role="dialog"
        aria-modal="true"
    >
        <div className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ position: "relative" }}
        >
            <button className="modal-close" aria-label="close"
                onClick={onclose}
            >
                ✖️
            </button>
            {children}
        </div>
    </div>
}

export default Modal;