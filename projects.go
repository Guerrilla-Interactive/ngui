package main

import (
	"encoding/json"
	"errors"
	"os"
	"regexp"

	"github.com/Guerrilla-Interactive/ngui/models"
)

// Project name regex
// matches a
// matches alpha
// matches alpha-beta
// matches alpha-beta-gamma
// matches alpha--beta-gamma
// doesn't matche a-
// doesn't matche alpha-
var ProjectNameRegex = regexp.MustCompile(`^([[:alpha:]])$|([[:alpha:]]|-)*[[:alpha:]]$`)

var (
	ErrProjectNameInvalid   = errors.New("project name is invalid")
	ErrDuplicateProjectName = errors.New("project with give name already exists")
	ErrDuplicateProjectPath = errors.New("project with give path already exists")
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

// Adds a project to project.json
// Conditions:
// 1. Project path must be a valid path to the root directory of a NextJS app
// that uses app dir instead of pages
// 2. Project name must match the a particular regex
// Returns:
// 3. No other project with the given path can exist already
// 4. No other project can exist with the given name
// any error ecountered, nil if operation succeeds
func AddProject(p models.Project) error {
	if err := p.Validate(); err != nil {
		return err
	}
	if !ProjectNameRegex.Match([]byte(p.Title)) {
		return ErrProjectNameInvalid
	}
	projects, err := GetAllProjects()
	if err != nil {
		return err
	}
	for _, project := range projects {
		if p.Title == project.Title {
			return ErrDuplicateProjectName
		}
		if p.Root == project.Root {
			return ErrDuplicateProjectPath
		}
	}
	projects = append(projects, p)
	projectJSONFile := GetProjectsJSONPath()
	err = projectJSONFile.UpdateProjects(projects)
	return err
}

// Delete a project from project.json
func DeleteProject(p models.Project) error {
	projects, err := GetAllProjects()
	if err != nil {
		return err
	}
	newProjects := make([]models.Project, 0)
	for _, project := range projects {
		// We filter out the project that is to be deleted
		if project != p {
			newProjects = append(newProjects, project)
		}
	}
	projectJSONFile := GetProjectsJSONPath()
	err = projectJSONFile.UpdateProjects(newProjects)
	return err
}
