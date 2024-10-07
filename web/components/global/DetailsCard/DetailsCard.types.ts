export interface Detail {
    members: number
    interestEarned: number
    period: string
    finalized: string
    groupId: string
    name: string
    amount: number
}

export interface Props {
    detail: Detail
}
