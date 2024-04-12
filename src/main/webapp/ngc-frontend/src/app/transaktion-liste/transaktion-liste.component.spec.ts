import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaktionListeComponent } from './transaktion-liste.component';

describe('TransaktionListeComponent', () => {
  let component: TransaktionListeComponent;
  let fixture: ComponentFixture<TransaktionListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaktionListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransaktionListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
