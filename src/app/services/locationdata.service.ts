import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class LocationdataService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
    
    private source = new  BehaviorSubject('');
    private destination = new  BehaviorSubject('');
    private source_id = new  BehaviorSubject('');
    private destination_id = new  BehaviorSubject('');
    private entdate = new  BehaviorSubject('');
    

  constructor(private httpClient: HttpClient) { 
  }

  currentsource = this.source.asObservable();
  currentdestination = this.destination.asObservable();
  currentsource_id = this.source_id.asObservable();
  currentdestination_id = this.destination_id.asObservable();
  currententdate = this.entdate.asObservable();

    setSource(s: any) {

       this.source.next(s);
    }

    setDestination(d: any) {
      this.destination.next(d);
    }

    setSourceID(s_id: any) {

      this.source_id.next(s_id);
   }

   setDestinationID(d_id: any) {
     this.destination_id.next(d_id);
   }

    setDate(dat: any) {
      this.entdate.next(dat);
    }

  

  all(val :any): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/getLocation?locationName=' + val,  this.httpOptions)
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
