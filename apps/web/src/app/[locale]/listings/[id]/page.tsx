import ListingDetailPage from './PageClient'

export function generateStaticParams() {
  return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'].map((id) => ({ id }))
}

export default function Page() {
  return <ListingDetailPage />
}
