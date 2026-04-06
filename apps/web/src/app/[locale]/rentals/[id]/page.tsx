import RentalDetailPage from './PageClient'

export function generateStaticParams() {
  return ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'].map((id) => ({ id }))
}

export default function Page() {
  return <RentalDetailPage />
}
