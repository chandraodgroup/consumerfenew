import { Component } from '@angular/core';
import{ GlobalConstants } from './constants/global-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'odbus';

  constructor() {

   // const isMobile = this.deviceService.isMobile();
    //GlobalConstants.ismobile = isMobile;
    //alert(isMobile);
  }
}
