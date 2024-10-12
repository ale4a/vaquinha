import { showAlert, showAlertWithConfirmation } from '@/utils/commons';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { Props } from './Table.types';
import { useRouter } from 'next/navigation';

export default function Table({ items }: Props) {
  const router = useRouter();
  const getStatusType = (status: string): string => {
    switch (status) {
      case 'Pay':
        return 'success';
      case 'Pending':
        return 'muted';
      default:
        return 'disabled';
    }
  };

  const handleClick = () => {
    showAlertWithConfirmation(
      'Do you want to Pay?',
      '',
      'info',
      () => router.back(),
      'Pay Now'
    );
  };
  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_2fr_2fr] py-4 px-1 text-sm font-semibold gap-2">
        <span className="pl-1">Nro</span>
        <span>Amount</span>
        <span>Payment Deadline</span>
        <span>Status</span>
      </div>
      {items.map((item, i) => {
        return (
          <div
            className="grid grid-cols-[1fr_2fr_2fr_2fr] py-4 px-1 text-sm font-semibold gap-2 bg-bg-200 hover:bg-bg-300 transition-colors duration-300"
            key={item.id}
          >
            <span className="pl-3">{i + 1}</span>
            <span>{item.amount} USDC</span>
            <span>{item.paymentDeadline}</span>
            <span>
              <ButtonComponent
                label={item.status}
                type={getStatusType(item.status)}
                onClick={handleClick}
              />
            </span>
          </div>
        );
      })}
    </>
  );
}
