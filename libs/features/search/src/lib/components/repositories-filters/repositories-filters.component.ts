import {
  ChangeDetectionStrategy,
  Component,
  effect,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrcSelect } from '@drc/ui/select';

export const COUNTRIES = [
  { iso: 'AT', name: 'Austria', flag: '🇦🇹' },
  { iso: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { iso: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { iso: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { iso: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { iso: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { iso: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { iso: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { iso: 'FI', name: 'Finland', flag: '🇫🇮' },
  { iso: 'FR', name: 'France', flag: '🇫🇷' },
  { iso: 'DE', name: 'Germany', flag: '🇩🇪' },
  { iso: 'GR', name: 'Greece', flag: '🇬🇷' },
  { iso: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { iso: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { iso: 'IT', name: 'Italy', flag: '🇮🇹' },
  { iso: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { iso: 'PL', name: 'Poland', flag: '🇵🇱' },
  { iso: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { iso: 'RO', name: 'Romania', flag: '🇷🇴' },
  { iso: 'ES', name: 'Spain', flag: '🇪🇸' },
  { iso: 'SE', name: 'Sweden', flag: '🇸🇪' },
];

@Component({
  selector: 'drc-repositories-filters',
  imports: [DrcSelect, FormsModule],
  templateUrl: './repositories-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoriesFiltersComponent {
  protected readonly countries = COUNTRIES;
  protected readonly countryIso = signal<string>(this.countries[0].iso);

  protected readonly filteredCountries = signal(this.countries);

  constructor() {
    effect(() => console.log('Country: ', this.countryIso()));
  }

  protected onInput(value: string): void {
    if (!value) {
      this.filteredCountries.set(this.countries);
      return;
    }

    const filteredCountries = this.countries.filter((country) =>
      country.name.trim().startsWith(value.trim()),
    );
    this.filteredCountries.set(filteredCountries);
  }
}
