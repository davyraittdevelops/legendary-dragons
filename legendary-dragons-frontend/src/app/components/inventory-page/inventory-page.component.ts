import { Component, OnInit } from '@angular/core';
import {Card} from "../../models/card.model";

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})

export class InventoryPageComponent implements OnInit {

  public CARD_DATA: Card[] = [
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
    },
    {
      name: 'Bloodbraid Elf',
      type: 'Creature',
      text: 'Haste. Cascade',
      cost: 3,
      power: 2,
      toughness: 2,
      imageUrl: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    },
    {
      name: 'Tarmogoyf',
      type: 'Creature',
      text: 'Tarmogoyfs power is equal to the number of card types among cards in all graveyards and its toughness is equal to that number plus 1.',
      cost: 2,
      power: 0,
      toughness: 1,
      imageUrl: 'https://cdn1.dotesports.com/wp-content/uploads/2021/07/27155700/Irencrag-Pyromancer.jpg'
    },
    {
      name: 'Liliana of the Veil',
      type: 'Planeswalker',
      text: '+1: Each player discards a card. -2: Target player sacrifices a creature. -6: Separate all permanents target player controls into two piles. That player sacrifices all permanents in the pile of their choice.',
      cost: 3,
      power: 0,
      toughness: 0,
      imageUrl: 'https://media.wizards.com/2017/xln/en_yIHG7SYDro.png'
    },
    {
      name: 'Bloodbraid Elf',
      type: 'Creature',
      text: 'Haste. Cascade',
      cost: 3,
      power: 2,
      toughness: 2,
      imageUrl: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    },
    {
      name: 'Bloodbraid Elf',
      type: 'Creature',
      text: 'Haste. Cascade',
      cost: 3,
      power: 2,
      toughness: 2,
      imageUrl: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    },
    {
      name: 'Bloodbraid Elf',
      type: 'Creature',
      text: 'Haste. Cascade',
      cost: 3,
      power: 2,
      toughness: 2,
      imageUrl: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    },
    {
      name: 'Bloodbraid Elf',
      type: 'Creature',
      text: 'Haste. Cascade',
      cost: 3,
      power: 2,
      toughness: 2,
      imageUrl: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    },
    {
      name: 'Bloodbraid Elf',
      type: 'Creature',
      text: 'Haste. Cascade',
      cost: 3,
      power: 2,
      toughness: 2,
      imageUrl: 'https://images.saymedia-content.com/.image/t_share/MTc0NDYwNzc3ODAxODUyMjY0/top-magic-the-gathering-cards-of-all-time.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
