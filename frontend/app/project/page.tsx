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
  return (
    <div className="text-sm">
      <UpdateProjectTitle project={project} />
      <p>Id: {project.Id}</p>
      <p>Path: {project.Root}</p>
      <pre className="mt-16">{routes.map(route => <div key={route.Name}>
        <b>{route.Kind}:{" "}</b>
        <span>{route.Name}</span>
      </div>)
      }</pre>
    </div>
  )
}
