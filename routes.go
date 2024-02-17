package main

import (
	"errors"
	"fmt"
	"strings"

	ngo "github.com/Guerrilla-Interactive/ngo/cmd"
	"github.com/Guerrilla-Interactive/ngui/models"
)

var ErrInvalidRouteName = errors.New("route name is invalid")

// Function to check if the routename is valid
func IsValidRouteName(name string) bool {
	if name == "/" {
		return true
	}
	name = strings.TrimPrefix(name, "/")
	name = strings.TrimSuffix(name, "/")
	routeParts := strings.Split(name, "/")
	for i := 0; i < len(routeParts); i++ {
		if !ngo.IsValidStaticRouteName(routeParts[i]) && !ngo.IsValidDynamicRouteName(routeParts[i]) {
			return false
		}
	}
	return true
}

// Find the route type for the given route name
// Preconditions:
// The given route name should be valid
func RouteType(name string) models.RouteType {
	if !IsValidRouteName(name) {
		panic("invalid route name passed for RouteType")
	}
	routeParts := strings.Split(name, "/")
	lastPart := routeParts[len(routeParts)-1]
	if ngo.IsValidDynamicRouteName(lastPart) {
		return models.DynamicRoute
	}
	return models.StaticRoute
}

// Returns the standarized form of the given route name. Note that
// standarized means things like presence of leading slash, absence of
// trailing slash, etc.
// Precondition:
// The given route name is a valid route name
func StandarizedRouteName(name string) string {
	if !IsValidRouteName(name) {
		panic("invalid route name. precondition violated")
	}
	if name == "/" {
		return name
	}
	// Remove trailing and leading slashes
	name = strings.TrimPrefix(name, "/")
	name = strings.TrimSuffix(name, "/")
	// Add a leading slash
	return fmt.Sprintf("/%v", name)
}
