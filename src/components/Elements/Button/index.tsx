import clsx from 'clsx';
import { ButtonHTMLAttributes, useState } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styles from './styles.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export const PrimaryButton = ({
  className,
  onClick,
  ...props
}: ButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <button
      className={clsx(
        className,
        styles.primary,
        isSubmitting && styles.submitting,
      )}
      onClick={async (e) => {
        setIsSubmitting(true);
        await onClick?.(e);
        setIsSubmitting(false);
      }}
      {...props}
    />
  );
};

export const PrimaryLink = ({ className, ...props }: LinkProps) => (
  <Link className={clsx(className, styles.primary)} {...props} />
);
