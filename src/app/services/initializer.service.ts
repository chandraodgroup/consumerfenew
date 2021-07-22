import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import 'rxjs/add/operator/toPromise';
//import { map } from 'rxjs/operator/map';
//import { DeviceDetectorService } from 'ngx-device-detector';
import{ GlobalConstants } from '../constants/global-constants';

@Injectable()
export class AppInitializerService {



  constructor() {}

  load()
   {
    //GlobalConstants.ismobile  = this.deviceService.isMobile();   
    //alert(GlobalConstants.ismobile);  
  }
}