import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { UserModel } from 'src/app/models/user.model';
import { RegisterModel } from 'src/app/models/register.model';

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

  registerUser(register: RegisterModel): Observable<RegisterModel> {
    return this.http.post<RegisterModel>('https://ml16d2y5s9.execute-api.us-east-1.amazonaws.com/Prod/users/register', register);
  }

  loginUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>('https://ml16d2y5s9.execute-api.us-east-1.amazonaws.com/Prod/users/login', user);
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
