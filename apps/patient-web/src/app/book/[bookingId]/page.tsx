import styles from '../../page.module.scss';
import { getClinicById } from '../../../lib/api-clinic';
import BookingForm from './BookingForm';

export default async function BookPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const clinic = await getClinicById(bookingId);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>Book an Appointment</div>
              <div className={styles.placeholder}>Patient Portal</div>
            </div>
          </div>

          <div className={styles['clinic-card']}>
            <BookingForm clinicId={clinic.id} clinicName={clinic.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
