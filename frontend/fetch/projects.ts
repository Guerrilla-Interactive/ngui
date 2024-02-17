import { ProjectWithRoutes, Projects } from "@/models/project";
import { GetAllProjects, GetProjectById } from "@/wailsjs/wailsjs/go/main/App";
import useSWR from "swr";

export const AllProjectsCacheKey = 'allProjects'

const revalidationOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
}

// This is a hook that gives the list of user's projects
export function useProjects() {
  const { data, error, isLoading } = useSWR(AllProjectsCacheKey, async () => {
    const result = await GetAllProjects()
    return Projects.parse(result)
  }, revalidationOptions)
  return { data, error, isLoading }
}

// This is a hook that gives the list of routes for the project with given id
// Note that the list of routes are routes that are already present in the filesystem.
export function useProjectById(id: string) {
  const { data, error, isLoading } = useSWR(id, async () => {
    const result = await GetProjectById(id)
    return ProjectWithRoutes.parse(result)
  }, { ...revalidationOptions, refreshInterval: 3000 })
  return { data, error, isLoading }
}

// This is a hook that gives list of planned routes for the project with given id
// Note that this routes aren't present in the filesystem.
export function useProjectPlannedRoutes(id: string) {
  // const { data, error, isLoading } = useSWR(id, async () => {
  //   const result = await GetProjectById(id)
  //   return ProjectWithRoutes.parse(result)
  // }, { ...revalidationOptions, refreshInterval: 3000 })
  // return { data, error, isLoading }
}
