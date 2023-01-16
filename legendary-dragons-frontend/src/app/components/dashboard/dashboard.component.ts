import { Component, OnInit } from '@angular/core';
import { WebsocketService } from "../../services/websocket/websocket.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(private websocketService : WebsocketService) { }

  ngOnInit(): void {
    this.websocketService.dataUpdates$().subscribe(() => {})
  }
}
