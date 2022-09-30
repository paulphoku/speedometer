import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../../services/geolocation.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  speed: any = 0;
  topspeed: Number = 0;
  distance: Number = 0;

  speedometer_options = {
    Type: 'arch',
    Label: "Speed",
    AppendText: "km/hr",
    size: 250,
    threshold: {
      '0': { color: 'green' },
      '80': { color: 'orange' },
      '120': { color: 'red' }
    },
    markers: {
      "10": { color: "#fff", type: "line", size: 8, label: "10", font: "12px arial", fontColor: '#fff' },
      "20": { color: "#fff", type: "line", size: 8, label: "20", font: "12px arial" },
      "30": { color: "#fff", type: "line", size: 8, label: "30", font: "12px arial" },
      "40": { color: "#fff", type: "line", size: 8, label: "40", font: "12px arial" },
      "50": { color: "#fff", type: "line", size: 8, label: "50", font: "12px arial" },
      "60": { color: "#fff", type: "line", size: 8, label: "60", font: "12px arial" },
      "70": { color: "#fff", type: "line", size: 8, label: "70", font: "12px arial" },
      "80": { color: "#fff", type: "line", size: 8, label: "80", font: "12px arial" },
      "90": { color: "#fff", type: "line", size: 8, label: "90", font: "12px arial" },
      "100": { color: "#fff", type: "line", size: 8, label: "100", font: "12px arial" },
      "110": { color: "#fff", type: "line", size: 8, label: "110", font: "12px arial" },
      "120": { color: "#fff", type: "line", size: 8, label: "120", font: "12px arial" },
      "130": { color: "#fff", type: "line", size: 8, label: "130", font: "12px arial" },
      "140": { color: "#fff", type: "line", size: 8, label: "140", font: "12px arial" },
      "150": { color: "#fff", type: "line", size: 8, label: "150", font: "12px arial" },
      "160": { color: "#fff", type: "line", size: 8, label: "160", font: "12px arial" },
    }
  }

  compass: Number = 10;
  compass_options = {
    Type: "arch",
    Label: "Speed",
    AppendText: "km/hr",
    size: 350,
    markers: {
      "10": { color: "#fff", type: "line", size: 10, label: "10", font: "12px arial" },
    }
  }

  constructor(
    private geo: GeolocationService
  ) {
    this.geo.get_speed().subscribe(s => {
      this.topspeed = s >= this.topspeed ? s : this.topspeed;
      this.speed = s
    })
  }

  reset() {
    this.speed = 0;
    this.topspeed = 0;
    this.distance = 0;
  }
}
