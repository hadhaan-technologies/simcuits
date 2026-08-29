import logo from '../assets/simcuitLogo.ico';
import { Link } from 'react-router-dom';

export function SiteFooter() {
  const columns = [
    {
      title: 'Product',
      items: [
        { label: 'Problems', path: '/problems' },
        { label: 'Simulator', path: '/simulator' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Pricing', path: '/pricing' },
      ],
    },
    {
      title: 'Learn',
      items: [
        { label: 'GPIO', path: '/learn/gpio' },
        { label: 'UART', path: '/learn/uart' },
        { label: 'PWM', path: '/learn/pwm' },
        { label: 'FPGA', path: '/learn/fpga' },
      ],
    },
    {
      title: 'Company',
      items: [
        { label: 'About', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact', path: '/contact' },
        { label: 'Blog', path: '/blog' },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Simcuits" className="h-8 w-8 object-contain" />

            <span className="font-semibold">Simcuits</span>
          </Link>

          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            The interactive learning platform for embedded systems engineers.
          </p>
        </div>

        {/* Footer Columns */}
        {columns.map((column) => (
          <div key={column.title}>
            <div className="mb-3 text-sm font-medium">{column.title}</div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              {column.items.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="transition hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span>© 2026 Hadhaan Technologies</span>

          <span className="font-mono">v1.0.5</span>
        </div>
      </div>
    </footer>
  );
}
