import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewstabComponent } from './newstab.component';

describe('NewstabComponent', () => {
  let component: NewstabComponent;
  let fixture: ComponentFixture<NewstabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewstabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewstabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
