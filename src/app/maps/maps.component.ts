import { Component, OnInit, Input } from '@angular/core';
import { MapLayerMouseEvent } from 'mapbox-gl';
import { MapStateService } from '../services/map-state.service';
import { ICOVIDPerCountryReport, IPerStateTestReport, IUsCasesTestingProgression } from '../models/covid.interface';
import { ArchiveHttp } from 'ants-protocol-sdk';
import { MatSelectChange } from '@angular/material/select';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { NetworkCurrencyPublic } from 'symbol-sdk';

interface Source {
  type: string,
  data: any
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  name: string;
}

export interface RootObject {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

interface GeoJSONGeometry {
  type: string;
  coordinates: number[];
}

interface GeoJSONFeature {
  type: string;
  properties: {};
  geometry: GeoJSONGeometry;
}

interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @Input() covidPoints: ICOVIDPerCountryReport[];

  title = 'covid-tracker-gui';

  archiveHttp: ArchiveHttp
  archiveName = 'covidtrackertest'
  schemaName = 'covid';
  totalDeath = 0;
  totalConfirmed = 0;
  totalRecovery = 0;
  reportHash = '';
  reportDate = '';
  reporter = '';
  verfied = false;
  data: Source;
  feature: any;
  loaded = false;
  source = '';
  filter = 'confirmed';
  datasetType = 'covid';
  currentlySelectedPlace: ICOVIDPerCountryReport;
  paint: any;

  onClick(evt: MapLayerMouseEvent) {
    this.currentlySelectedPlace = evt.features![0].properties as ICOVIDPerCountryReport;
    this.bottomSheet.open(MapPopupComponent, { data: this.currentlySelectedPlace });
  }
  constructor(private mapState: MapStateService, private bottomSheet: MatBottomSheet) {
    this.mapState.getSelectedPaintType().subscribe((theme) => this.paint = theme);
    this.mapState.setPaintType(this.filter);
  }

  ngOnInit() {
    const geo = this.toGeoJson(this.covidPoints);
    this.mapState.setPaintType(this.datasetType);
    this.data =
    {
      type: 'geojson',
      data: geo
    }
  }


  onPaintFilter(event: MatSelectChange) {
    this.mapState.setPaintType(event.value);
  }

  toGeoJson(objects: ICOVIDPerCountryReport[]): GeoJSON {
    const features: GeoJSONFeature[] = []
    for (let report of objects) {
      features.push(
        {
          type: 'Feature',
          properties: report,
          geometry: { type: 'Point', coordinates: [parseFloat(report.longitude), parseFloat(report.latitude)] }
        }
      )
    }

    return {
      type: 'FeatureCollection',
      features: features
    }
  }

}
