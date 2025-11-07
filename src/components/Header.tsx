import Image from 'next/image';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoLeft}>
          <Image
            src="/smart.png"
            alt="Smart Logo"
            width={80}
            height={40}
            priority
          />
        </div>
        <div className={styles.logoRight}>
          <Image
            src="/create.png"
            alt="Create Logo"
            width={80}
            height={40}
            priority
          />
        </div>
      </div>
    </header>
  );
}
