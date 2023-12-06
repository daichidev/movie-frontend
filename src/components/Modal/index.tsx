import { Modal as MuiModal, ModalProps as MuiModaProps } from '@mui/material';
import clsx from 'clsx';
import { ReactComponent as Close } from '../../assets/svgs/close.svg';
import styles from './styles.module.scss';

type ModalProps = MuiModaProps & {
  title?: string;
};
export const Modal = ({ title, children, className, ...props }: ModalProps) => (
  <MuiModal {...props} className={clsx(className, styles['container'])}>
    <div className={styles['main']}>
      <div className={styles['header']}>
        {title}
        <button
          type="button"
          className={styles['close-button']}
          onClick={(e) => props.onClose?.(e, 'backdropClick')}
        >
          <Close />
          とじる
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  </MuiModal>
);
