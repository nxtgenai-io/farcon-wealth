import { RoutePath } from '@/types';
import { FARCON_SERVICES } from '@/content/services/servicesData';
import { SERVICE_GROUPS } from '@/content/services/serviceGroups';

export const PRIMARY_NAV: { label: string; href: RoutePath; short: string; later?: boolean }[] = [
  { label: 'Home', short: 'Home', href: '/' },
  { label: 'Services', short: 'Services', href: '/services' },
  { label: 'Goals', short: 'Goals', href: '/goals' },
  { label: 'Calculators', short: 'Calculators', href: '/calculators' },
  { label: 'Investor Quiz', short: 'Investor Quiz', href: '/investor-quiz', later: true },
  { label: 'Planner', short: 'Planner', href: '/wealth-planner' },
  { label: 'Funds', short: 'Funds', href: '/mutual-funds' },
  { label: 'Education', short: 'Education', href: '/education', later: true },
  { label: 'About', short: 'About', href: '/about', later: true },
];

export const SERVICE_LINKS: { label: string; href: RoutePath }[] = SERVICE_GROUPS.flatMap((group) =>
  group.slugs.flatMap((slug) => {
    const service = FARCON_SERVICES.find((item) => item.slug === slug);
    if (!service) return [];
    return [{ label: service.title, href: `/services/${slug}` as RoutePath }];
  }),
);
