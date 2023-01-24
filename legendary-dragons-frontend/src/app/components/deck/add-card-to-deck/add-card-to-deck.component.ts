import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { isDeckLoadingSelector } from 'src/app/ngrx/deck/deck.selectors';
import { AppState } from "../../../app.state";
import { errorSelector } from "../../../ngrx/inventory/inventory.selectors";
import { AddCardModalComponent } from '../add-card-modal/add-card-modal.component';

@Component({
  selector: 'app-add-card-to-deck',
  templateUrl: './add-card-to-deck.component.html',
  styleUrls: ['./add-card-to-deck.component.scss']
})
export class AddCardToDeckComponent implements OnInit {
  @Input('deck_name') deckName: string = '';
  @Input('deckCardsLimitReached') deckCardsLimitReached!: boolean;

  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  deckId: string = '';

  constructor(private appStore: Store<AppState>, public modalService: NgbModal,
              private activatedRoute: ActivatedRoute) {
    this.isLoading$ = this.appStore.select(isDeckLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.deckId = params["id"];
    });
  }

  open(): void {
    const modalRef = this.modalService.open(AddCardModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
    modalRef.componentInstance.deckCardsLimitReached = this.deckCardsLimitReached;
    modalRef.componentInstance.deckName = this.deckName;
    modalRef.componentInstance.deckId = this.deckId;
  }
}
