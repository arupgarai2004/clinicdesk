import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAppointment } from './manageAppointment';

describe('ManageAppointment', () => {
  let component: ManageAppointment;
  let fixture: ComponentFixture<ManageAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAppointment],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAppointment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
