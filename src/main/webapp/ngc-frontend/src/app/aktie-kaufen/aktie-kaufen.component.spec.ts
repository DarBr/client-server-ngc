import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AktieKaufenComponent } from './aktie-kaufen.component';

describe('AktieKaufenComponent', () => {
  let component: AktieKaufenComponent;
  let fixture: ComponentFixture<AktieKaufenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AktieKaufenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AktieKaufenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
