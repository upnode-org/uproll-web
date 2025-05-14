import { Layout, Link, Navbar } from 'nextra-theme-docs'
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
    const docs = pageMap.find(page => page.name === 'docs')?.children || []

    return (
        <Layout
            nextThemes={{
                defaultTheme: "light",
                // forcedTheme: "light",
            }}
            pageMap={docs}
            // pageMap={[{}] as PageMapItem[]}
            docsRepositoryBase="https://github.com/upnode-org/uproll-web/tree/main/src/content"
            editLink={<Link href="https://github.com/upnode-org/uproll-web/tree/main/src/content">Edit this page on GitHub</Link>}
        >
            <div className='h-26 w-full'>
                <GradientBackground className='h-full w-full' />
            </div>
            <div className='max-w-screen-xl mx-auto'>
                <Navbar align='left' logo={<span />} />
                {children}
            </div>
        </Layout>
    )
}