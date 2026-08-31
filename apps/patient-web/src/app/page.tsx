import styles from './page.module.scss';
import { getClinics } from '../lib/api-clinic';

export default async function Index() {
  const clinics = await getClinics();
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>Patient Portal</div>
              <div className={styles.placeholder}>Clinic List</div>
            </div>
          </div>
       
          <div className={styles['clinic-card']}>
            {clinics && clinics.length > 0 ? (
              clinics.map((clinic) => (
                <div key={clinic.id}>
                  <div className={styles['clinic-name']}>{clinic?.name}</div>
                  <div className={styles.meta}>{clinic?.address}</div>
                  <div className={styles.meta}>{clinic?.phoneNumber}</div>
                  <div className={styles.meta} mailto={clinic?.email}>
                    {clinic?.email}
                  </div>
                  <div className={styles['appointment-link']}>
                    <a href={`/book/${clinic.id}`} className={styles['book-appointment']}>
                      Book an Appointment
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.placeholder}>Clinic information not available right now.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
