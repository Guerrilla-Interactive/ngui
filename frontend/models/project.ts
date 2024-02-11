import { z } from "zod"

export const Project = z.object(
	{
		Root: z.string(),
		Title: z.string(),
		Id: z.string(),
	})
export const Projects = z.array(Project)

export type ProjectType = z.infer<typeof Project>
export type ProjectsType = z.infer<typeof Projects>
