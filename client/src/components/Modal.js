import React from "react";
import { Button } from "@material-ui/core";
import { buttonVariant } from "../variables";

const Modal = props => {
  const { content, handleClose } = props;
  return (
    <div className="modal-background" onClick={handleClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {content}
        <Button variant={buttonVariant} onClick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default Modal;
