import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardsDetailsPageComponent } from './cards-details-page.component';


describe('CardDetailsPageComponent', () => {
  let component: CardsDetailsPageComponent;
  let fixture: ComponentFixture<CardsDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsDetailsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
