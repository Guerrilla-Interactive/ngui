package main

import (
	"context"
	"fmt"
	"os"

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

// See the underlying function for docs
func (a *App) GetProjectById(id string) (models.ProjectWithRoutes, error) {
	return GetProjectById(id)
}

// Function to add the planned route, calls the underlying AddPlannedRoute
// function. If any error occurs, presents the error in the error dialog
func (a *App) AddPlannedRoute(projectId string, name string) error {
	fmt.Println("got request to add", name)
	// See the underlying function for docs
	err := AddPlannedRoute(projectId, name)
	if err != nil {
		_, err := a.ErrorDialog(err.Error())
		return err
	}
	return nil
}

// Function to delete the given planned route, calls the underlying DeletePlannedRoute
// function. If any error occurs, presents the error in the error dialog
func (a *App) DeletePlannedRoute(projectId string, name string) error {
	// See the underlying function for docs
	err := DeletePlannedRoute(projectId, name)
	if err != nil {
		_, err := a.ErrorDialog(err.Error())
		return err
	}
	return nil
}

// Creates the planned routes. See the underlying CreatePlannedRoutes function for docs.
func (a *App) CreatePlannedRoutes(projectId string) error {
	err := CreatePlannedRoutes(projectId)
	if err != nil {
		_, err := a.ErrorDialog(err.Error())
		return err
	}
	return nil
}

// This function calls the wails function OpenDirectoryDialog
func (a *App) ChooseFolder() (string, error) {
	var dialogOptions runtime.OpenDialogOptions
	dialogOptions.Title = "Choose a project directory"
	return runtime.OpenDirectoryDialog(a.ctx, dialogOptions)
}

// This function calls the wails function MessageDialog
func (a *App) ErrorDialog(msg string) (string, error) {
	var dialogOptions runtime.MessageDialogOptions
	dialogOptions.Title = "Error"
	dialogOptions.Message = msg
	return runtime.MessageDialog(a.ctx, dialogOptions)
}

// Return the pathform specific path separator for filepath in a platform agnostic way
func (a *App) GetPathSeparator() string {
	return string(os.PathSeparator)
}
