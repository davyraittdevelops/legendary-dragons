import { Component, OnInit } from '@angular/core';
import {Deck} from "../../models/deck.model";

@Component({
  selector: 'app-decks-page',
  templateUrl: './decks-page.component.html',
  styleUrls: ['./decks-page.component.scss']
})
export class DecksPageComponent implements OnInit {
  public decks: Deck[] = [
    {
      name: 'Grixis Midrange',
      deck_type: 'idk something',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'idk something',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'idk something',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'idk something',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'idk something',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16")
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
