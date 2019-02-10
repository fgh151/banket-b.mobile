import type {Organization} from './Organization';

export type ProposalListItemType = {
    index: number,
    item: ProposalType
}

export type ProposalType = {
    id: number,
    City: string,
    date: string,
    time: string,
    guests_count: number,
    amount: number,
    type: number,
    event_type: number,
    metro: number,
    dance: boolean,
    private: boolean,
    own_alcohol: boolean,
    parking: boolean,
    comment: string,
    minCost: number,
    organizations: Organization[],
    profit: number,
    answers: number

}
