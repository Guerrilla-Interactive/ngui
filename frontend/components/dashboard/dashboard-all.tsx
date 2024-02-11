"use client"

import { ValidatedGetAllProjects } from "@/fetch/projects"
import { ProjectType } from "@/models/project"
import { EditProjectTitle } from "@/wailsjs/wailsjs/go/main/App"
import { useState } from "react"

export default function DisplayUserProjects() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [projects, setProjects] = useState<ProjectType[]>([])

	// Replace this with useSWR so that we can invalidate, reload, etc.
	try {
		ValidatedGetAllProjects().then(x => {
			setProjects(x)
			setLoading(false)
		})
	} catch (e) {
		setError(String(e))
	}

	if (error) {
		return <div>
			<p>Error loading projects</p>
			<p>{error}</p>
		</div>
	}

	if (loading) {
		return (
			<div> Loading </div>
		)
	}

	return (
		<div>
			<h2>Projects</h2>
			<div className="flex gap-x-12 gap-y-6 flex-wrap">
				{projects.map(x => <ProjectPreview key={x.Id} {...x} />)}
			</div>
		</div>)
}

function ProjectPreview(props: ProjectType) {
	const [title, setTitle] = useState(props.Title)
	const [changingTitle, setChangingTitle] = useState(false)
	const titleRegex = /^([[A-Za-z])$|([[A-Za-z]|-)*[[A-Za-z]$/
	function handleTitleChange(e: React.FormEvent) {
		setChangingTitle(true)
		e.preventDefault()
		if (titleRegex.test(title)) {
			// Send request to rename
			try {
				EditProjectTitle(props.Id, title).then(_ => {
				})
			}
		} else {
			alert("doesn't match expected pattern (must only be alphabet optionally with - in between)")
			setTitle(props.Title)
			setChangingTitle(false)
		}
	}
	return <div className="border border-white px-4 py-6 w-64 h-64 mx-2">
		<form onSubmit={handleTitleChange}>
			<input className="bg-black text-white" value={title} onChange={e => setTitle(e.target.value)} disabled={changingTitle} />
		</form>
	</div>
}
