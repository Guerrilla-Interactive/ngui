package main

import (
	"encoding/json"
	"errors"
	"os"

	"github.com/Guerrilla-Interactive/ngui/models"
)

// Returns the list of valid projects from  projects in projects.json
// error returned is not nil if any error is encountered
// Panics if unexpected error is encountered
func GetAllProjects() ([]models.Project, error) {
	var projects []models.Project
	projectsJSON := GetProjectsJSONPath()
	err := projectsJSON.Validate()
	// Create if the projects.json doesn't exist
	if err != nil && errors.Is(err, ErrProjectsJSONDoesntExist) {
		err := projectsJSON.Create()
		if err != nil {
			panic(err)
		}
		return projects, nil
	}
	// return projects, err
	// Check if file is parsable
	file, err := os.Open(string(projectsJSON))
	if err != nil {
		panic(err)
	}
	// Get a list of all projects in projects.json
	var projectsJSONRaw models.ProjectsJSON
	defer file.Close()
	if err := json.NewDecoder(file).Decode(&projectsJSONRaw); err != nil {
		return projects, err
	}
	// Filter out invalid projects defined in projects.json
	for _, p := range projectsJSONRaw.Projects {
		if p.Validate() == nil {
			projects = append(projects, p)
		}
	}
	return projects, nil
}
