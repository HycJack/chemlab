// Package app holds the Wails3 application bootstrap: shared state, the bound
// services, and system integration (tray / window).
//
// Pattern: a single State struct is shared by every service. It owns the
// *application.App and the main window so services can emit events and show /
// focus the window from background tasks.
package app

import (
	"github.com/wailsapp/wails/v3/pkg/application"

	"chemlab/internal/config"
)

// State holds the shared application resources used by the services.
type State struct {
	cfg        *config.Config
	app        *application.App
	mainWindow *application.WebviewWindow
}

// New builds the shared state. Pass the loaded config in.
func New(cfg *config.Config) *State {
	return &State{cfg: cfg}
}

// SetApp wires the application instance for event emission.
func (s *State) SetApp(app *application.App) { s.app = app }

// SetMainWindow records the main window so background tasks (tray, shortcuts)
// can show/focus it.
func (s *State) SetMainWindow(w *application.WebviewWindow) { s.mainWindow = w }

// ShowMainWindow brings the main window to the front.
func (s *State) ShowMainWindow() {
	if s.mainWindow != nil {
		s.mainWindow.Show()
		s.mainWindow.Focus()
	}
}

// MainWindow returns the main window (may be nil).
func (s *State) MainWindow() *application.WebviewWindow { return s.mainWindow }

// Emit sends an event to the frontend (best effort; no-op before Run()).
func (s *State) Emit(name string, data any) {
	if s.app == nil {
		return
	}
	s.app.Event.Emit(name, data)
}

// Config returns the shared application config.
func (s *State) Config() *config.Config { return s.cfg }
