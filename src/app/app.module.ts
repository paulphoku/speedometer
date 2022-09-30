import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { GeolocationService } from '../services/geolocation.service';
import { GeoMath } from '../services/geomath';

import { NgxGaugeModule } from 'ngx-gauge';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxGaugeModule
  ],
  providers: [
    //modules
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    //services
    GeolocationService,
    GeoMath,

    //Native plugins
    Geolocation,
    DeviceOrientation,
    BackgroundGeolocation
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
