import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AppointmentStore, ClinicStore } from '@org/data-access';
import { WeeklyCalendar } from './weekly-calendar';

describe('WeeklyCalendar', () => {
  let component: WeeklyCalendar;
  let fixture: ComponentFixture<WeeklyCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyCalendar],
      providers: [
        {
          provide: ClinicStore,
          useValue: {
            clinics: signal([]),
            loadClinics: async () => undefined,
          },
        },
        {
          provide: AppointmentStore,
          useValue: {
            appointments: signal([]),
            loading: signal(false),
            error: signal(null),
            loadAppointments: async () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
