import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '@/mdx-components'
import { Metadata } from 'next'
 
export const generateStaticParams = generateStaticParamsFor('mdxPath')

interface PageProps {
  params: Promise<{
    mdxPath?: string[]
  }>
}
 
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { metadata } = await importPage(resolvedParams.mdxPath)
  return metadata
}
 
const Wrapper = getMDXComponents({}).wrapper
 
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const result = await importPage(resolvedParams.mdxPath)
  const { default: MDXContent, toc, metadata } = result
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent params={resolvedParams} />
    </Wrapper>
  )
}