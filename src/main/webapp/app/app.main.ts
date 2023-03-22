import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ProdConfig } from './blocks/config/prod.config';
import { DhppbaseAppModule } from './app.module';

declare global {
  interface Window {
    WebComponents: {
      ready: boolean;
    };
  }
}

ProdConfig();

if (module['hot']) {
  module['hot'].accept();
}

function bootstrapModule() {
  platformBrowserDynamic()
    .bootstrapModule(DhppbaseAppModule, { preserveWhitespaces: true })
    // eslint-disable-next-line no-console
    .then(() => console.log('Application started'))
    .catch(err => console.error(err));
}

//if (window.WebComponents.ready) {
  // Web Components are ready
  bootstrapModule();
//} else {
  // Wait for polyfills to load
//  window.addEventListener('WebComponentsReady', bootstrapModule);
//}

/*
platformBrowserDynamic()
  .bootstrapModule(DhppbaseAppModule, { preserveWhitespaces: true })
  // eslint-disable-next-line no-console
  .then(() => console.log('Application started'))
  .catch(err => console.error(err));
 */
