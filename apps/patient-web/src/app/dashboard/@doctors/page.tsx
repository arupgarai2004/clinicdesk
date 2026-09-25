export default function DoctorsSlot() {
  const doctors = [
    { id: 1, name: "Dr. Ahuja", status: "Available" },
    { id: 2, name: "Dr. Meyer", status: "In consultation" },
  ];

  return (
    <div>
      <h3>Doctor Availability</h3>
      <ul>
        {doctors.map((d) => (
          <li key={d.id}>
            {d.name} — {d.status}
          </li>
        ))}
      </ul>
    </div>
  );
}