import Link from 'next/link';
import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div>
        <Link href="/">
          <img src="/images/logo.svg" alt="logo" />
        </Link>
      </div>
    </header>
  );
}
