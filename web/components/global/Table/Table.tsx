import { Props } from './Table.types';

export default function Table({ items }: Props) {
    return (
        <div>
            <table>
                <tr>
                    <th>Nro</th>
                    <th>Amount</th>
                    <th>Payment Deadline</th>
                    <th>Status</th>
                </tr>
                <tbody className='bg-bg-200'>
                    {
                        items.map((item, i) => {
                            return <tr key={item.id}>
                                <td className='text-center'>{i + 1}</td>
                                <td className='text-center'>{item.amount} asdf</td>
                                <td className='text-center'>{item.paymentDeadline}</td>
                                <td className='text-center'>
                                    <div className='border rounded-xl py-1 px-3'>
                                        {item.status}
                                    </div>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
