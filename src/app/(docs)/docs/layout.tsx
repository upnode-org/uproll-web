import { Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import GradientBackground from '@/components/GradientBackground'

export default async function DocLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='max-h-[100dvh] overflow-hidden'>
            <Layout
                nextThemes={{
                    defaultTheme: "light",
                // forcedTheme: "light",
            }}
            pageMap={await getPageMap()}
            // pageMap={[{}] as PageMapItem[]}
            docsRepositoryBase="https://github.com/upnode-org/uproll-web/tree/main/content"
        >
            <div className='h-26 w-full'>
                <GradientBackground className='h-full w-full' />
            </div>
            <div className='container mx-auto'>
                <Navbar align='left' logo={<span />} />
                {children}
            </div>
        </Layout>
        </div>
    )
}