import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BookingComponent } from './booking.component';

@NgModule({
  imports: [ BrowserModule,FormsModule],
  bootstrap: [BookingComponent],
  declarations: [
    BookingComponent
  ]
})
export class BookingModule { }

