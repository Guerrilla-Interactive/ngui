import DisplayUserProjects from "@/components/dashboard/dashboard-all";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>NextGen</h1>
      <DisplayUserProjects />
    </main>
  )
}
