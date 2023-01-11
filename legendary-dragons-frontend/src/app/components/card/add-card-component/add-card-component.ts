import { Component, OnInit } from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {Card} from "../../../models/card.model";
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-add-card-component',
  templateUrl: './add-card-component.html',
  styleUrls: ['./add-card-component.scss']
})

export class AddCardComponent implements OnInit {

  private closeResult: string = '';
  private filterValue: string = '';

  CARD_DATA: Card[] = [];
  displayedColumns: string[] = ['name', 'released', 'set', 'rarity', 'value', 'imageUrl', 'addCard'];
  dataSource = new MatTableDataSource(this.CARD_DATA);

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  searchCardsByKeyword() {

    this.websocketService.sendSearchCardByKeywordMessage('searchCardsByKeywordReq', this.filterValue);

    // todo when searching 2 times then the price is Undifined

    this.websocketService.dataUpdates$().subscribe((message) => {
      const eventType = message['event_type'];
      const eventData = message['data'];
      this.CARD_DATA = [];
      
      switch (eventType) {
        case 'SEARCH_CARD_RESULT':
          console.log('@@@@@@@@@' , this.CARD_DATA.length)
          for (const object of eventData) {
            let priceArray = object.prices;
            let set = object.set_type;
            let price = "Price not available";

            if (object.is_multifaced) {
              console.log(object)
            }

            if (priceArray.eur !== null) {
              price = "€" + priceArray.eur;
            } else if (priceArray.usd !== null) {
              price = "$" + priceArray.usd;
            } else if (priceArray.tix !== null) {
              price = "TIX: " + priceArray.tix;
            }

            const splitSet = set.toLowerCase().replace("_", " ").split(" ");

            for (let i = 0; i < splitSet.length; i++) {
              splitSet[i] = splitSet[i].charAt(0).toUpperCase() + splitSet[i].substring(1);
            }

            object.set_type = splitSet.join(' ');
            object.rarity = object.rarity.charAt(0).toUpperCase() + object.rarity.slice(1);;
            object.prices = price;
            this.CARD_DATA.push(object);
          }

          this.dataSource = new MatTableDataSource(this.CARD_DATA);
          break;
      }
    });
  }

  constructor(public modalService: NgbModal,  private websocketService : WebsocketService) { }

  ngOnInit(): void {

  }

  open({content}: { content: any }) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addCard(card: Card) {
    console.log(card)
  }
}
