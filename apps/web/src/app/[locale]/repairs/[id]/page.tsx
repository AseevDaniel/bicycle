import MechanicProfilePage from './PageClient'

export function generateStaticParams() {
  return ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'].map((id) => ({ id }))
}

export default function Page() {
  return <MechanicProfilePage />
}
