import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinzahlenDialogComponent } from './einzahlen-dialog.component';

describe('EinzahlenDialogComponent', () => {
  let component: EinzahlenDialogComponent;
  let fixture: ComponentFixture<EinzahlenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EinzahlenDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EinzahlenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
