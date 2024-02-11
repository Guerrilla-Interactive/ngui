import { Projects, ProjectsType } from "@/models/project";
import { GetAllProjects } from "@/wailsjs/wailsjs/go/main/App";

export async function ValidatedGetAllProjects(): Promise<ProjectsType> {
  const result = await GetAllProjects()
  if (result.Error) {
    throw result.Error
  }
  return Projects.parse(result.Projects)
}
