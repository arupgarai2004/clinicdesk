import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { AppointmentStore, ClinicStore } from '@org/data-access';
import { ClinicDetails } from './clinic-details';

describe('ClinicDetails', () => {
  let component: ClinicDetails;
  let fixture: ComponentFixture<ClinicDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
        {
          provide: ClinicStore,
          useValue: {
            selectedClinic: signal(null),
            loadClinicDetails: async () => undefined,
          },
        },
        {
          provide: AppointmentStore,
          useValue: {
            appointments: signal([]),
            loadAppointments: async () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
