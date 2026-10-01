import React from 'react';
import LoginForm from './loginForm';
import styles from '../page.module.scss';



export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>Login</div>
              <div className={styles.placeholder}>Patient Portal Login form</div>
            </div>
          </div>
          <div className={styles['clinic-card']}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}   