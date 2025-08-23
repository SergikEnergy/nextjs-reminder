import styles from './loading.module.css';

const Loading = () => (
  <div className={styles.container}>
    <div className={styles.ball}>
      <div className={styles.inner}>
        <div className={styles.line} />
        <div className={`${styles.line} ${styles['line--two']}`} />
        <div className={styles.oval} />
        <div className={`${styles.oval} ${styles['oval--two']}`} />
      </div>
    </div>
    <div className={styles.shadow} />
  </div>
);

export default Loading;
