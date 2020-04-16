import { Component, OnInit } from '@angular/core';
import { MapLayerMouseEvent } from 'mapbox-gl';
import { MapStateService } from '../services/map-state.service';
import { ICOVIDPerCountryReport, IPerStateTestReport, IUsCasesTestingProgression } from '../models/covid.interface';
import { ArchiveHttp } from 'ants-protocol-sdk';
import { MatSelectChange } from '@angular/material/select';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MapPopupComponent } from '../map-popup/map-popup.component';

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
export class MapsComponent {

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
  allReports: ICOVIDPerCountryReport[] | IPerStateTestReport[]

  onClick(evt: MapLayerMouseEvent) {
    this.currentlySelectedPlace = evt.features![0].properties as ICOVIDPerCountryReport;
    this.bottomSheet.open(MapPopupComponent, { data: this.currentlySelectedPlace });
  }
  constructor(private mapState: MapStateService, private bottomSheet: MatBottomSheet) {

    this.mapState.getSelectedPaintType().subscribe((theme) => this.paint = theme);
    this.mapState.setPaintType(this.filter);
    this.archiveHttp = new ArchiveHttp('http://198.199.80.167:3000');
    this.loadJsuData()
  }


  onPaintFilter(event: MatSelectChange) {
    this.mapState.setPaintType(event.value);
  }

  onDatasetChange(event: MatSelectChange) {
    console.log(event);
    if (event.value === 'covid') {
      this.loadJsuData();
    } else {
      this.loadUsData();
    }
  }


  loadUsData() {
    this.loaded = false;
    this.archiveHttp.getAllReports(this.archiveName, 'uscovid')
      .subscribe((reports) => {
        const covidReports: IPerStateTestReport[] = [];

        const latestDate = new Date(Math.max.apply(null, reports.map((r) => new Date(r.timestamp))));
        console.log("LATEST: " + latestDate)
        reports.map((v) => console.log(v.timestamp))
        const latestReport = reports.find((report) => report.timestamp === latestDate.toUTCString());
        console.log(latestReport)
        this.reportDate = latestDate.toString();
        this.reportHash = latestReport.hash;
        this.reporter = latestReport.senderAddress.pretty();

        const perState = latestReport.getValueByKey('perStateReport') as IPerStateTestReport[];
        perState.forEach((point) => covidReports.push(point));

        console.log(perState);
        this.loaded = true;
      });
  }

  loadJsuData() {
    this.archiveHttp.getAllReports(this.archiveName, 'covid')
      .subscribe((reports) => {
        let covidReports: ICOVIDPerCountryReport[] = [];

        const latestDate = new Date(Math.max.apply(null, reports.map((r) => new Date(r.timestamp))))
        const latestReport = reports.find((report) => report.timestamp === latestDate.toString());

        this.reportDate = latestDate.toString();
        this.reportHash = latestReport.hash;
        this.reporter = latestReport.senderAddress.pretty();
        console.log(latestReport.hash);
        this.totalConfirmed = latestReport.getValueByKey('totalGlobalInfected') as number;
        this.totalDeath = latestReport.getValueByKey('totalGlobalDeathCount') as number;
        this.totalRecovery = latestReport.getValueByKey('totalGlobalRecovered') as number;
        const perCountry = latestReport.getValueByKey('covidCountryReport') as ICOVIDPerCountryReport[];
        perCountry.forEach((point) => covidReports.push(point));

        covidReports = covidReports.filter((c) => c.confirmed !== 0);
        this.currentlySelectedPlace = covidReports[0];
        this.allReports = covidReports;
        const geo = this.toGeoJson(covidReports)
        this.data =
        {
          type: 'geojson',
          data: geo
        }
        this.loaded = true
      });
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
