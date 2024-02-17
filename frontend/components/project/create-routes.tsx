import { CreatePlannedRoutes } from "@/wailsjs/wailsjs/go/main/App"
import { useSWRConfig } from "swr"

interface CreateRoutesProps {
	projectId: string
}
export function CreateRoutes(props: CreateRoutesProps) {
	const { mutate } = useSWRConfig()
	async function handleSync() {
		await CreatePlannedRoutes(props.projectId)
		// Note we mutate to trigger revalidation
		mutate(props.projectId)
	}
	return (
		<div>
			<button className="border border-white bg-black text-white px-4 py-2 hover:bg-white hover:text-black" onClick={handleSync}>Sync
			</button>
			<p className="text-xs">Note that syncing creates the planned routes in your local filesystem.</p>
		</div>)
}
