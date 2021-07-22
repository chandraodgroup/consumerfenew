import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagebookingdetailsComponent } from './managebookingdetails.component';

describe('ManagebookingdetailsComponent', () => {
  let component: ManagebookingdetailsComponent;
  let fixture: ComponentFixture<ManagebookingdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagebookingdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagebookingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
