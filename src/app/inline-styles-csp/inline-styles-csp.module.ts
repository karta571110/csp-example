import { NgModule } from '@angular/core';
import { ɵSharedStylesHost } from '@angular/platform-browser';
import { CustomDomSharedStylesHost } from './shared_styles_host';

/** Csp行內樣式模組 */
@NgModule({
  providers: [
    {
      provide: 'cspMetaSelector',
      useValue: 'meta[name="CSP-NONCE"]',
    },
    {
      provide: ɵSharedStylesHost,
      useClass: CustomDomSharedStylesHost,
    },
  ],
})
export class InlineStylesCspModule {}
