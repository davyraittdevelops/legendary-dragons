import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecksPageComponent } from './decks-page.component';

describe('DecksPageComponent', () => {
  let component: DecksPageComponent;
  let fixture: ComponentFixture<DecksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecksPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
