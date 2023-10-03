import { Modal } from "react-bootstrap";
import { ModalButton } from "./ModalButton";
import { KanjiText } from "./CustomText";

export const StampModal = ({ showModal, onClose, onClear }) => {
  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <Modal
      show={showModal}
      onHide={onClose}
      dialogClassName="modal-stamp"
      size="lg"
      centered
    >
      <Modal.Header>
        <span>
          <KanjiText title={"時"} pronun={"じ"} />
          <KanjiText title={"間"} pronun={"かん"} />
          を してよいですか。
          <br />
          いちど
          <KanjiText title={"消"} pronun={"け"} />
          すと、
          <KanjiText title={"元"} pronun={"もと"} />
          にはもどりません。
        </span>
      </Modal.Header>
      <Modal.Body>
        <ModalButton
          children={
            <>
              <KanjiText title={"消"} pronun={"け"} />す
            </>
          }
          isConfirm={true}
          onClick={handleClear}
        />
        <ModalButton
          children={
            <>
              <KanjiText title={"消"} pronun={"け"} />
              さない
            </>
          }
          isConfirm={false}
          onClick={onClose}
        />
      </Modal.Body>
    </Modal>
  );
};
