import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZahlungListeComponent } from './zahlung-liste.component';

describe('ZahlungListeComponent', () => {
  let component: ZahlungListeComponent;
  let fixture: ComponentFixture<ZahlungListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZahlungListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZahlungListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
