import MechanicProfilePage from './PageClient'

export function generateStaticParams() {
  return ['m1', 'm2', 'm3', 'm4'].map((id) => ({ id }))
}

export default MechanicProfilePage
