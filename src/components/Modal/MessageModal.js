import { useEffect, useState } from "react";
import "./Modal.css";
import Backdrop from "../Backdrop/Backdrop";

const MessageModal = ({ show, modalClose, title, content }) => {
  return (
    <>
      <Backdrop show={show} clicked={modalClose} />
      <div
        className="modal"
        style={{
          transform: show ? "translateY(-70px)" : "translateY(-100vh)",
          opacity: show ? "1" : "0",
        }}
      >
        <div className="modalHeader">
          <h3>{title}</h3>
        </div>
        <div className="modal-content-text">{content}</div>
      </div>
    </>
  );
};

export default MessageModal;
