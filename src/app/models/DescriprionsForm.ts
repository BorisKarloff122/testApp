import {FormControl} from '@angular/forms';

export interface IDescriptionsForm {
  groupDescription: FormControl<string | null>,
  measurementDescription: FormControl<string | null>
}
