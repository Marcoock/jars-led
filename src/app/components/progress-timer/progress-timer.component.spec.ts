import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTimerComponent } from './progress-timer.component';

describe('ProgressTimerComponent', () => {
  let component: ProgressTimerComponent;
  let fixture: ComponentFixture<ProgressTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
