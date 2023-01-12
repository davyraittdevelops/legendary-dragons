import { Component, OnInit } from '@angular/core';
import {Deck} from "../../models/deck.model";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-decks-page',
  templateUrl: './decks-page.component.html',
  styleUrls: ['./decks-page.component.scss']
})
export class DecksPageComponent implements OnInit {
  public decks: Deck[] = [
    {
      name: 'Grixis Midrange',
      deck_type: 'Commander',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      cards: []
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'Commander',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      cards: []
    },
    {
      name: 'Mono Deck',
      deck_type: 'Commanders',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      cards: []
    },
    {
      name: 'Vampire Deck',
      deck_type: 'EDG',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      cards: []
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'Commander',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      cards: []
    },
    {
      name: 'Mono Deck',
      deck_type: 'EDH',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      cards: []
    },
    {
      name: 'Vampire Deck',
      deck_type: 'EDH',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      cards: []
    }
  ]

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    decktype: new FormControl('', Validators.required)
  })

  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open({content}: { content: any }) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'm'});
  }
}
