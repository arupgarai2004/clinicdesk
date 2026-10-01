'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.scss';
import { registerUser } from '../../lib/api-auth';

export default function RegistrationForm() {
    const router = useRouter();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState(''); 
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = React.useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const passwordValidation = (password: string) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorMessages: { [key: string]: string } = {}
        if (!name) {
            errorMessages.name = 'Name is required';
        }
        if (!email) {
            errorMessages.email = 'Email is required';
        } else if (!validateEmail(email)) {
            errorMessages.email = 'Invalid email format';
        }
        if (!password) {
            errorMessages.password = 'Password is required';
        } else if (!passwordValidation(password)) {
            errorMessages.password = 'Password must be at least 8 characters long and contain at least one letter, one number, and one special character';
        }
        // Handle form submission logic here
        if (Object.keys(errorMessages).length === 0) {
            try{
                await registerUser({ name, email, password });
                setSuccessMessage('Registration successful! Redirecting to login page...');
                setTimeout(() => {
                    router.push('/login'); // Redirect to login page after successful registration
                }, 2000); // Redirect after 2 seconds
            
            } catch (error) {
                errorMessages.register=error instanceof Error ? error.message : 'An unknown error occurred';
                console.error('Error registering user:', error);
            }
        }
        setErrors(errorMessages);
    }
  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          {errors.register && <div className={styles.error}>{errors.register}</div>}
          {successMessage && <div className={styles.success}>{successMessage}</div>}
        </div>
         <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input className={styles.input} type="text" id="name" name="name" required  value={name} onChange={(e) => setName(e.target.value)}/>
        <div>{errors.name && <div className={styles.error}>{errors.name}</div>}</div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input className={styles.input} type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
        <div>{errors.email && <div className={styles.error}>{errors.email}</div>}</div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input className={styles.input} type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
        <div>{errors.password && <div className={styles.error}>{errors.password}</div>}</div>
      </div>
     <div className={styles['appointment-link']}>
          <button type="reset" className={styles['book-appointment']}>
                Reset
            </button>
            <button type="submit" className={styles['book-appointment']} >
                Register
            </button>
      </div>
    </form>
    </div>
  );
}
