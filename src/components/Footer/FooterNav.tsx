import FooterColumn from './FooterColumn';

/**
 * The main navigation section of the footer, arranged as columns.
 */
export default function FooterNav() {
  /**
   * Define each column with its title and links array.
   * You can easily update/add columns here without changing the JSX structure.
   */
  const columns = [
    {
      title: 'Learn',
      links: [
        {
          href: '/docs',
          label: 'Docs',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      ],
    },
    {
      title: 'Github',
      links: [
        {
          href: 'https://github.com/upnodedev/uproll-cli',
          label: 'CLI',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        {
          href: 'https://github.com/upnode-org/uproll-web',
          label: 'Web',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        {
          href: 'https://github.com/upnode-org',
          label: 'Organization',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      ],
    },
    // {
    //   title: 'Research',
    //   links: [
    //     {
    //       href: 'https://forum.uproll.org/',
    //       label: 'Forum',
    //       target: '_blank',
    //       rel: 'nofollow noreferrer',
    //     },
    //   ],
    // },
    {
      title: 'Community',
      links: [
        {
          href: 'https://x.com/uprollIntern',
          label: 'Twitter',
          target: '_blank',
          rel: 'nofollow noreferrer',
        },
      ],
    },
  ];

  return (
    <nav className="grid grid-cols-2 gap-8 gap-y-12 text-white lg:flex lg:justify-between z-10 sm:[&>div]:mx-10 lg:[&>div]:mx-0">
      {columns.map((col) => (
        <FooterColumn
          key={col.title}
          title={col.title}
          links={col.links}
        />
      ))}
    </nav>
  );
}