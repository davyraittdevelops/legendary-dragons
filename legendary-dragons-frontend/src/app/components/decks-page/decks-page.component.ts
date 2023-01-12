import { Component, OnInit } from '@angular/core';
import {Deck} from "../../models/deck.model";

@Component({
  selector: 'app-decks-page',
  templateUrl: './decks-page.component.html',
  styleUrls: ['./decks-page.component.scss']
})
export class DecksPageComponent implements OnInit {
  public decks: Deck[] = [
    // {
    //   name: 'Grixis Midrange',
    //   deck_type: 'idk something',
    //   total_value: '1000000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: [
    //     {
    //       card_name: 'Goblin Guide',
    //       set_type: 'Creature',
    //       text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
    //
    //     },
    //     {
    //       card_name: 'Lightning Bolt',
    //       set_type: 'Instant',
    //       text: 'Lightning Bolt deals 3 damage to any target.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
    //     },
    //     {
    //       card_name: 'Goblin Guide',
    //       set_type: 'Creature',
    //       text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg'
    //     },
    //     {
    //       card_name: 'Lightning Bolt',
    //       set_type: 'Instant',
    //       text: 'Lightning Bolt deals 3 damage to any target.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
    //     },
    //     {
    //       card_name: 'Snapcaster Mage',
    //       set_type: 'Creature',
    //       text: 'Flash. When Snapcaster Mage enters the battlefield, target instant or sorcery card in your graveyard gains flashback until end of turn. The flashback cost is equal to its mana cost.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/2/b/2b73d294-6ab1-4051-9b0f-d8e335d37674.jpg?1626097096'
    //     },
    //     {
    //       card_name: 'Remand',
    //       set_type: 'Instant',
    //       text: 'Counter target spell. If that spell is countered this way, put it into its owners hand instead of into that players graveyard.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://miro.medium.com/max/672/0*WtTRy5c4r3h_JFVB.jpg'
    //     }
    //   ]
    // },
    // {
    //   name: 'Mono Deck',
    //   deck_type: 'idk somethings',
    //   total_value: '10',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Vampire Deck',
    //   deck_type: 'idk somethingss',
    //   total_value: '60000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: [
    //     {
    //       card_name: 'Goblin Guide',
    //       set_type: 'Creature',
    //       text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg'
    //     },
    //     {
    //       card_name: 'Lightning Bolt',
    //       set_type: 'Instant',
    //       text: 'Lightning Bolt deals 3 damage to any target.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
    //     },
    //     {
    //       card_name: 'Goblin Guide',
    //       set_type: 'Creature',
    //       text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg'
    //     },
    //     {
    //       card_name: 'Lightning Bolt',
    //       set_type: 'Instant',
    //       text: 'Lightning Bolt deals 3 damage to any target.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
    //     },
    //     {
    //       card_name: 'Snapcaster Mage',
    //       set_type: 'Creature',
    //       text: 'Flash. When Snapcaster Mage enters the battlefield, target instant or sorcery card in your graveyard gains flashback until end of turn. The flashback cost is equal to its mana cost.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/2/b/2b73d294-6ab1-4051-9b0f-d8e335d37674.jpg?1626097096'
    //     },
    //     {
    //       card_name: 'Remand',
    //       set_type: 'Instant',
    //       text: 'Counter target spell. If that spell is countered this way, put it into its owners hand instead of into that players graveyard.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://miro.medium.com/max/672/0*WtTRy5c4r3h_JFVB.jpg'
    //     }
    //   ]
    // },
    // {
    //   name: 'Grixis Midrange',
    //   deck_type: 'idk something',
    //   total_value: '1000000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Mono Deck',
    //   deck_type: 'idk somethings',
    //   total_value: '10',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Vampire Deck',
    //   deck_type: 'idk somethingss',
    //   total_value: '60000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Grixis Midrange',
    //   deck_type: 'idk something',
    //   total_value: '1000000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Mono Deck',
    //   deck_type: 'idk somethings',
    //   total_value: '10',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Vampire Deck',
    //   deck_type: 'idk somethingss',
    //   total_value: '60000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Grixis Midrange',
    //   deck_type: 'idk something',
    //   total_value: '1000000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Mono Deck',
    //   deck_type: 'idk somethings',
    //   total_value: '10',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: [
    //     {
    //       card_name: 'Goblin Guide',
    //       set_type: 'Creature',
    //       text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg'
    //     },
    //     {
    //       card_name: 'Lightning Bolt',
    //       set_type: 'Instant',
    //       text: 'Lightning Bolt deals 3 damage to any target.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
    //     },
    //     {
    //       card_name: 'Goblin Guide',
    //       set_type: 'Creature',
    //       text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg'
    //     },
    //     {
    //       card_name: 'Lightning Bolt',
    //       set_type: 'Instant',
    //       text: 'Lightning Bolt deals 3 damage to any target.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721',
    //     },
    //     {
    //       card_name: 'Snapcaster Mage',
    //       set_type: 'Creature',
    //       text: 'Flash. When Snapcaster Mage enters the battlefield, target instant or sorcery card in your graveyard gains flashback until end of turn. The flashback cost is equal to its mana cost.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/2/b/2b73d294-6ab1-4051-9b0f-d8e335d37674.jpg?1626097096'
    //     },
    //     {
    //       card_name: 'Remand',
    //       set_type: 'Instant',
    //       text: 'Counter target spell. If that spell is countered this way, put it into its owners hand instead of into that players graveyard.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://miro.medium.com/max/672/0*WtTRy5c4r3h_JFVB.jpg'
    //     }
    //   ]
    // },
    // {
    //   name: 'Vampire Deck',
    //   deck_type: 'idk somethingss',
    //   total_value: '60000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Grixis Midrange',
    //   deck_type: 'idk something',
    //   total_value: '1000000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Mono Deck',
    //   deck_type: 'idk somethings',
    //   total_value: '10',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: []
    // },
    // {
    //   name: 'Vampire Deck',
    //   deck_type: 'idk somethingss',
    //   total_value: '60000',
    //   created_at: new Date("2019-01-16"),
    //   last_modified: new Date("2019-01-16"),
    //   cards: [
    //     {
    //       card_name: 'Goblin Guide',
    //       set_type: 'Creature',
    //       text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg'
    //     },
    //     {
    //       card_name: 'Lightning Bolt',
    //       set_type: 'Instant',
    //       text: 'Lightning Bolt deals 3 damage to any target.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
    //     },
    //     {
    //       card_name: 'Goblin Guide',
    //       set_type: 'Creature',
    //       text: 'Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg'
    //     },
    //     {
    //       card_name: 'Lightning Bolt',
    //       set_type: 'Instant',
    //       text: 'Lightning Bolt deals 3 damage to any target.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
    //     },
    //     {
    //       card_name: 'Snapcaster Mage',
    //       set_type: 'Creature',
    //       text: 'Flash. When Snapcaster Mage enters the battlefield, target instant or sorcery card in your graveyard gains flashback until end of turn. The flashback cost is equal to its mana cost.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://cards.scryfall.io/large/front/2/b/2b73d294-6ab1-4051-9b0f-d8e335d37674.jpg?1626097096'
    //     },
    //     {
    //       card_name: 'Remand',
    //       set_type: 'Instant',
    //       text: 'Counter target spell. If that spell is countered this way, put it into its owners hand instead of into that players graveyard.',
    //       rarity: "rare",
    //       released_at: "2022-04-29",
    //       prices: "1",
    //       image_url: 'https://miro.medium.com/max/672/0*WtTRy5c4r3h_JFVB.jpg'
    //     }
    //   ]
    // }
  ]

  constructor() { }

  ngOnInit(): void {
  }
}
