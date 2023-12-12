import clsx from 'clsx';
import { ButtonHTMLAttributes, useState } from 'react';
import styles from './styles.module.scss';

export { styles as buttonStyles };

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

export const SecondaryButton = ({
  className,
  onClick,
  ...props
}: ButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <button
      className={clsx(
        className,
        styles.secondary,
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
