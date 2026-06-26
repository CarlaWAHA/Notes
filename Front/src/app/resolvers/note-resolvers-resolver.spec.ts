import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { noteResolversResolver } from './note-resolvers-resolver';

describe('noteResolversResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => noteResolversResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
