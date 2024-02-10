package main

import (
	"errors"
	"fmt"
	"os"
	"strings"
)

type ProjectsJSON string

var projectsJSONFileName = "projects.json"

var (
	ErrProjectsJSONDoesntExist  = errors.New("projects.json file doesn't exist")
	ErrProjectsJSONIsADirectory = errors.New("projects.json is a directory expected file")
)

// Returns the ProjectJSON path object
// Panics if the user home directory environment variable isn't set
func GetProjectsJSONPath() ProjectsJSON {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	return ProjectsJSON(fmt.Sprintf("%v/.ngo/%v", homeDir, projectsJSONFileName))
}

// Checks if the projects.json exists and is valid.
// Returns any error found, nil if no error
func (p ProjectsJSON) Validate() error {
	// Check if projects.json exists
	fileInfo, err := os.Stat(string(p))
	if errors.Is(err, os.ErrNotExist) {
		return ErrProjectsJSONDoesntExist
	} else if err != nil {
		panic(err)
	}
	// Check if file isn't a directory
	if fileInfo.IsDir() {
		return ErrProjectsJSONIsADirectory
	}
	return nil
}

func (p ProjectsJSON) Create() error {
	folder := strings.TrimSuffix(string(p), projectsJSONFileName)
	// Create folder where the file is to be saved
	if err := os.MkdirAll(folder, 0o755); err != nil {
		return err
	}
	_, err := os.Create(string(p))
	return err
}
