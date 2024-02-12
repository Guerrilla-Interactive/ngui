package main

import (
	"context"

	"github.com/Guerrilla-Interactive/ngui/models"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

//
// Public App methods
//

type ProjectsAndError struct {
	Projects []models.Project
	Error    error
}

// See the underlying function for docs
func (a *App) GetAllProjects() ([]models.Project, error) {
	return GetAllProjects()
}

// See the underlying function for docs
func (a *App) AddProject(p models.Project) (models.Project, error) {
	return AddProject(p)
}

// See the underlying function for docs
func (a *App) DeleteProjectById(id string) error {
	return DeleteProjectById(id)
}

// See the underlying function for docs
func (a *App) EditProjectTitle(id string, newTitle string) error {
	return EditProjectTitle(id, newTitle)
}

func (a *App) ChooseFolder() (string, error) {
	var dialogOptions runtime.OpenDialogOptions
	dialogOptions.Title = "Choose a project directory"
	return runtime.OpenDirectoryDialog(a.ctx, dialogOptions)
}

func (a *App) ErrorDialog(msg string) (string, error) {
	var dialogOptions runtime.MessageDialogOptions
	dialogOptions.Title = "Error"
	dialogOptions.Message = msg
	return runtime.MessageDialog(a.ctx, dialogOptions)
}

func (a *App) GetProjectById(id string) (models.ProjectWithRoutes, error) {
	return GetProjectById(id)
}
