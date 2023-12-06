import { TestBed } from '@angular/core/testing';

import { AlarmGroupService } from './alarm-group.service';

describe('AlarmGroupService', () => {
  let service: AlarmGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlarmGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
