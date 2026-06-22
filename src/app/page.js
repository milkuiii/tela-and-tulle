import { getOccupiedDates } from '@/utils/fetchSheetData';
import RentalCalendar from '@/components/RentalCalendar';
import styles from './page.module.css';

// Server Component
export default async function Home() {
  // Fetch data on the server
  const occupiedDatesMap = await getOccupiedDates();

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <img src="/images/logo.png" alt="tela&tulle Logo"/>
        <p>Availability Tracker</p>
      </div>

      <div className={styles.calendarSection}>
        <RentalCalendar occupiedDatesMap={occupiedDatesMap} />
      </div>

      <div className={styles.footer}>
        <a className={styles.button} href="https://forms.gle/XerNPLngkvTEtZ4v7" style={{ display: 'inline-block', textDecoration: 'none' }}>
          BOOK NOW
        </a>
        <p>Select an occupied date on the calendar to view booked dresses.</p>
      </div>
    </main>
  );
}
