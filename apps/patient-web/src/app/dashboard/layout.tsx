export default function DashboardLayout({
  children,
  appointments,
  doctors,
}: {
  children: React.ReactNode;
  appointments: React.ReactNode;
  doctors: React.ReactNode;
}) {
  return (
    <div className="dashboard-grid">
      <div className="main">{children}</div>
      <div className="appointments-panel">{appointments}</div>
      <div className="doctors-panel">{doctors}</div>
    </div>
  );
}