import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { interval, Subscription } from 'rxjs';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { GeoMath } from '../services/geomath';

@Injectable()
export class GeolocationService {
    subscription: Subscription;
    intervalId: number;
    watch: any;
    compass_watch: any;

    public speed: BehaviorSubject<Number>;
    public lat: BehaviorSubject<Number>;
    public lng: BehaviorSubject<Number>;
    public direction: BehaviorSubject<Number>;
    Speed_watch: any;

    constructor(
        public zone: NgZone,
        private geolocation: Geolocation,
        private backgroundGeolocation: BackgroundGeolocation,
        private deviceOrientation: DeviceOrientation,
        private geomath: GeoMath
    ) {
        this.lat = new BehaviorSubject<Number>(Number(localStorage.getItem('last_lat')));
        this.lng = new BehaviorSubject<Number>(Number(localStorage.getItem('last_lng')));
        this.speed = new BehaviorSubject<Number>(0);
        this.direction = new BehaviorSubject<Number>(0);
    }

    //background
    start_background_tracking() {

        console.log('Start tracking user')

        // Background Tracking
        let config = {
            desiredAccuracy: 2,
            stationaryRadius: 2, //I reduce this from 20 to 2
            distanceFilter: 3, //I reduce this from 30 to 3
            notificationsEnabled: false, //hide static notifications
            debug: false, //  enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: true, // enable this to clear background location settings when the app terminates
            enableHighAccuracy: true,
        };

        this.backgroundGeolocation.configure(config)
            .then(() => {
                // Watch the device compass heading change
                this.compass_watch = this.deviceOrientation.watchHeading().subscribe(
                    (data: DeviceOrientationCompassHeading) => {
                        this.set_direction(data.magneticHeading);
                    }
                );
                // Turn ON the background-geolocation system.
                this.backgroundGeolocation.start();
            });

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {

            this.backgroundGeolocation.startTask().then(task => {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask
                // Run update inside of Angular's zone
                this.zone.run(async () => {

                    this.set_speed(await this.calculate_speed(location.latitude, location.longitude));
                    this.set_lat(location.latitude);
                    this.set_lng(location.longitude);

                    // console.log('Updating location in background', location);

                    const source = interval(1000);
                    this.subscription = source.subscribe(
                        //update_location to db here
                    );
                });
                this.backgroundGeolocation.endTask(task);
            });

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.stop).subscribe((location: BackgroundGeolocationResponse) => {
                console.log('Background location stopped!')
            });

            // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            this.backgroundGeolocation.finish(); // FOR IOS ONLY
        });
    }


    //forground
    start_foreground_tracking() {
        // Foreground Tracking
        let options = {
            frequency: 5000,
            enableHighAccuracy: true
        };

        this.watch = this.geolocation.watchPosition(options);
        this.watch.subscribe(async (position) => {

            // Run update inside of Angular's zone
            this.zone.run(async () => {
                this.set_speed(await this.calculate_speed(position.coords.latitude, position.coords.longitude))
                this.set_lat(position.coords.latitude);
                this.set_lng(position.coords.longitude);
            });
        });

        // Run update inside o Angular's zone
        this.zone.run(() => {
            const source = interval(1000);
            this.subscription = source.subscribe(
                //update_location to db here
            );
        })
    }

    async calculate_speed(lat2, lon2) {
        let lat1 = Number(localStorage.getItem('last_lat'));
        let lon1 = Number(localStorage.getItem('last_lng'));

        // s = d/t
        let t: number = 0.000277778 /*sec to hour*/;
        let d = this.geomath.getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);

        let s: number = Math.round(d / t);

        return s;
    }

    //getters and setters
    private set_speed(newValue): void {
        this.speed.next(newValue);
    }
    public get_speed(): Observable<Number> {
        return this.speed.asObservable();
    }
    private set_lat(newValue): void {
        this.lat.next(newValue);
        localStorage.setItem('last_lat', newValue);
    }
    public get_lat(): Observable<Number> {
        return this.lat.asObservable();
    }
    private set_lng(newValue): void {
        this.lng.next(newValue);
        localStorage.setItem('last_lng', newValue);
    }
    public get_lng(): Observable<Number> {
        return this.lng.asObservable();
    }
    private set_direction(newValue): void {
        this.direction.next(newValue);
        localStorage.setItem('direction', newValue);
    }
    public get_direction(): Observable<Number> {
        return this.direction.asObservable();
    }
}