import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorIconComponent } from './color-icon.component';

describe('ColorIconComponent', () => {
  let component: ColorIconComponent;
  let fixture: ComponentFixture<ColorIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
