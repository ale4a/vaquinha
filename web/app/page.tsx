'use client';
import Home from '@/components/Home';
// import DashboardFeature from '@/components/dashboard/dashboard-feature';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/groups');
  }, [router]);

  return <Home />;
}
