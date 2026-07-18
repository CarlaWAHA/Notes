import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { EditableTextComponent } from './editableTextComponent';
import { SiteContentService } from '../Services/site-content.service';

describe('EditableTextComponent', () => {
  const getContentValue = jest.fn();
  const updateContentValue = jest.fn();

  beforeEach(async () => {
    getContentValue.mockReset();
    updateContentValue.mockReset();
    getContentValue.mockReturnValue(of({ key: 'tc.home.hero', value: 'Stored value' }));
    updateContentValue.mockReturnValue(of({ key: 'tc.home.hero', value: 'Updated value' }));

    await TestBed.configureTestingModule({
      imports: [EditableTextComponent],
      providers: [
        {
          provide: SiteContentService,
          useValue: { getContentValue, updateContentValue },
        },
      ],
    }).compileComponents();
  });

  it('loads stored content value', () => {
    const fixture = TestBed.createComponent(EditableTextComponent);
    fixture.componentRef.setInput('contentKey', 'tc.home.hero');
    fixture.componentRef.setInput('defaultValue', 'Default');
    fixture.detectChanges();

    expect(fixture.componentInstance.currentValue).toBe('Stored value');
  });

  it('updates content value on save', () => {
    const fixture = TestBed.createComponent(EditableTextComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('contentKey', 'tc.home.hero');
    fixture.componentRef.setInput('defaultValue', 'Default');
    fixture.detectChanges();

    component.startEdit();
    component.draftValue = 'Updated value';
    component.save();

    expect(updateContentValue).toHaveBeenCalledWith('tc.home.hero', 'Updated value');
    expect(component.currentValue).toBe('Updated value');
  });

  it('falls back to default value when load fails', () => {
    getContentValue.mockReturnValueOnce(throwError(() => new Error('fail')));
    const fixture = TestBed.createComponent(EditableTextComponent);
    fixture.componentRef.setInput('contentKey', 'tc.home.hero');
    fixture.componentRef.setInput('defaultValue', 'Default');
    fixture.detectChanges();

    expect(fixture.componentInstance.currentValue).toBe('Default');
  });
});
