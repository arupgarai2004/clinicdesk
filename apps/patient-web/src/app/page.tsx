"use client";
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { getClinics } from '../lib/api-clinic';
import { Clinic } from '@org/models';

export default function Index() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [allClinics, setAllClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    getClinics().then((data) => {
      setAllClinics(data);
      setClinics(data);
    });
  }, []);

  function filterClinics(event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = allClinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(searchTerm)
    );
    setClinics(filtered);
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>Patient Portal</div>
              <div className={styles.placeholder}>Clinic List</div>
            </div>
            <div>
               <input
                className={styles.input}
                type="text"
                placeholder="Search clinics..."
                onChange={filterClinics}
              />
            </div>
          </div>
          <div className={styles['clinic-card']}>
            {clinics && clinics.length > 0 ? (
              clinics.map((clinic) => (
                <div key={clinic.id}>
                  <div className={styles['clinic-name']}>{clinic?.name}</div>
                  <div className={styles.meta}>{clinic?.address}</div>
                  <div className={styles.meta}>{clinic?.phoneNumber}</div>
                  <div className={styles.meta}>{clinic?.email}</div>
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