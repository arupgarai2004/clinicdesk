import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ClinicStore } from '@org/data-access';
import { ManageClinic } from './manage-clinic';

describe('ManageClinic', () => {
  let component: ManageClinic;
  let fixture: ComponentFixture<ManageClinic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClinic],
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
            loading: signal(false),
            error: signal(null),
            loadClinicDetails: async () => undefined,
            createClinic: async () => undefined,
            updateClinic: async () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageClinic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
