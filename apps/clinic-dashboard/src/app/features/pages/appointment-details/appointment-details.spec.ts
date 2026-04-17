import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { AppointmentDetails } from './appointment-details';

describe('AppointmentDetails', () => {
  let component: AppointmentDetails;
  let fixture: ComponentFixture<AppointmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDetails],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'appt-123' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
