const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "images/icon.png"), // Optional
    show: false, // Don't show until ready
  });

  // Load your existing index.html - THAT'S IT!
  win.loadFile("index.html");

  // Show when ready
  win.once("ready-to-show", () => {
    win.show();
  });

  // Optional: Hide menu bar for cleaner look
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
