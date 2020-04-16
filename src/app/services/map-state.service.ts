import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  private types = {
    deaths:
    {
      'heatmap-opacity': 0.6,
      'heatmap-weight': {
        property: 'deaths',
        type: 'exponential',
        stops: [
          [1, 0],
          [62, 3]
        ]
      },
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(242,240,247,0)',
        0.2, 'rgb(203,201,226)',
        0.4, 'rgb(158,154,200)',
        0.6, 'rgb(117,107,177)',
        0.8, 'rgb(84,39,143)'
      ],

    },
    confirmed:
    {
      'heatmap-opacity': 0.6,
      'heatmap-weight': {
        property: 'confirmed',
        type: 'exponential',
        stops: [
          [1, 0],
          [62, 3]
        ]
      },
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(236,222,239,0)',
        0.2, 'rgb(255,255,178)',
        0.4, 'rgb(254,204,92)',
        0.6, 'rgb(253,141,60)',
        0.8, 'rgb(227,26,28)'
      ],
    },
    recovered:
    {
      'heatmap-opacity': 0.6,
      'heatmap-weight': {
        property: 'recovered',
        type: 'exponential',
        stops: [
          [1, 0],
          [62, 3]
        ]
      },
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(236,222,239,0)',
        0.2, 'rgb(208,209,230)',
        0.4, 'rgb(166,189,219)',
        0.6, 'rgb(103,169,207)',
        0.8, 'rgb(28,144,153)'
      ],
    }
  }

  private heatMapSubject = new BehaviorSubject<any>(this.types.confirmed);

  constructor() { }

  public setPaintType(paintName: string) {
    this.heatMapSubject.next(this.types[paintName]);
  }

  public getSelectedPaintType(): Observable<any> {
    return this.heatMapSubject;
  }
}
