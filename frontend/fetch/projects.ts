import { Projects } from "@/models/project";
import { GetAllProjects } from "@/wailsjs/wailsjs/go/main/App";
import useSWR from "swr";

export const AllProjectsCacheKey = 'allProjects'

const noRevalidationOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
}

export function useProjects() {
  const { data, error, isLoading } = useSWR(AllProjectsCacheKey, async () => {
    const result = await GetAllProjects()
    return Projects.parse(result)
  }, noRevalidationOptions)
  return { data, error, isLoading }
}

