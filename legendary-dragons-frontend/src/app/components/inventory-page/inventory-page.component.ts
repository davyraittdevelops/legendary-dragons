import { Component, OnInit } from '@angular/core';
import { Card } from "../../models/card.model";

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})

export class InventoryPageComponent implements OnInit {

  public CARD_DATA: Card[] = [
    // {
    //   card_name: 'Goblin Guide',
    //   set_type: 'Creature',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
    //   card_faces: [
    //     {
    //       oracle_text: "Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library",
    //       image_url: "",
    //     }
    //   ]
    // },
    // {
    //   card_name: 'Lightning Bolt',
    //   set_type: 'Instant',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721',
    //   card_faces: [
    //     {
    //       oracle_text: "Lightning Bolt deals 3 damage to any target.",
    //       image_url: "",
    //     }
    //   ]
    // },
    // {
    //   card_name: 'Goblin Guide',
    //   set_type: 'Creature',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
    //   card_faces: [
    //     {
    //       oracle_text: "Haste. Whenever Goblin Guide attacks, defending player reveals the top card of their library",
    //       image_url: "",
    //     }
    //   ]
    // },
    // {
    //   card_name: 'Lightning Bolt',
    //   set_type: 'Instant',
    //   text: 'Lightning Bolt deals 3 damage to any target.',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://cards.scryfall.io/large/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721'
    // },
    // {
    //   card_name: 'Snapcaster Mage',
    //   set_type: 'Creature',
    //   text: 'Flash. When Snapcaster Mage enters the battlefield, target instant or sorcery card in your graveyard gains flashback until end of turn. The flashback cost is equal to its mana cost.',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://cards.scryfall.io/large/front/2/b/2b73d294-6ab1-4051-9b0f-d8e335d37674.jpg?1626097096'
    // },
    // {
    //   card_name: 'Remand',
    //   set_type: 'Instant',
    //   text: 'Counter target spell. If that spell is countered this way, put it into its owners hand instead of into that players graveyard.',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://miro.medium.com/max/672/0*WtTRy5c4r3h_JFVB.jpg'
    // },
    // {
    //   card_name: 'Bloodbraid Elf',
    //   set_type: 'Creature',
    //   text: 'Haste. Cascade',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    // },
    // {
    //   card_name: 'Tarmogoyf',
    //   set_type: 'Creature',
    //   text: 'Tarmogoyfs power is equal to the number of card types among cards in all graveyards and its toughness is equal to that number plus 1.',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://cdn1.dotesports.com/wp-content/uploads/2021/07/27155700/Irencrag-Pyromancer.jpg'
    // },
    // {
    //   card_name: 'Liliana of the Veil',
    //   set_type: 'Planeswalker',
    //   text: '+1: Each player discards a card. -2: Target player sacrifices a creature. -6: Separate all permanents target player controls into two piles. That player sacrifices all permanents in the pile of their choice.',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://media.wizards.com/2017/xln/en_yIHG7SYDro.png'
    // },
    // {
    //   card_name: 'Bloodbraid Elf',
    //   set_type: 'Creature',
    //   text: 'Haste. Cascade',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    // },
    // {
    //   card_name: 'Bloodbraid Elf',
    //   set_type: 'Creature',
    //   text: 'Haste. Cascade',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    // },
    // {
    //   card_name: 'Bloodbraid Elf',
    //   set_type: 'Creature',
    //   text: 'Haste. Cascade',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    // },
    // {
    //   card_name: 'Bloodbraid Elf',
    //   set_type: 'Creature',
    //   text: 'Haste. Cascade',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    // },
    // {
    //   card_name: 'Bloodbraid Elf',
    //   set_type: 'Creature',
    //   text: 'Haste. Cascade',
    //   rarity: "rare",
    //   released_at: "2022-04-29",
    //   prices: "1",
    //   image_url: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    // }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
