import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-covid-stat',
  templateUrl: './covid-stat.component.html',
  styleUrls: ['./covid-stat.component.scss']
})
export class CovidStatComponent implements OnInit {

  @Input() footerName = '';
  @Input() headerCount = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
