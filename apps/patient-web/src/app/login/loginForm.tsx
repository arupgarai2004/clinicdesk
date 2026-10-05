
'use client';
import React from 'react';
import styles from '../page.module.scss';
import { loginUser } from '../../lib/api-auth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(false);
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const router = useRouter();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorMessages: { [key: string]: string } = {};
        if (!email) {
            errorMessages.email = 'Email is required';
        } else if (!validateEmail(email)) {
            errorMessages.email = 'Invalid email format';
        }
        if (!password) {
            errorMessages.password = 'Password is required';
        }
        if (Object.keys(errorMessages).length === 0) {
            try {
                await loginUser({ email, password, rememberMe});
                router.push('/');
                router.refresh();
            } catch (error) {
                errorMessages.login = error instanceof Error ? error.message : 'Failed to login user';
            }
        }
        setErrors(errorMessages);
    };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          {errors.login && <div className={styles.error}>{errors.login}</div>}
        </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input className={styles.input} type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <div className={styles.error}>{errors.email}</div>}
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input className={styles.input} type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <div className={styles.error}>{errors.password}</div>}
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="remember">
          <input className={styles.checkbox} type="checkbox" id="remember" name="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          Remember me
        </label>
         <button type="submit"  className={styles['book-appointment']}>Login</button>
      </div>
      {/* <div className={styles.field}>
        <a href="/forgot-password" className={styles['forgot-password']}>
          Forgot password?
        </a>
      </div> */}
      <div className={styles.field}>
        <a href="/register" className={styles['register-link']}>
          Don't have an account? Register
        </a>
      </div>
     
    </form>
  );
}