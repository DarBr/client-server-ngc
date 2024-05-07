import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuszahlenDialogComponent } from './auszahlen-dialog.component';

describe('AuszahlenDialogComponent', () => {
  let component: AuszahlenDialogComponent;
  let fixture: ComponentFixture<AuszahlenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuszahlenDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuszahlenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
