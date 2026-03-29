import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SearchRepository } from '@drc/shared/contracts';

@Component({
  selector: 'drc-repository-card',
  imports: [],
  templateUrl: './repository-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryCardComponent {
  readonly repository = input.required<SearchRepository>();

  protected readonly avatarUrl = computed<string | undefined>(
    () => this.repository().owner?.avatarUrl,
  );
  protected readonly avatarAlt = computed<string>(
    () => `${this.repository().owner?.login || 'Owner'} avatar`,
  );

  protected getTopicUrl(topic: string): string {
    return `https://github.com/topics/${topic}`;
  }
}
