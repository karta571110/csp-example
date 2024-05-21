import { InjectionToken } from '@angular/core';

/** Csp Meta 標籤選擇器 */
const CspMetaSelector = new InjectionToken<string>('cspMetaSelector', {
  providedIn: 'root',
  factory: () => '',
});

export { CspMetaSelector };
