import { Component, OnInit } from '@angular/core';
import { NodeManagerService, NodeSelected, NodeStatus } from '../services/node-manager.service';

@Component({
  selector: 'app-landing-body',
  templateUrl: './landing-body.component.html',
  styleUrls: ['./landing-body.component.scss']
})
export class LandingBodyComponent implements OnInit {

  nodeStatues: NodeStatus[] = []
  filteredOnline: number;

  upDownMapping = {
    true: "Online",
    false: "Offline"
  };

  constructor(nodeChecker: NodeManagerService) {
    nodeChecker.checkStatus().subscribe((status) => {
      this.nodeStatues = status;
      this.filteredOnline = this.nodeStatues.filter((up) => up.up).length;
    });
  }

  ngOnInit(): void {
  }

}
