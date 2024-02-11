import { Projects, ProjectsType } from "@/models/project";
import { GetAllProjects } from "@/wailsjs/wailsjs/go/main/App";

export async function ValidatedGetAllProjects(): Promise<ProjectsType> {
  const result = await GetAllProjects()
  return Projects.parse(result)
}
