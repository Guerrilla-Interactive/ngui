// This page hosts the project page
// where the sitemap UI for the project is display 
// and where the user manipulates the sitemap
// Note that this is a static page because the wails would
// expect static html/css files from the frontend and the
// nextjs server would be absent to handle dynamic routes.

"use client"

import { useSearchParams } from "next/navigation"
import { projectIdQueryParam } from "./utils"
import { useProjectById } from "@/fetch/projects"
import { UpdateProjectTitle } from "@/components/dashboard/dashboard-all"
import { AddRouteForm } from "@/components/project/add-route"
import { DeletePlannedRoute } from "@/wailsjs/wailsjs/go/main/App"
import { useSWRConfig } from "swr"
import { CreateRoutes } from "@/components/project/create-routes"


export default function Project() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get(projectIdQueryParam)
  if (!projectId) {
    return <div>loading...</div>
  }
  return (
    <div className="px-12 py-16">
      {/* Note here that we are using a tag instead of Link tag because Link tag we get stale data */}
      <a href="/">&larr;Home</a>
      <div className="mt-16">
        <ProjectSitemap id={projectId} />
      </div>
    </div>
  )
}

function ProjectSitemap({ id }: { id: string }) {
  const { mutate } = useSWRConfig()
  const { data, error, isLoading } = useProjectById(id)
  if (error) {
    console.error(error)
    return <div>Error loading project </div>
  }
  if (isLoading || !data) {
    return <div>Loading project ...</div>
  }
  const project = { Id: data.Id, Root: data.Root, Title: data.Title }
  const routes = data.Routes
  const plannedRoutes = data.PlannedRoutes
  async function handleDeletePlannedRoute(name: string) {
    await DeletePlannedRoute(id, name)
    mutate(id)
  }
  return (
    <div className="text-sm">
      <UpdateProjectTitle project={project} />
      <AddRouteForm projectId={project.Id} />
      <p>Id: {project.Id}</p>
      <p>Path: {project.Root}</p>
      <h2 className="mt-8">Routes:</h2>
      <pre>
        {routes.map(route => <div key={route.Name}>
          <b>{route.Kind}:{" "}</b>
          <span>{route.Name}</span>
        </div>)
        }
      </pre>
      {plannedRoutes.length > 0 && (
        <>
          <h2 className="mt-8">Planned Routes:</h2>
          <pre>
            {plannedRoutes.map(route => <div key={route.Name}>
              <b>{route.Kind}:{" "}</b>
              <span>{route.Name}</span>
              <button
                className="border border-white hover:bg-red-800 ml-4"
                onClick={() => handleDeletePlannedRoute(route.Name)}>Delete</button>
            </div>)}
          </pre>
        </>)
      }
      <div className="mt-16">
        {plannedRoutes.length > 0 && <CreateRoutes projectId={project.Id} />
        }
      </div>
    </div>
  )
}
