package main

import (
	"testing"

	"github.com/Guerrilla-Interactive/ngui/models"
)

func TestIsValidRouteName(t *testing.T) {
	type TestCase struct {
		name   string
		expect bool
	}
	testCases := []TestCase{
		{name: "/", expect: true},
		{name: "suman", expect: true},
		{name: "suman/", expect: true},
		{name: "//", expect: false},
		{name: "projects/", expect: true},
		{name: "projects/categories", expect: true},
		{name: "projects/categories/[slug]", expect: true},
		{name: "projects/categories/[...slug]", expect: true},
		{name: "projects/categories/[[...slug]]", expect: true},

		// Note we are strictly enforcing the dynamic route part to be called "slug"
		{name: "projects/categories/[index]", expect: false},
		{name: "projects/categories/[..slug]", expect: false},
		{name: "projects/categories/[[slug]]", expect: false},
	}
	for _, testCase := range testCases {
		got := IsValidRouteName(testCase.name)
		expect := testCase.expect
		if got != expect {
			t.Errorf("route %v expected %v got %v", testCase.name, expect, got)
		}
	}
}

func TestRouteType(t *testing.T) {
	type TestCase struct {
		name   string
		expect models.RouteType
	}
	testCases := []TestCase{
		{name: "/", expect: models.StaticRoute},
		{name: "suman", expect: models.StaticRoute},
		{name: "suman/", expect: models.StaticRoute},
		{name: "projects/", expect: models.StaticRoute},
		{name: "projects/categories", expect: models.StaticRoute},
		{name: "projects/categories/[slug]", expect: models.DynamicRoute},
		{name: "projects/categories/[...slug]", expect: models.DynamicRoute},
		{name: "projects/categories/[[...slug]]", expect: models.DynamicRoute},
	}
	for _, testCase := range testCases {
		got := RouteType(testCase.name)
		expect := testCase.expect
		if got != expect {
			t.Errorf("route %v expected %v got %v", testCase.name, expect, got)
		}
	}
}
