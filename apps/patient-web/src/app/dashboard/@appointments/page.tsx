// app/dashboard/@appointments/page.tsx
export default function AppointmentsSlot() {
  const appointments = [
    { id: 1, patient: "John Doe", time: "10:00 AM" },
    { id: 2, patient: "Jane Smith", time: "11:30 AM" },
  ];

  return (
    <div>
      <h3>Today's Appointments</h3>
      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            {a.patient} — {a.time}
          </li>
        ))}
      </ul>
    </div>
  );
}