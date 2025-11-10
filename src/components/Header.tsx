import Image from 'next/image';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        
        {/* Logo 1 (Existente) */}
        <Image
          src="/smart.png"
          alt="Smart Logo"
          width={80} // Ajusta el tamaño si es necesario
          height={40}
          priority
        />
        
        {/* Logo 2 (Nuevo) */}
        <Image
          src="/friday_v2.png" // Tu primer logo nuevo
          alt="Friday Logo"
          width={80}
          height={40}
        />
        
        {/* Logo 3 (Nuevo) */}
        <Image
          src="/monitor_v3.png" // Tu segundo logo nuevo
          alt="Monitor Logo"
          width={80}
          height={40}
        />

        {/* Logo 4 (Nuevo) */}
        <Image
          src="/streetrojo_v2.png" // Tu tercer logo nuevo
          alt="Street Logo"
          width={80}
          height={40}
        />
        
        {/* Logo 5 (Existente) */}
        <Image
          src="/create.png"
          alt="Create Logo"
          width={80}
          height={40}
          priority
        />
        
      </div>
    </header>
  );
}  