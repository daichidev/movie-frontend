import clsx from 'clsx';
import { ReactNode } from 'react';
import { Navigation } from '../Navigation';
import styles from './styles.module.scss';

export const Layout = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <main className={clsx(className, styles.main)}>
      <Navigation className={styles.nav} />
      {children}
    </main>
  );
};
