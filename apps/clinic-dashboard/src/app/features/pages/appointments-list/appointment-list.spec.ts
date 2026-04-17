import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppointmentList } from './appointment-list';

describe('AppointmentList', () => {
  let component: AppointmentList;
  let fixture: ComponentFixture<AppointmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
