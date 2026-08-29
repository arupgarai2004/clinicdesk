import styles from './page.module.scss';
import { getClinic } from '../lib/api-clinic';

const clinicId = 'cmo9ubxjo0000625jh5uuqvso'; // Replace with the actual clinic ID you want to fetch

export default async function Index() {
     const clinic = await getClinic(clinicId);

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <h1>Welcome to the Patient Web App</h1>
          <p>Clinic Name: {clinic.name}</p>
          <p>Clinic Address: {clinic.address}</p>
          <p>Clinic Phone: {clinic.phone}</p>
          <p>Clinic Email: {clinic.email}</p>


          

  
        </div>
      </div>
    </div>
  );
}
