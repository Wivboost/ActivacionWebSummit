import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
}

export default function LoadingSpinner({ message = 'Procesando...', progress }: LoadingSpinnerProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.spinner}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>
        <p className={styles.message}>{message}</p>
        {progress !== undefined && (
          <div className={styles.progress}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
