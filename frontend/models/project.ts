import { z } from "zod"

export const Project = z.object(
	{
		Root: z.string(),
		Title: z.string(),
		Id: z.string(),
	})
export const Projects = z.array(Project)

export const Route = z.object({
	Kind: z.string(),
	Name: z.string()
})

export const ProjectWithRoutes = Project.extend({
	Routes: z.array(Route)
})

export type ProjectType = z.infer<typeof Project>
export type ProjectWithRoutesType = z.infer<typeof ProjectWithRoutes>
export type ProjectsType = z.infer<typeof Projects>
