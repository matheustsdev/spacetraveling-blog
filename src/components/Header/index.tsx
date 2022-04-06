import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div>
        <Link href="/">
          <img src="/spacetraveling.png" alt="logo" />
        </Link>
      </div>
    </header>
  );
}
