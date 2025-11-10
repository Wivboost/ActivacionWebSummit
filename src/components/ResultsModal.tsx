'use client';

import styles from './ResultsModal.module.scss';

interface ResultsModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onCreateNew: () => void;
}

export default function ResultsModal({ isOpen, imageUrl, onClose, onCreateNew }: ResultsModalProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'smart-madtech-result.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Your Ad is Ready!</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt="Generated result" />
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleDownload} className={styles.downloadBtn}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button onClick={onCreateNew} className={styles.createNewBtn}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New
          </button>
        </div>
      </div>
    </div>
  );
}
