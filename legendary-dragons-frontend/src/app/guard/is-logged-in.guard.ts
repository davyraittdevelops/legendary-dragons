import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { AppState } from '../app.state';
import { isLoggedInSelector } from '../ngrx/user/user.selectors';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  constructor(private appStore: Store<AppState>, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.appStore.select(isLoggedInSelector).pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          return this.router.parseUrl('/login')
        }

        return isLoggedIn;
      })
    );
  }
}
