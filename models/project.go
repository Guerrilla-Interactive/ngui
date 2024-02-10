package models

import (
	"errors"
	"os"
	"path/filepath"
)

type Project struct {
	Root string
}

var (
	ErrProjectDoesntExist    = errors.New("project doesn't exist")
	ErrProjectRootIsntADir   = errors.New("project root isn't a directory")
	ErrProjectNoPackageJSON  = errors.New("project doesn't contain package.json")
	ErrProjectNoAppDirFound  = errors.New("cannot find app directory in the project")
	ErrProjectAppDirIsntADir = errors.New("project app directory isn't a directory")
)

// Validates the project and returns any error with the project
// returns nil if no error
// panics if an unexpected error is encountered
func (p *Project) Validate() error {
	// Check if project root directory exists
	projectRootInfo, err := os.Stat(p.Root)
	if errors.Is(err, os.ErrNotExist) {
		return ErrProjectDoesntExist
	} else if err != nil {
		panic(err)
	}

	// Check if the give project root is a directory
	if !projectRootInfo.IsDir() {
		return ErrProjectRootIsntADir
	}

	// Check if package.json exists
	package_json := filepath.Join(p.Root, "package.json")
	_, err = os.Stat(package_json)
	if errors.Is(err, os.ErrNotExist) {
		return ErrProjectNoPackageJSON
	} else if err != nil {
		panic(err)
	}

	// Check if app directory is present at the root level
	appDir := filepath.Join(p.Root, "app")
	appDirInfo, err := os.Stat(appDir)
	if errors.Is(err, os.ErrNotExist) {
		// Check if app directory is present inside the src directory level
		appDir = filepath.Join(p.Root, "src/app")
		appDirInfo, err = os.Stat(appDir)
		if errors.Is(err, os.ErrNotExist) {
			return ErrProjectNoAppDirFound
		} else if err != nil {
			panic(err)
		}
	} else if err != nil {
		panic(err)
	}
	if !appDirInfo.IsDir() {
		return ErrProjectAppDirIsntADir
	}
	return nil
}
