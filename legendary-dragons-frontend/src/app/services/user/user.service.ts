import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User, UserRegistration } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient) {}

  registerUser(user: UserRegistration): Observable<UserRegistration> {
    return this.http.post<UserRegistration>(`/users/register`, user);
  }

  loginUser(email: string, password: string): Observable<HttpResponse<User>> {
    return this.http.post<User>(
      `/users/login`,
      {email, password},
      {observe: 'response'}
    );
  }
}
