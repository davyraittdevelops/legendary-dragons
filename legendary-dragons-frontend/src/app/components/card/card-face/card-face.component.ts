import { Component, Input, OnInit } from '@angular/core';
import { CardFaceDetail } from 'src/app/models/card.model';

@Component({
  selector: 'app-card-face',
  templateUrl: './card-face.component.html',
  styleUrls: ['./card-face.component.scss']
})
export class CardFaceComponent implements OnInit {
  @Input('card_face') cardFace!: CardFaceDetail;
  @Input('colors') colors: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}
