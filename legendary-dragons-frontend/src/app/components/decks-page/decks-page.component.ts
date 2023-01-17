import { Component, OnInit } from '@angular/core';
import {Deck} from "../../models/deck.model";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { createDeck } from 'src/app/ngrx/deck/deck.actions';

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
      deck_cards: [],
      side_deck: {
        deck_cards: [],
        last_modified: new Date("2019-01-16"),
        created_at: new Date("2019-01-16")
      }
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'Commander',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      deck_cards: [],
      side_deck: {
        deck_cards: [],
        last_modified: new Date("2019-01-16"),
        created_at: new Date("2019-01-16")
      }
    },
    {
      name: 'Mono Deck',
      deck_type: 'Commanders',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      deck_cards: [],
      side_deck: {
        deck_cards: [],
        last_modified: new Date("2019-01-16"),
        created_at: new Date("2019-01-16")
      }
    },
    {
      name: 'Vampire Deck',
      deck_type: 'EDG',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      deck_cards: [],
      side_deck: {
        deck_cards: [],
        last_modified: new Date("2019-01-16"),
        created_at: new Date("2019-01-16")
      }
    },
    {
      name: 'Grixis Midrange',
      deck_type: 'Commander',
      total_value: '1000000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      deck_cards: [],
      side_deck: {
        deck_cards: [],
        last_modified: new Date("2019-01-16"),
        created_at: new Date("2019-01-16")
      }
    },
    {
      name: 'Mono Deck',
      deck_type: 'EDH',
      total_value: '10',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      deck_cards: [],
      side_deck: {
        deck_cards: [],
        last_modified: new Date("2019-01-16"),
        created_at: new Date("2019-01-16")
      }
    },
    {
      name: 'Vampire Deck',
      deck_type: 'EDH',
      total_value: '60000',
      created_at: new Date("2019-01-16"),
      last_modified: new Date("2019-01-16"),
      image_url: 'https://www.bazaargames.nl/images/cards/l/zen/goblin_guide.jpg',
      deck_cards: [],
      side_deck: {
        deck_cards: [],
        last_modified: new Date("2019-01-16"),
        created_at: new Date("2019-01-16")
      }
    }
  ]

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    decktype: new FormControl('', Validators.required)
  })

  constructor(public modalService: NgbModal, private appStore: Store<AppState>) { }

  ngOnInit(): void {
  }

  open({content}: { content: any }) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'm'});
  }

  get name() {
    return this.form.controls?.['name'];
  }

  get type() {
    return this.form.controls?.['decktype'];
  }

  addDeck(): void {
    if (this.form.invalid) {
      return;
    }

    this.appStore.dispatch(createDeck({deck_name: this.name.value!, deck_type: this.type.value!}))
  }
}
