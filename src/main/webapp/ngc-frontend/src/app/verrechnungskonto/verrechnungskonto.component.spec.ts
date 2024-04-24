import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerrechnungskontoComponent } from './verrechnungskonto.component';

describe('VerrechnungskontoComponent', () => {
  let component: VerrechnungskontoComponent;
  let fixture: ComponentFixture<VerrechnungskontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerrechnungskontoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerrechnungskontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
