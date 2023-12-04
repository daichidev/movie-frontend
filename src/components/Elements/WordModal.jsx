import Modal from "react-bootstrap/Modal";
import { CustomSpinner } from "../../features/upload/component/spinner";

export const WordModal = ({ showModal, onClose, text }) => {
  return (
    <Modal
      show={showModal}
      onHide={onClose}
      dialogClassName="modal-word"
      size="xl"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {/* <div className="row"> */}
          {/* <div className="title-div">
            <span className="main-span">{text}</span>
            <span className="sub-span">
              【知恵】<span style={{ fontSize: "1.5rem" }}>[名]</span>{" "}
            </span>
          </div>
          <div className="content-div">
            <span>知恵の説明を表示します。</span>
          </div> */}
          {console.log("tet", text)}
          {
            text === "" || text.length === 0 ? <div
            style={{
              width: "100%",
              height: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CustomSpinner></CustomSpinner>
          </div> : text
          }
        {/* </div> */}
      </Modal.Body>
    </Modal>
  );
};
