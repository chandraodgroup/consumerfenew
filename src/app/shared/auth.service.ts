import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';

// User interface
export class User {
  email: any;
  phone: any;
  password: any;
  password_confirmation: any
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  signin(user: User): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/login/', user ,  this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  

  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }

}