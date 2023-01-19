import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCardToDeckComponent } from './add-card-to-deck.component';


describe('AddCardToDeckComponent', () => {
  let component: AddCardToDeckComponent;
  let fixture: ComponentFixture<AddCardToDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCardToDeckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCardToDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
