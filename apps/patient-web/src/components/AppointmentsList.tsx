// Next.js React component example using shared types
import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentFilters } from '@org/models';

interface AppointmentsListProps {
  clinicId: string;
}

export default function AppointmentsList({ clinicId }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filters, setFilters] = useState<AppointmentFilters>({
    date: new Date().toISOString().split('T')[0], // Today's date
    status: 'ALL',
    search: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [clinicId, filters]);

  const fetchAppointments = async () => {
    try {
      const queryParams = new URLSearchParams({
        clinicId,
        ...filters,
      });

      const response = await fetch(`/api/appointments?${queryParams}`);
      if (response.ok) {
        const data: Appointment[] = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof AppointmentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange('date', e.target.value)}
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input
          type="text"
          placeholder="Search appointments..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Appointments List */}
      <div className="appointments-list">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <h3>{appointment.patientName}</h3>
            <p>{appointment.reason}</p>
            <p>{new Date(appointment.startTime).toLocaleString()}</p>
            <span className={`status ${appointment.status.toLowerCase()}`}>
              {appointment.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}