import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaufenDialogComponent } from './kaufen-dialog.component';

describe('KaufenDialogComponent', () => {
  let component: KaufenDialogComponent;
  let fixture: ComponentFixture<KaufenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KaufenDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KaufenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
