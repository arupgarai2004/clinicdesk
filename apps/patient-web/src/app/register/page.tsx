import RegistrationForm from "./registrationForm";
import styles from '../page.module.scss';

export default function RegisterPage() {
  return (
    <div  className={styles.page}>
        <div className={styles.wrapper}>
            <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <div className={styles.title}>Register</div>
                    <div className={styles.placeholder}>Patient Portal Registartion form</div>
                </div>
            </div>
            <div className={styles['clinic-card']}>
                <RegistrationForm />
            </div>
            </div>
        </div>
    </div>
  );
}