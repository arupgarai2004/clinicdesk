import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { WeeklyCalendar } from './weekly-calendar';
import { AppointmentStore, ClinicStore } from '@org/data-access';

describe('WeeklyCalendar', () => {
  let component: WeeklyCalendar;
  let fixture: ComponentFixture<WeeklyCalendar>;
  const loadClinics = vi.fn(async () => undefined);
  const loadAppointments = vi.fn(async () => undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyCalendar],
      providers: [
        {
          provide: ClinicStore,
          useValue: {
            clinics: signal([{ id: 'clinic-1', name: 'City Clinic' }]),
            loadClinics,
          },
        },
        {
          provide: AppointmentStore,
          useValue: {
            appointments: signal([]),
            loading: signal(false),
            error: signal(null),
            loadAppointments,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
