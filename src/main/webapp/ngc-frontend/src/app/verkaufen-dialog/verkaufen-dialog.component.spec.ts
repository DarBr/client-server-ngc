import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerkaufenDialogComponent } from './verkaufen-dialog.component';

describe('VerkaufenDialogComponent', () => {
  let component: VerkaufenDialogComponent;
  let fixture: ComponentFixture<VerkaufenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerkaufenDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerkaufenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
