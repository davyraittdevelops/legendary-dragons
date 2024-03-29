import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { createDeck, getDecks, removeDeck } from 'src/app/ngrx/deck/deck.actions';
import { decksSelector, errorSelector, isLoadingSelector } from 'src/app/ngrx/deck/deck.selectors';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Deck } from "../../../models/deck.model";

@Component({
  selector: 'app-decks-page',
  templateUrl: './decks-page.component.html',
  styleUrls: ['./decks-page.component.scss']
})
export class DecksPageComponent implements OnInit {
  decks$: Observable<Deck[]>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    decktype: new FormControl('', Validators.required)
  })

  constructor(public modalService: NgbModal, private appStore: Store<AppState>, private toastService: ToastService) {
    this.decks$ = this.appStore.select(decksSelector);
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);

    this.appStore.dispatch(getDecks());
  }

  ngOnInit(): void {
  }

  open({content}: { content: any }) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'm'});
  }

  hasItems(totalValue: any): boolean {
    const values: string[] = Object.values(totalValue)
    return values.some((value: string) => +value > 0);
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

    this.appStore.dispatch(createDeck({deck_name: this.name.value!, deck_type: this.type.value!}));
    this.modalService.dismissAll();
    this.form.reset();
  }

  removeDeck(deck: Deck): void {
    if (this.hasItems(deck.total_value)) {
      this.toastService.showDanger(`Unable to delete deck! All cards located ${deck.deck_name} in needs to be removed first.`)
      return;
    }

    this.appStore.dispatch(removeDeck({deck_id: deck.deck_id}));
  }
}
