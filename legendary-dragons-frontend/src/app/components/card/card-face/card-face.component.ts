import { Component, Input } from '@angular/core';
import { CardFaceDetail } from 'src/app/models/card.model';

@Component({
  selector: 'app-card-face',
  templateUrl: './card-face.component.html',
  styleUrls: ['./card-face.component.scss']
})
export class CardFaceComponent {
  @Input('card_face') cardFace!: CardFaceDetail;
  @Input('colors') colors: string[] = [];

  constructor() {}

  extractManaCost(manaCost: string): string[] {
    return manaCost.split(/[{}]/)
      .filter((mana) => mana !== '')
      .map((mana) => mana.replace('/', ''));
  }
}
