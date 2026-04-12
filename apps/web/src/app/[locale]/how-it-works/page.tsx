import { setRequestLocale } from 'next-intl/server'
import { HowItWorksDetailPage } from '@/components/pages/HowItWorksDetailPage'

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HowItWorksDetailPage />
}
