import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, of, share } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { logoutUser } from 'src/app/ngrx/user/user.actions';
import { ToastService } from 'src/app/services/toast/toast.service';
import { WebsocketService } from "../../../services/websocket/websocket.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(private websocketService : WebsocketService, public toastService: ToastService,
              private router: Router, private appStore: Store<AppState>) { }

  ngOnInit(): void {
    this.websocketService.dataUpdates$().pipe(
      share(),
      catchError((error) => {
        // Token expired
        // if (!('reason' in error)) {
        //   this.appStore.dispatch(logoutUser());
        //   this.router.navigate(["/login"]);
        // }

        return of(error);
      })
    ).subscribe();
  }
}
