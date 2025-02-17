import FooterLink from './FooterLink';

/**
 * Renders a column in the footer:
 *   - Title (h3)
 *   - List of links
 *
 * @param {string} title - Column title.
 * @param {Array} links - Array of link objects: { href, label, bullet?, target?, rel? }
 */
export default function FooterColumn({ title, links }: { title: string, links: { href: string, label: string, bullet?: boolean, target?: string, rel?: string }[] }) {
  return (
    <div>
      <h3 className="uppercase font-normal text-2xl mb-5">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink
              href={link.href}
              bullet={link.bullet}
              target={link.target}
              rel={link.rel}
            >
              {link.label}
            </FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}