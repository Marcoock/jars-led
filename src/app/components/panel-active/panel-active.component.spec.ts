import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelActiveComponent } from './panel-active.component';

describe('PanelActiveComponent', () => {
  let component: PanelActiveComponent;
  let fixture: ComponentFixture<PanelActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelActiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
