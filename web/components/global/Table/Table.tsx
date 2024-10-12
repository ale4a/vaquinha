import { Props } from './Table.types';

export default function Table({ items }: Props) {
  return (
    <div className="p-2">
      <div className="grid grid-cols-[45px_1fr_1fr_1fr] text-sm font-semibold text-center">
        <span>Nro</span>
        <span>Amount</span>
        <span>Payment Deadline</span>
        <span>Status</span>
      </div>
      {items.map((item, i) => {
        return (
          <div
            className="grid grid-cols-[45px_1fr_1fr_1fr] py-2 bg-bg-200 text-center"
            key={item.id}
          >
            <span className="text-center">{i + 1}</span>
            <span>{item.amount} USDC</span>
            <span>{item.paymentDeadline}</span>
            <span>
              <div
                className={
                  'border rounded-xl py-1 px-3 mx-1 text-center ' +
                  `${
                    item.status === 'Play Now'
                      ? 'text-white border-transparent bg-success-green'
                      : ''
                  }`
                }
              >
                {item.status}
              </div>
            </span>
          </div>
        );
      })}
    </div>
  );
}
