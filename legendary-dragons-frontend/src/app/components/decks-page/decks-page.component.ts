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
      last_modified: new Date("2019-01-16"),
      cards: [
        {
          name: 'Goblin Guide',
          type: 'Creature',
          text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
          cost: 1,
          power: 2,
          toughness: 2,
          imageUrl: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg'
        },
        {
          name: 'Lightning Bolt',
          type: 'Instant',
          text: 'Lightning Bolt deals 3 damage to any target.',
          cost: 1,
          power: 0,
          toughness: 0,
          imageUrl: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
        },
        {
          name: 'Goblin Guide',
          type: 'Creature',
          text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
          cost: 1,
          power: 2,
          toughness: 2,
          imageUrl: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg'
        },
        {
          name: 'Lightning Bolt',
          type: 'Instant',
          text: 'Lightning Bolt deals 3 damage to any target.',
          cost: 1,
          power: 0,
          toughness: 0,
          imageUrl: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
        },
        {
          name: 'Snapcaster Mage',
          type: 'Creature',
          text: 'Flash. When Snapcaster Mage enters the battlefield, target instant or sorcery card in your graveyard gains flashback until end of turn. The flashback cost is equal to its mana cost.',
          cost: 2,
          power: 2,
          toughness: 1,
          imageUrl: 'https://cards.scryfall.io/large/front/2/b/2b73d294-6ab1-4051-9b0f-d8e335d37674.jpg?1626097096'
        },
        {
          name: 'Remand',
          type: 'Instant',
          text: 'Counter target spell. If that spell is countered this way, put it into its owners hand instead of into that players graveyard.',
          cost: 1,
          power: 0,
          toughness: 0,
          imageUrl: 'https://miro.medium.com/max/672/0*WtTRy5c4r3h_JFVB.jpg'
        }
      ]
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'idk something',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'idk something',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'idk something',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'idk something',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Mono Deck',
      deck_type: 'idk somethings',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    },
    {
      name: 'Vampire Deck',
      deck_type: 'idk somethingss',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      cards: []
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
