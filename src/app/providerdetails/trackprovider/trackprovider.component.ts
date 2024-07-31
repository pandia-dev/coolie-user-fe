import { Component, OnInit } from '@angular/core';
import { MapboxService } from '../../mapbox.service';

@Component({
  selector: 'app-trackprovider',
  templateUrl: './trackprovider.component.html',
  styleUrl: './trackprovider.component.css'
})
export class TrackproviderComponent implements OnInit {

  constructor(private mapBoxservice:MapboxService){

  }

  ngOnInit(): void {
      this.mapBoxservice.initializeMap('mapContainer')
  }

 }
