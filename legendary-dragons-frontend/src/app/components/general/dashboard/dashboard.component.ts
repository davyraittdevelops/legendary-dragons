import { Component, OnInit } from '@angular/core';
import { share } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.service';
import { WebsocketService } from "../../../services/websocket/websocket.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(private websocketService : WebsocketService, public toastService: ToastService) { }

  ngOnInit(): void {
    this.websocketService.dataUpdates$().pipe(share()).subscribe(() => {})
  }
}
