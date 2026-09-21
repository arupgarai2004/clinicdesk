'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import styles from '../../page.module.scss';
import { bookAppointment, BookAppointmentState } from './actions';

type BookingFormProps = {
  clinicId: string;
  clinicName: string;
};

export default function BookingForm({ clinicId, clinicName }: BookingFormProps) {
  const [state, action, pending] = useActionState<BookAppointmentState, FormData>(
    bookAppointment,
    null
  );

  return (
    <form className={styles.form} action={action}>
      <input type="hidden" name="clinicId" value={clinicId} />
      <input type="hidden" name="clinicName" value={clinicName} />

      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input className={styles.input} type="text" id="name" name="name" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input className={styles.input} type="email" id="email" name="email" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="date">
          Date
        </label>
        <input className={styles.input} type="date" id="date" name="date" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="time">
          Time
        </label>
        <input className={styles.input} type="time" id="time" name="time" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="reason">
          Reason for Appointment
        </label>
        <textarea className={styles.textarea} id="reason" name="reason" required />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Clinic</span>
        <div className={styles.meta}>{clinicName}</div>
      </div>
      {state?.error ? <div className={styles.error}>{state.error}</div> : null}
      <div className={styles['appointment-link']}>
        <Link href="/" className={styles['book-appointment']}>
          Cancel
        </Link>
        <button type="submit" className={styles['book-appointment']} disabled={pending}>
          {pending ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </form>
  );
}
