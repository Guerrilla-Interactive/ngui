"use client"

import { AllProjectsCacheKey, useProjects } from "@/fetch/projects"
import { ProjectType } from "@/models/project"
import { AddProject, EditProjectTitle, ChooseFolder, DeleteProjectById, ErrorDialog } from "@/wailsjs/wailsjs/go/main/App"
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useSWRConfig } from "swr"


export default function DisplayUserProjects() {
	const { data: projects, isLoading, error } = useProjects()

	if (error) {
		return <div>
			<p>Error loading projects</p>
			<p>{error}</p>
		</div>
	}

	if (isLoading || !projects) {
		return (
			<div> Loading </div>
		)
	}

	return (
		<div>
			<h2 className="mb-2">Projects</h2>
			<div className="flex gap-x-12 gap-y-6 flex-wrap">
				<AddNewProject />
				{projects
					// Note that we sort the projects to prevent re-ordering when projects are reloaded   
					.sort((a, b) => Number(a.Id) - Number(b.Id))
					.map(x => <ProjectPreview key={x.Id} {...x} />)}
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
	const { mutate } = useSWRConfig()
	const [title, setTitle] = useState(props.Title)
	const [changingTitle, setChangingTitle] = useState(false)
	async function handleTitleChange(e: React.FormEvent) {
		setChangingTitle(true)
		e.preventDefault()
		if (ProjectTitleRegex.test(title)) {
			// Send request to rename
			try {
				await EditProjectTitle(props.Id, title)
				// Revalidate projects
				mutate(AllProjectsCacheKey)
				setChangingTitle(false)
			} catch (e) {
				ErrorDialog(`error: ${e}`)
				setTitle(props.Title)
				setChangingTitle(false)

			}
		} else {
			ErrorDialog("title doesn't match expected pattern (must only be alphabet optionally with - in between)")
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
							// Revalidate projects
							mutate(AllProjectsCacheKey)
						} catch (e) {
							// Show message dialog
							await ErrorDialog(`error deleting project with id ${props.Id} ${e}`)
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
	const { mutate } = useSWRConfig()

	function closeModal() {
		setIsOpen(false)
	}

	function openModal() {
		setIsOpen(true)
	}

	async function handleSubmit(e: React.FormEvent) {
		setSubmitting(true)
		e.preventDefault()
		if (!folderPath) {
			setError(`No folder path set`)
			setSubmitting(false)
			return
		}
		if (!ProjectTitleRegex.test(title)) {
			setError(`Invalid project name ${title}`)
			setSubmitting(false)
			return
		}
		try {
			const project = {
				Root: folderPath,
				Title: title,
				Id: "" // Id will be set automatically when adding the project
			} as ProjectType
			await AddProject(project)
			// Revalidate projects
			setIsOpen(false)
			setFolderPath("")
			setTitle("")
			mutate(AllProjectsCacheKey)
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
									<div className="mt-2 text-xs">
										<p className="text-red-600 my-2">{error}</p>
										<p className="text-red-600 my-2">{submitting ? "submitting..." : ""}</p>
										<form onSubmit={handleSubmit}>
											<p onClick={
												async () => {
													try {
														const folder = await ChooseFolder()
														setFolderPath(folder)
													} catch (e) {
													}
												}}
												className="text-black bg-white"
											>{folderPath ? `Folder: ${folderPath} - click to update` : "Folder: click to set"}
											</p>
											<div>
												<label htmlFor="title" className="text-black">Title</label>
												<input type="text" value={title} id="title" onChange={(e) => setTitle(e.target.value)} className="bg-black text-white" />
											</div>
											<div className="flex gap-x-4 mt-4">
												<button className="text-black text-xs" type="submit"> Submit </button>
												<button className="text-black text-xs" onClick={() => setIsOpen(false)} > Close </button>
											</div>
										</form>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div >
				</Dialog >
			</Transition >
		</>
	)
}
