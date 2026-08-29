import styles from './page.module.scss';
import { getClinic } from '../lib/api-clinic';

const clinicId = 'cmo9ubxjo0000625jh5uuqvso'; // Replace with the actual clinic ID you want to fetch

export default async function Index() {
     const clinic = await getClinic(clinicId);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>Patient Portal</div>
              <div className={styles.placeholder}>Clinic Details</div>
            </div>
          </div>

          <div className={styles['clinic-card']}>
            {clinic ? (
              <div>
                <div className={styles['clinic-name']}>{clinic?.name}</div>
                <div className={styles.meta}>{clinic?.address}</div>
                <div className={styles.meta}>{clinic?.phoneNumber }</div>
                <div className={styles.meta}>{clinic?.email}</div>
                <div><a href="/book" className={styles['book-appointment']}>Book an Appointment</a></div>
              </div>
            ) : (
              <div className={styles.placeholder}>Clinic information not available right now.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
