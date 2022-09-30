import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class GeoMath {

    constructor(
    ) {

    }

    public getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        console.log('lat1:', lat1)
        console.log('lon1:', lon1);
        console.log('lat2:', lat2);
        console.log('lon2:', lon2)

        // haversine formular
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km

        console.log('Distance:', d)
        return d;
    }

    private deg2rad(deg: number) {
        return deg * (Math.PI / 180)
    }

    public get_ETA(s: any, d: number) {
        // s = d / t
        // t = d / s

        // ms to km/h
        // multiply the speed value by 3,6
        s *= 3.6;
        var t = d / s;
        var minutes = Math.floor(t / 60);
        var seconds = t - minutes * 60;
        var hours = Math.floor(t / 3600);

        let _ETA = {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };

        return _ETA;
    }

}