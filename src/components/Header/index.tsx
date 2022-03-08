import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div>
        <img src="/images/logo.svg" alt="logo" />
      </div>
    </header>
  );
}
