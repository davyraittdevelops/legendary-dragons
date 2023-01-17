import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeckCardComponent } from './add-deck-card.component';

describe('AddDeckCardComponent', () => {
  let component: AddDeckCardComponent;
  let fixture: ComponentFixture<AddDeckCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeckCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeckCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
