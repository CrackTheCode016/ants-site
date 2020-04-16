import { Component, OnInit } from '@angular/core';
import { ArchiveHttp } from 'ants-protocol-sdk';
import { ICOVIDPerCountryReport, IPerStateTestReport, IUsCasesTestingProgression } from '../models/covid.interface';

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})
export class CovidComponent implements OnInit {
  archiveHttp: ArchiveHttp
  archiveName = 'covidtrackertest';
  totalDeath = 0;
  totalConfirmed = 0;
  totalRecovery = 0;
  totalActive = 0;

  UStotalDeath = 0;
  UStotalConfirmed = 0;
  UStotalRecovery = 0;
  USIcu = 0;
  USVent = 0;

  worldWidereportHash = '';
  worldWideReportUpload = '';
  worldWideReporter = '';
  worldWideSender = '';
  USreportHash = '';
  USReportUpload = '';
  USReporter = '';
  USSender = '';
  verfied = false;
  loaded = false;
  paint: any;

  botNameMap: {
    'TDXELMSWWES7TV6GQWXYIQ5PLOAVNHRPZ5RSFKD2': 'ants-jsu-covid-bot',
    'TBYKY5JIX3TSI6FBQYJHDOSQVMMRENKWYXAM43F4': 'ants-uscovid-bot',
  };

  allReports: ICOVIDPerCountryReport[] = [];
  constructor() {
    this.archiveHttp = new ArchiveHttp('http://198.199.80.167:3000');
    this.loadUsData();
    this.loadJsuData();
  }
  loadUsData() {
    this.archiveHttp.getAllReports(this.archiveName, 'uscovid')
      .subscribe((reports) => {
        const covidReports: IPerStateTestReport[] = [];

        const latestDate = new Date(Math.max.apply(null, reports.map((r) => new Date(r.timestamp))));
        reports.map((v) => console.log(v.timestamp))
        const latestReport = reports.find((report) => report.timestamp === latestDate.toString());
        console.log(latestReport)
        this.USReportUpload = latestDate.toString();
        this.USreportHash = latestReport.hash.substring(0, 5);;

        const perState = latestReport.getValueByKey('perStateReport') as IPerStateTestReport[];

        const US = latestReport.getValueByKey('usOverallTestingProgression') as IUsCasesTestingProgression;
        perState.forEach((point) => covidReports.push(point));

        this.UStotalConfirmed = US.positive;
        this.UStotalDeath = US.death;
        this.UStotalRecovery = US.recovered;
        this.USIcu = US.inIcuCurrently;
        this.USVent = US.onVentilatorCurrently;

        if (latestReport.senderAddress.plain() === 'TBYKY5JIX3TSI6FBQYJHDOSQVMMRENKWYXAM43F4') {
          this.USSender = 'ants-uscovid-bot';
        }
        console.log(this.botNameMap[latestReport.senderAddress.plain()])

      });
  }

  loadJsuData() {
    this.archiveHttp.getAllReports(this.archiveName, 'covid')
      .subscribe((reports) => {
        let covidReports: ICOVIDPerCountryReport[] = [];

        const latestDate = new Date(Math.max.apply(null, reports.map((r) => new Date(r.timestamp))))
        const latestReport = reports.find((report) => report.timestamp === latestDate.toString());

        this.worldWideReportUpload = latestDate.toString();
        this.worldWidereportHash = latestReport.hash.substring(0, 5);
        console.log(latestReport.hash);
        this.totalConfirmed = latestReport.getValueByKey('totalGlobalInfected') as number;
        this.totalDeath = latestReport.getValueByKey('totalGlobalDeathCount') as number;
        this.totalRecovery = latestReport.getValueByKey('totalGlobalRecovered') as number;
        this.totalActive = this.totalConfirmed - this.totalRecovery;
        if (latestReport.senderAddress.plain() === 'TDXELMSWWES7TV6GQWXYIQ5PLOAVNHRPZ5RSFKD2') {
          this.worldWideSender = 'ants-jsu-covid-bot';
        }
        const perCountry = latestReport.getValueByKey('covidCountryReport') as ICOVIDPerCountryReport[];
        perCountry.forEach((point) => covidReports.push(point));
        covidReports = covidReports.filter((c) => c.confirmed !== 0);
        this.allReports = covidReports;
        this.loaded = true;
      });
  }


  ngOnInit(): void {
  }

}
