import { Component, OnInit } from '@angular/core';
import {Card} from "../../models/card.model";

@Component({
  selector: 'app-decks-details-page',
  templateUrl: './decks-details-page.component.html',
  styleUrls: ['./decks-details-page.component.scss']
})
export class DecksDetailsPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  public sideDecks: Card[] = [];

  public decks: Card[] = [];

}
