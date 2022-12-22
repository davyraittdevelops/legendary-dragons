import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User, UserRegistration } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  constructor(private http: HttpClient) {}

  registerUser(user: UserRegistration): Observable<UserRegistration> {
    console.log(user)
    return this.http.post<UserRegistration>(`${environment.users_api_url}/users/register`,
      user , this.httpOptions);
  }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.users_api_url}/users/login`,
      {email, password}, this.httpOptions);
  }
}
