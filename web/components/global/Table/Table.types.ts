export interface item {
    id: string
    amount: number
    paymentDeadline: string
    status: 'Paid' | 'Play Now' | 'Pending'
}

export interface Props {
    items: item[]
}