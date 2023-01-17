import { Component, OnInit } from '@angular/core';
import {Card} from "../../models/card.model";
import {Observable} from "rxjs";
import {Inventory} from "../../models/inventory.model";
import {inventorySelector} from "../../ngrx/inventory/inventory.selectors";


@Component({
  selector: 'app-decks-details-page',
  templateUrl: './decks-details-page.component.html',
  styleUrls: ['./decks-details-page.component.scss']
})
export class DecksDetailsPageComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }


  public sideDecks: Card[] = [];

  public decks: Card[] = [];

}
