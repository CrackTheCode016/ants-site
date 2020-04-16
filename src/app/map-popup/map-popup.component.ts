import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ICOVIDPerCountryReport } from '../models/covid.interface';

@Component({
  selector: 'app-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ICOVIDPerCountryReport,
    private bottomSheet: MatBottomSheetRef<MapPopupComponent>) { }

  ngOnInit(): void {
  }

}
