import Link from 'next/link';
import styles from '../page.module.scss';
import { getAppointmentById } from '../../lib/api-appointment';

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const appointment = id ? await getAppointmentById(id) : null;

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>Appointment confirmed</div>
              <div className={styles.placeholder}>Patient Portal</div>
            </div>
          </div>

          <div className={styles['clinic-card']}>
            {appointment ? (
              <>
                <div className={styles['clinic-name']}>Thanks, {appointment.patientName}</div>
                <div className={styles.meta}>A confirmation email was sent to {appointment.patientEmail}.</div>
                <div className={styles.meta}>Clinic: {appointment.clinic?.name ?? appointment.clinicId}</div>
                <div className={styles.meta}>When: {new Date(appointment.startTime).toLocaleString()}</div>
                <div className={styles.meta}>Reason: {appointment.reason}</div>
              </>
            ) : (
              <div className={styles.placeholder}>We could not load this confirmation.</div>
            )}
            <div className={styles['appointment-link']}>
              <Link href="/" className={styles['book-appointment']}>
                Back to clinics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
