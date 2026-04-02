import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklyCalendar } from './weekly-calendar';

describe('WeeklyCalendar', () => {
  let component: WeeklyCalendar;
  let fixture: ComponentFixture<WeeklyCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
