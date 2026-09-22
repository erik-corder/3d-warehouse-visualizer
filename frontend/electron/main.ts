import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { app, BrowserWindow } from 'electron';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Creates the application's main window.
 *
 * Secure defaults from the start (3DW-STORY-001B): contextIsolation and
 * sandbox are enabled and nodeIntegration is disabled, even though nothing
 * sensitive is exposed to the renderer yet.
 */
function createWindow(): void {
  const window = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void window.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void window.loadFile(path.join(dirname, '../renderer/index.html'));
  }
}

void app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
