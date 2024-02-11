"use client"

import { ValidatedGetAllProjects } from "@/fetch/projects"
import { ProjectType } from "@/models/project"
import { AddProject, EditProjectTitle, ChooseFolder, DeleteProjectById, ErrorDialog } from "@/wailsjs/wailsjs/go/main/App"
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'

export default function DisplayUserProjects() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [projects, setProjects] = useState<ProjectType[]>([])
	console.log(Math.random())

	useEffect(() => {
		try {
			ValidatedGetAllProjects().then(x => {
				setProjects(x)
				setLoading(false)
			})
		} catch (e) {
			setLoading(false)
			setError(String(e))
		}
	}, [])

	// Replace this with useSWR so that we can invalidate, reload, etc.

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
			<h2 className="mb-2">Projects</h2>
			<div className="flex gap-x-12 gap-y-6 flex-wrap">
				<AddNewProject />
				{projects.map(x => <ProjectPreview key={x.Id} {...x} />)}
			</div>
		</div>
	)
}

// Component that is the card wrapper around ProjectPreview of existing projects
// as well as the new project create card
function ProjectPreviewWrapper({ children }: { children: React.ReactElement }) {
	return (<div className="group border-gray-800 border hover:border-gray-200 px-4 py-6 w-64 h-64 mx-2 rounded">
		{children}
	</div>
	)
}

export const ProjectTitleRegex = /^([[A-Za-z])$|([[A-Za-z]|-)*[[A-Za-z]$/

export function ProjectPreview(props: ProjectType) {
	const [title, setTitle] = useState(props.Title)
	const [changingTitle, setChangingTitle] = useState(false)
	async function handleTitleChange(e: React.FormEvent) {
		setChangingTitle(true)
		e.preventDefault()
		if (ProjectTitleRegex.test(title)) {
			// Send request to rename
			try {
				await EditProjectTitle(props.Id, title)
				setChangingTitle(false)
			} catch (e) {
				alert(`error: ${e}`)
				setTitle(props.Title)
				setChangingTitle(false)

			}
		} else {
			alert("doesn't match expected pattern (must only be alphabet optionally with - in between)")
			setTitle(props.Title)
			setChangingTitle(false)
		}
	}
	return <ProjectPreviewWrapper>
		<div className="text-xs flex flex-col justify-between h-full">
			<form onSubmit={handleTitleChange} >
				<label htmlFor="title">Title:</label>
				<input id="title" className="w-1/2 border border-white bg-black text-white " value={title} onChange={e => setTitle(e.target.value)} disabled={changingTitle} />
				<p>Path: {props.Root}</p>
			</form>
			<div>
				<button className="border border-red-800 hover:bg-red-800 text-white p-1 rounded"
					onClick={async () => {
						try {
							await DeleteProjectById(props.Id)
						} catch (e) {
							// Show message dialog
							await ErrorDialog(`error deleting project ${e}`)
						}
					}}
				>
					Delete
				</button>
			</div>
		</div>
	</ProjectPreviewWrapper>
}

export function AddNewProject() {
	return (
		<ProjectPreviewWrapper>
			<AddProjectDialog />
		</ProjectPreviewWrapper>
	)

}

function AddProjectDialog() {
	const [isOpen, setIsOpen] = useState(false)
	const [folderPath, setFolderPath] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [title, setTitle] = useState("")
	const [error, setError] = useState("")

	function closeModal() {
		setIsOpen(false)
	}

	function openModal() {
		setIsOpen(true)
	}

	async function handleSubmit(e: React.FormEvent) {
		setSubmitting(true)
		e.preventDefault()
		if (!ProjectTitleRegex.test(title)) {
			setError(`invalid project name ${title}`)
			setSubmitting(false)
			return
		}
		try {
			const project = {
				Root: folderPath,
				Title: title,
				Id: "" // Id will be set automatically when adding the project
			} as ProjectType
			const result = await AddProject(project)
			console.log(result)
			setIsOpen(false)
		} catch (e) {
			setError(String(e))
		}
		setSubmitting(false)
		return
	}

	return (
		<>

			<button
				type="button"
				onClick={openModal}
				className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
			>
				New
			</button>


			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										Add a new project
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-red-600 my-2">{error}</p>
										<p className="text-red-600 my-2">{submitting ? "submitting..." : ""}</p>
										<form onSubmit={handleSubmit}>
											<div>
												{folderPath ? (
													<div>Folder: {folderPath}</div>
												) : (
													<div onClick={
														async () => {
															try {
																const folder = await ChooseFolder()
																setFolderPath(folder)
															} catch (e) {
															}
														}}
														className="text-black bg-white px-4 py-2"
													>
														<p>{folderPath ? "click to set" : "click to update"}</p>
														Folder: {folderPath}
													</div>)
												}
											</div>
											<div>
												<label htmlFor="title" className="text-black">Title</label>
												<input type="text" value={title} id="title" onChange={(e) => setTitle(e.target.value)} className="bg-black text-white" />
											</div>
											<button
												disabled={submitting}
												type="submit"
												className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											>
												Add
											</button>
										</form>
									</div>

									<div className="mt-4">

									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}
