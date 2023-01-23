import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-color-icon',
  templateUrl: './color-icon.component.html',
  styleUrls: ['./color-icon.component.scss']
})
export class ColorIconComponent {
  @Input('colors') colors: string[] = [];

  constructor() {
    this.colors = this.colors.map((color) => color.replace('/', ''));
  }
}
