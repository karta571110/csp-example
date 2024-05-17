/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

export function styleInlineCsp(): void {
  const elPrototype = Element.prototype;
  const setAttribute = elPrototype.setAttribute;

  elPrototype.setAttribute = function replaceSetAttribute(
    qualifiedName: string,
    value: string
  ) {
    const setAttributeBind = setAttribute.bind(this);

    if (qualifiedName === 'style') {
      (this as HTMLElement).style.cssText = value;
    } else {
      setAttributeBind(qualifiedName, value);
    }
  };
}

styleInlineCsp();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
