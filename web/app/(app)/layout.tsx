import { UiLayout } from '@/components/layout/ui-layout';

const links: { label: string; path: string }[] = [
  { label: 'Join Group', path: '/groups' },
  { label: 'My Groups', path: '/my-groups' },
  { label: 'Profile', path: '/profile' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <UiLayout links={links}>{children}</UiLayout>;
}
