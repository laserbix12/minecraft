import { TestBed } from '@angular/core/testing';

import { Minecraft } from './minecraft';

describe('Minecraft', () => {
  let service: Minecraft;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Minecraft);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
