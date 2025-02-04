import { TestBed } from '@angular/core/testing';

import { SerialConnectionService } from './serial-connection.service';

describe('SerialConnectionService', () => {
  let service: SerialConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerialConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
