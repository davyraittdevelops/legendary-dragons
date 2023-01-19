import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeckCardsDetailsPageComponent } from './deck-cards-details-page.component';


describe('DeckCardsDetailsPageComponent', () => {
  let component: DeckCardsDetailsPageComponent;
  let fixture: ComponentFixture<DeckCardsDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckCardsDetailsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckCardsDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
