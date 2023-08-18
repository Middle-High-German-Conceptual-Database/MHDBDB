import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DhppbaseAppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(DhppbaseAppModule)
  .catch(err => console.error(err));
