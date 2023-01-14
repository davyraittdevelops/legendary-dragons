import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { InventoryCard } from 'src/app/models/inventory.model';
import { removeCardFromInventory } from 'src/app/ngrx/inventory/inventory.actions';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {
  @Input() card!: InventoryCard;
  content: any;

  constructor(public modalService: NgbModal, private appStore: Store<AppState>) {
  }

  ngOnInit(): void {
  }

  open({content}: { content: any }) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  displayAvailablePrice(prices: any): string {
    let price = "Price not available";

    if (prices.eur !== null) {
      price = `€ ${prices.eur}`;
    } else if (prices.usd !== null) {
      price = `$ ${prices.usd}`;
    } else if (prices.tix !== null) {
      price = `${prices.tix} TIX`;
    }

    return price;
  }

  removeCardFromInventory(inventoryCardId: string) {
    console.log(inventoryCardId);
    this.appStore.dispatch(removeCardFromInventory({inventoryCardId: inventoryCardId}));
  }
}
