package main

import (
	"embed"
	"log"
	"runtime"

	"github.com/wailsapp/wails/v3/pkg/application"

	"chemlab/internal/app"
	"chemlab/internal/config"
	"chemlab/internal/logger"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	cfg, err := config.Load(config.DefaultPath())
	if err != nil {
		log.Printf("warning: failed to load config: %v", err)
	}
	if cfg == nil {
		cfg = config.Default()
	}
	if err := cfg.EnsureDirs(); err != nil {
		log.Printf("warning: failed to create data dirs: %v", err)
	}

	// Initialise the dual-writer (stderr + rotating file) logger before
	// anything else so early startup messages are captured.
	if err := logger.Init(cfg.DataDir, cfg.LogLevel); err != nil {
		log.Printf("warning: failed to init logger: %v", err)
	}

	state := app.New(cfg)

	wailsApp := application.New(application.Options{
		Name:        cfg.AppName,
		Description: "面向初中化学教学的交互式资源平台：实验仪器、试剂、分子结构、原子周期表与化学反应的 3D 课堂工作台。",
		Services: []application.Service{
			// Register each bound service here. The frontend calls their
			// exported methods through the generated bindings.
			// Persists the frontend's preferences (theme, general settings, …)
			// as a JSON bag in the app data dir.
			application.NewService(app.NewSettingsService(state)),
			// Exposes build-time version/commit/buildtime to the frontend.
			application.NewService(app.NewVersionService()),
			// Auto-update via GitHub Releases (lazy-inits on first call).
			application.NewService(app.NewUpdateService(state)),
			// Cross-platform "launch at login" control.
			application.NewService(app.NewAutostartService(state)),
		},
		// Single instance: a second launch brings the existing window to the
		// front instead of starting a new process.
		SingleInstance: &application.SingleInstanceOptions{
			UniqueID: "cn.chemlab.teach-assistant.single-instance",
			OnSecondInstanceLaunch: func(data application.SecondInstanceData) {
				state.ShowMainWindow()
			},
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			// Keep running in the background when the window is closed so the
			// tray and global shortcuts keep working.
			ApplicationShouldTerminateAfterLastWindowClosed: false,
		},
	})

	state.SetApp(wailsApp)

	mainWindow := wailsApp.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:  cfg.AppName,
		Width:  1280,
		Height: 820,
		// Frameless on Windows/Linux: the in-app <header> (with the
		// app-region: drag CSS) becomes the title bar.
		// On macOS, Frameless must be false so native traffic lights are shown;
		// MacTitleBarHiddenInset handles the hidden-title-bar look.
		Frameless: runtime.GOOS != "darwin",
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		Windows: application.WindowsWindow{
			// Lets WebView2 honour the CSS `-webkit-app-region: drag` on the
			// custom header via native non-client hit testing.
			NonClientRegionSupport: true,
		},
		BackgroundColour: application.NewRGB(247, 249, 252),
		URL:              "/",
	})
	state.SetMainWindow(mainWindow)

	// System tray + menu + global shortcuts.
	app.SetupTrayAndShortcuts(state)

	err = wailsApp.Run()
	// Flush and close the rotating log file before exiting.
	logger.Close()
	if err != nil {
		log.Fatal(err)
	}
}
