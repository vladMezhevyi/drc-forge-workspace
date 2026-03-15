import { DOCUMENT, inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly document = inject(DOCUMENT);
  private readonly url =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
  private readonly dataAttr = 'data-drc-icons-link';

  loadIcons(): void {
    if (this.hasInjected()) return;

    const link = this.document.createElement('link');
    link.setAttribute(this.dataAttr, '');
    link.rel = 'stylesheet';
    link.href = this.url;

    this.document.head.appendChild(link);
  }

  private hasInjected(): boolean {
    return !!this.document.querySelector(`link[${this.dataAttr}]`);
  }
}
