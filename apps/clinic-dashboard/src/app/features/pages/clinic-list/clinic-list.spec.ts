import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ClinicStore } from '@org/data-access';
import { ClinicList } from './clinic-list';

describe('ClinicList', () => {
  let component: ClinicList;
  let fixture: ComponentFixture<ClinicList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicList],
      providers: [
        provideRouter([]),
        {
          provide: ClinicStore,
          useValue: {
            clinics: signal([]),
            loadClinics: async () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
