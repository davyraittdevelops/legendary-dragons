import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWishlistItemComponent } from './add-card-component';

describe('AddCardButtonComponent', () => {
  let component: AddWishlistItemComponent;
  let fixture: ComponentFixture<AddWishlistItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWishlistItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWishlistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
