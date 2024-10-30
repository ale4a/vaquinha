import { UiLayout } from '@/components/layout/ui-layout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <UiLayout>{children}</UiLayout>;
}
