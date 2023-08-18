(window as any).process = {
  env: { DEBUG: undefined }
};

import 'core-js/proposals/reflect-metadata';
import 'zone.js/dist/zone';
require('../manifest.webapp');
