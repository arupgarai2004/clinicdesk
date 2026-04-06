# Shared Models Library

This library contains shared TypeScript interfaces and types that can be used across all applications in the monorepo (NestJS API, Angular dashboard, Next.js patient web).

## Available Models

### Appointments
- `Appointment` - Core appointment interface
- `AppointmentFilters` - Filter options for appointment queries
- `AppointmentQuery` - Query parameters for API endpoints

## Usage Examples

### NestJS (Backend API)
```typescript
import { Appointment, AppointmentFilters } from '@org/models';

@Injectable()
export class AppointmentsService {
  async findAll(clinicId: string, filters: AppointmentFilters): Promise<Appointment[]> {
    // Implementation
  }
}
```

### Angular (Frontend)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentFilters } from '@org/models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  constructor(private http: HttpClient) {}

  getAppointments(filters: AppointmentFilters): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('/api/appointments', { params: { ...filters } });
  }
}
```

### Next.js (React Frontend)
```typescript
import { Appointment, AppointmentFilters } from '@org/models';

interface AppointmentsListProps {
  clinicId: string;
}

export default function AppointmentsList({ clinicId }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filters, setFilters] = useState<AppointmentFilters>({ ... });

  // Component implementation
}
```

## Running unit tests

Run `nx test models` to execute the unit tests via [Vitest](https://vitest.dev/).
