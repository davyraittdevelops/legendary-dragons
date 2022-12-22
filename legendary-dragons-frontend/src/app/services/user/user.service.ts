import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { UserModel } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private user: UserModel = {
    name: "",
    email: ""
  }

  constructor(private readonly http: HttpClient) {
  }

  registerUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>('/account/api/users', user);
  }

  loginUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>('/account/api/users/login', user);
  }

  getUserById(email: string): Observable<UserModel> {
    return this.http.get<UserModel>('/account/api/user/' + email);
  }

  setUsername(userName: string) {
    this.user.name = userName;
  }

  setUserEmail(email: string) {
    this.user.email = email;
  }

  getUserEmail() {
    return this.user.email;
  }

  getUsername() {
    return of(this.user.name);
  }
}
