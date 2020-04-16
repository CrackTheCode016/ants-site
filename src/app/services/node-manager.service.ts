import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, mergeMap, toArray, concatMap, catchError } from 'rxjs/operators';
import { NodeRepository, NodeHttp, NodeHealth, NodeInfo, ChainHttp } from 'symbol-sdk';

export interface NodeSelected {
  node: string;
}

export interface NodeStatus {
  node: string;
  up: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NodeManagerService {

  private nodes: NodeSelected[] = [
    { node: 'http://178.128.184.107:3000' },
    { node: 'http://devnet-api.48gh23s.xyz:3000' },
    { node: 'http://198.199.80.167:3000' }];

  private selectedNode: NodeSelected = this.nodes[0];

  constructor() {
  }

  public checkStatus(): Observable<NodeStatus[]> {
    let currNode;
    return from(this.nodes).pipe(
      concatMap((node) => {
        currNode = node.node;
        return new ChainHttp(node.node).getBlockchainHeight()
          .pipe(
            map((val) => val),
            catchError((err) => of(err))
          );
      }),
      map((val) => {
        if (val instanceof Error) {
          return { node: currNode, up: false };
        }
        return { node: currNode, up: true };
      }),
      toArray()
    )
  }

  public setNode(ip: string) {
    this.selectedNode = { node: ip }
  }

  public getSelectedNode(): NodeSelected {
    return this.selectedNode
  }

  public getNodeList(): NodeSelected[] {
    return this.nodes;
  }
}
