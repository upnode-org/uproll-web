/**
 * Renders a link with optional bullet styles on hover.
 *
 * @param {string} href - The URL for the link.
 * @param {boolean} bullet - Whether to apply the bullet hover effect.
 * @param {string} target - Link target, e.g., '_blank'.
 * @param {string} rel - Link rel, e.g., 'noopener noreferrer'.
 * @param {React.ReactNode} children - The link text or content.
 */
export default function FooterLink({
  href,
  bullet = true,
  target,
  rel,
  children,
}: {
  href: string;
  bullet?: boolean;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}) {
  const bulletClasses = bullet
    ? `relative transition-colors duration-300 ease-in-out
       before:content-['•']
       before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
       before:opacity-0 before:transition-all before:duration-300 before:ease-in-out
       before:text-xs hover:before:-translate-x-4 hover:before:opacity-100
       hover:before:text-3xl hover:scale-105`
    : '';

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={bulletClasses}
    >
      {children}
    </a>
  );
}