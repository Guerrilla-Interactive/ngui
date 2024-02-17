import { AddPlannedRoute } from "@/wailsjs/wailsjs/go/main/App"
import { useState } from "react"
import { useSWRConfig } from "swr"

interface AddRouteFormProps {
	projectId: string
}

// This is the input form to add new route
export function AddRouteForm(props: AddRouteFormProps) {
	const [name, setName] = useState('')
	const { mutate } = useSWRConfig()
	async function handleSubmit(e: React.FormEvent) {
		// For some reason, on some keyboard settings, three dots get converted to single characters automatically
		// Since three dots are are typed often, we try to catch this error
		const nameCleaned = name.replace("…", "...")
		e.preventDefault()
		// Perhaps perform some client-side validation
		await AddPlannedRoute(props.projectId, nameCleaned)
		mutate(props.projectId)
		setName("")
	}
	return (
		<form onSubmit={handleSubmit} className="my-16">
			<label className="text-white">Add:</label>
			<input value={name} onChange={e => setName(e.target.value)} className="bg-black text-white border-white border" />
			<button type="submit" />
		</form>
	)
}
