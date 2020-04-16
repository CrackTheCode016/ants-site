import { TestBed } from '@angular/core/testing';

import { NodeManagerService } from './node-manager.service';

describe('NodeManagerService', () => {
  let service: NodeManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
