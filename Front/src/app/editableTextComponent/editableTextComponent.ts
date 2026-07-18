import { Component, EventEmitter, inject, Input, OnChanges, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteContentService } from '../Services/site-content.service';

@Component({
  selector: 'app-editable-text',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="group relative" (mouseenter)="isHovered = true" (mouseleave)="isHovered = false">
      <p *ngIf="!isEditing" class="text-neutral-700" [class.text-lg]="large">{{ currentValue }}</p>

      <button
        *ngIf="isAdmin && !isEditing && isHovered"
        type="button"
        (click)="startEdit()"
        class="absolute -right-2 -top-2 rounded-full border border-red-200 bg-white p-2 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-50"
        aria-label="Modifier ce texte"
      >
        ✎
      </button>

      <div *ngIf="isEditing" class="space-y-3 rounded-xl border border-red-200 bg-red-50/40 p-3">
        <textarea
          [(ngModel)]="draftValue"
          rows="4"
          class="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200"
        ></textarea>
        <div class="flex gap-2">
          <button type="button" (click)="save()" class="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-black">Valider</button>
          <button type="button" (click)="cancel()" class="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">Annuler</button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EditableTextComponent implements OnChanges {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly contentService = inject(SiteContentService);

  @Input() contentKey = '';
  @Input() defaultValue = '';
  @Input() isAdmin = false;
  @Input() large = false;
  @Output() valueChange = new EventEmitter<string>();

  currentValue = '';
  draftValue = '';
  isEditing = false;
  isHovered = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultValue'] || changes['contentKey']) {
      this.loadValue();
    }
  }

  private loadValue(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.currentValue = this.defaultValue;
      this.draftValue = this.defaultValue;
      return;
    }

    if (!this.contentKey) {
      this.currentValue = this.defaultValue;
      this.draftValue = this.defaultValue;
      return;
    }

    this.contentService.getContentValue(this.contentKey, this.defaultValue).subscribe({
      next: (response) => {
        this.currentValue = response.value;
        this.draftValue = response.value;
      },
      error: () => {
        this.currentValue = this.defaultValue;
        this.draftValue = this.defaultValue;
      }
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.draftValue = this.currentValue;
  }

  cancel(): void {
    this.isEditing = false;
    this.draftValue = this.currentValue;
  }

  save(): void {
    const value = this.draftValue.trim();
    if (!value) {
      return;
    }

    if (!this.contentKey || !isPlatformBrowser(this.platformId)) {
      this.currentValue = value;
      this.valueChange.emit(this.currentValue);
      this.isEditing = false;
      return;
    }

    this.contentService.updateContentValue(this.contentKey, value).subscribe({
      next: (response) => {
        this.currentValue = response.value;
        this.valueChange.emit(this.currentValue);
        this.isEditing = false;
      },
      error: () => {
        this.isEditing = false;
      }
    });
  }
}
