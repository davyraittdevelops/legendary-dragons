import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardFromInventoryComponent } from './add-card-from-inventory.component';

describe('AddCardFromInventoryComponent', () => {
  let component: AddCardFromInventoryComponent;
  let fixture: ComponentFixture<AddCardFromInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCardFromInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCardFromInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
