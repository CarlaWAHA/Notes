import { ComponentFixture, TestBed } from '@angular/core/testing';

import { noteListComponent } from './noteListComponent';

describe('NoteListComponent', () => {
  let component: noteListComponent;
  let fixture: ComponentFixture<noteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [noteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(noteListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
