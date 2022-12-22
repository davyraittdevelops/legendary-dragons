import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { UserService } from "../services/user/user.service";

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.userService.getUsername()
      .pipe(
        map((username: string) => {
          if (username != "") {
            return true;
          }

          return this.router.parseUrl('/login');
        }),
        catchError((err) => {
          this.router.parseUrl('/login');
          return of(false);
        })
      );
  }
}
