import { ProjectWithRoutes, Projects } from "@/models/project";
import { GetAllProjects, GetProjectById } from "@/wailsjs/wailsjs/go/main/App";
import useSWR from "swr";

export const AllProjectsCacheKey = 'allProjects'

const revalidationOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
}

export function useProjects() {
  const { data, error, isLoading } = useSWR(AllProjectsCacheKey, async () => {
    const result = await GetAllProjects()
    return Projects.parse(result)
  }, revalidationOptions)
  return { data, error, isLoading }
}

export function useProjectById(id: string) {
  const { data, error, isLoading } = useSWR(id, async () => {
    const result = await GetProjectById(id)
    return ProjectWithRoutes.parse(result)
  }, { ...revalidationOptions, refreshInterval: 3000 })
  return { data, error, isLoading }
}
