import { FARCON_SERVICES } from '@/content/services/servicesData';
import { BLOG_POSTS } from '@/content/blogs/blogData';
import { FARCON_GOALS } from '@/content/goals/goalsData';
import { FAQ_ITEMS } from '@/content/faq/faqData';
import fundBook from '@/content/funds/schemes.json';

const SITE = 'https://farconwealth.com';

export const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Farcon Wealth | Investing, Without The Noise',
    description: 'AMFI-registered mutual fund distributor. Goal-based SIP planning, retirement, tax-saving and portfolio guidance. ARN 329006.',
  },
  '/about': {
    title: 'About Farcon Wealth | ARN 329006',
    description: 'Farcon Wealth is an AMFI-registered mutual fund distributor helping families invest with clarity, discipline and purpose.',
  },
  '/services': {
    title: 'Services | Farcon Wealth',
    description: 'Goal-based SIP planning, portfolio review, ELSS, retirement, child education and SWP guidance.',
  },
  '/goals': {
    title: 'Goals | Farcon Wealth',
    description: 'Plan for retirement, child education, wealth creation and tax saving with a goal-based mutual fund approach.',
  },
  '/calculators': {
    title: 'Calculators | Farcon Wealth',
    description: 'SIP, lumpsum, goal and retirement calculators. Illustrative estimates, not a promise of returns.',
  },
  '/calculators/sip': {
    title: 'SIP Calculator | Farcon Wealth',
    description: 'Illustrative SIP calculator. A monthly amount, a rate and a horizon. Not a promise of returns.',
  },
  '/calculators/lumpsum': {
    title: 'Lumpsum Calculator | Farcon Wealth',
    description: 'Illustrative lumpsum calculator. Not a promise of returns.',
  },
  '/calculators/goal': {
    title: 'Goal Calculator | Farcon Wealth',
    description: 'Illustrative goal calculator for a target amount and a date.',
  },
  '/calculators/retirement': {
    title: 'Retirement Calculator | Farcon Wealth',
    description: 'Illustrative retirement calculator from today’s spending and a retirement age.',
  },
  '/investor-quiz': {
    title: 'Investor Quiz | Farcon Wealth',
    description: 'A short quiz to understand the kind of mutual fund approach that may fit your horizon and comfort with risk.',
  },
  '/wealth-planner': {
    title: 'Wealth Planner | Farcon Wealth',
    description: 'Sketch a goal, a timeline and an illustrative monthly investment with Farcon’s planner.',
  },
  '/mutual-funds': {
    title: 'Mutual Funds | Farcon Wealth',
    description: 'Explore mutual fund categories. Scheme figures are educational and not a recommendation.',
  },
  '/portfolio-review': {
    title: 'Portfolio Review | Farcon Wealth',
    description: 'Request a calm review of mutual fund holdings held in your own name.',
  },
  '/investor-login': {
    title: 'Investor Login | Farcon Wealth',
    description: 'Online portfolio access is coming soon. Message Farcon on WhatsApp or request a statement.',
  },
  '/education': {
    title: 'Investor Education | Farcon Wealth',
    description: 'Short explanations of SIPs, lumpsum investing, ELSS and goal-based mutual fund planning.',
  },
  '/blogs': {
    title: 'Notes | Farcon Wealth',
    description: 'Notes on goal-based mutual fund investing from Farcon Wealth.',
  },
  '/faq': {
    title: 'FAQs | Farcon Wealth',
    description: 'Answers to common questions about Farcon Wealth, SIPs and mutual fund distribution.',
  },
  '/contact': {
    title: 'Contact | Farcon Wealth',
    description: 'Book a conversation or message Farcon Wealth on WhatsApp. ARN 329006.',
  },
  '/start-investing': {
    title: 'Start Investing | Farcon Wealth',
    description: 'A mutual fund distribution enquiry: goal, amount or SIP, horizon, risk and how you would like Farcon to reply.',
  },
  '/privacy': {
    title: 'Privacy Policy | Farcon Wealth',
    description: 'How Farcon Wealth handles personal information.',
  },
  '/terms': {
    title: 'Terms of Use | Farcon Wealth',
    description: 'Terms for using the Farcon Wealth website.',
  },
  '/disclosures': {
    title: 'Disclosures | Farcon Wealth',
    description: 'AMFI registration, ARN 329006 and mutual fund risk disclosures.',
  },
  '/grievance': {
    title: 'Grievance Redressal | Farcon Wealth',
    description: 'How to raise a concern with Farcon Wealth.',
  },
};

const NOT_FOUND_META = {
  title: 'Page not found | Farcon Wealth',
  description: 'This page is not on the Farcon Wealth site.',
};

export function metaFor(path: string) {
  if (PAGE_META[path]) return PAGE_META[path];
  if (path.startsWith('/goals/')) {
    const goal = FARCON_GOALS.find((item) => item.slug === path.slice('/goals/'.length));
    if (!goal) return NOT_FOUND_META;
    return { title: `${goal.title} | Farcon Wealth`, description: goal.description.slice(0, 160) };
  }
  if (path.startsWith('/services/')) {
    const service = FARCON_SERVICES.find((item) => item.slug === path.slice('/services/'.length));
    if (!service) return NOT_FOUND_META;
    return { title: `${service.title} | Farcon Wealth`, description: service.summary.slice(0, 160) };
  }
  if (path.startsWith('/calculators')) return PAGE_META['/calculators'];
  if (path.startsWith('/blogs/')) {
    const post = BLOG_POSTS.find((item) => item.slug === path.slice('/blogs/'.length));
    if (!post) return NOT_FOUND_META;
    return { title: post.seoTitle, description: post.seoDescription };
  }
  if (path.startsWith('/mutual-funds/')) {
    const [categorySlug, schemeSlug] = path.slice('/mutual-funds/'.length).split('/');
    const category = fundBook.categories.find((item) => item.slug === categorySlug);
    if (!category) return NOT_FOUND_META;
    const scheme = schemeSlug ? category.schemes.find((item) => item.slug === schemeSlug) : undefined;
    if (schemeSlug && !scheme) return NOT_FOUND_META;
    return {
      title: `${scheme ? scheme.name : category.name} | Farcon Wealth`,
      description: scheme
        ? `${scheme.name}, ${scheme.plan}. Educational scheme card from Farcon Wealth. Not a recommendation.`
        : category.summary,
    };
  }
  return NOT_FOUND_META;
}

function crumbs(path: string) {
  const parts = path.split('/').filter(Boolean);
  const items = [{ name: 'Home', item: `${SITE}/` }];
  let acc = '';
  for (const part of parts) {
    acc += `/${part}`;
    const name = metaFor(acc).title.replace(/ \| Farcon Wealth$/, '');
    items.push({ name, item: `${SITE}${acc}` });
  }
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

export function jsonLdFor(path: string) {
  const meta = metaFor(path);
  const url = `${SITE}${path === '/' ? '/' : path}`;
  const graph: object[] = [
    { '@type': 'WebPage', name: meta.title, description: meta.description, url },
    crumbs(path),
  ];
  if (path === '/faq') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }
  const post = path.startsWith('/blogs/') ? BLOG_POSTS.find((item) => item.slug === path.slice('/blogs/'.length)) : undefined;
  if (post) {
    graph.push({
      '@type': 'Article',
      headline: post.title,
      description: post.seoDescription,
      author: { '@type': 'Organization', name: 'Farcon Wealth' },
      publisher: { '@type': 'Organization', name: 'Farcon Wealth' },
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function seoEntries() {
  const paths = new Set<string>(Object.keys(PAGE_META));
  FARCON_SERVICES.forEach((item) => paths.add(`/services/${item.slug}`));
  FARCON_GOALS.forEach((item) => paths.add(`/goals/${item.slug}`));
  BLOG_POSTS.forEach((item) => paths.add(`/blogs/${item.slug}`));
  fundBook.categories.forEach((category) => {
    paths.add(`/mutual-funds/${category.slug}`);
    category.schemes.forEach((scheme) => paths.add(`/mutual-funds/${category.slug}/${scheme.slug}`));
  });
  return [...paths].map((path) => {
    const meta = metaFor(path);
    return {
      path,
      title: meta.title,
      description: meta.description,
      url: `${SITE}${path === '/' ? '/' : path}`,
      jsonLd: jsonLdFor(path),
    };
  });
}
