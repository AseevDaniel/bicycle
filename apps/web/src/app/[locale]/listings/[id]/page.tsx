import ListingDetailPage from './PageClient'

export function generateStaticParams() {
  return ['1', '2', '3', '4', '5', '6', '9', '17'].map((id) => ({ id }))
}

export default ListingDetailPage
