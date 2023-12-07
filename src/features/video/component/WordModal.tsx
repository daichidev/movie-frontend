import { Modal } from '../../../components/Modal';
import styles from './WordModal.module.scss';

type WordModalProps = {
  onClose: () => void;
  wordHtml?: string;
};
export const WordModal = ({ onClose, wordHtml }: WordModalProps) => {
  return (
    <Modal open={!!wordHtml} onClose={onClose}>
      <div className={styles.container}>
        <div
          className={styles.wordmodal}
          dangerouslySetInnerHTML={{ __html: wordHtml || '' }}
        />
      </div>
    </Modal>
  );
};
