// /app/layout.tsx
import './global.css';
import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { NextUIProvider } from '@nextui-org/react';
import { ReactQueryProvider } from './react-query-provider';
import 'react-datepicker/dist/react-datepicker.css';
import 'sweetalert2/src/sweetalert2.scss';

export const metadata = {
  title: 'Vaquita',
  description:
    'Vaquita is a blockchain-based community savings protocol inspired by traditional South American systems. Users create groups, contribute collateral in USDC, and receive pooled funds at random intervals with collateral and interest returned at the end.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider className="h-full">
          <ReactQueryProvider>
            <ClusterProvider>
              <SolanaProvider>{children}</SolanaProvider>
            </ClusterProvider>
          </ReactQueryProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
