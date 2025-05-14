import { Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import GradientBackground from '@/components/GradientBackground'

interface PageItem {
    name: string;
    route: string;
    title: string;
    children?: PageItem[];
    frontMatter?: {
        title: string;
        filePath: string;
        timestamp: number;
    };
}

export default async function DocLayout({ children }: { children: React.ReactNode }) {

    const pageMap = await getPageMap() as PageItem[]
    console.log(pageMap)
    const docs = pageMap.find(page => page.name === 'docs')?.children || []

    return (
        <div className='max-h-[100dvh]'>
            <Layout
                nextThemes={{
                    defaultTheme: "light",
                    // forcedTheme: "light",
                }}
                pageMap={docs}
                // pageMap={[{}] as PageMapItem[]}
                docsRepositoryBase="https://github.com/upnode-org/uproll-web/tree/main/content"
            >
                <div className='h-26 w-full'>
                    <GradientBackground className='h-full w-full' />
                </div>
                <div className='max-w-screen-xl mx-auto h-full'>
                    <Navbar align='left' logo={<span />} />
                    {children}
                </div>
            </Layout>
        </div>
    )
}