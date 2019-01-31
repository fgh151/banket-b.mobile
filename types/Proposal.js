import type {Organization} from './Organization';

export type Proposal = {
    id: number,
    City: string,
    date: string,
    time:string,
    guests_count:number,
    amount:number,
    type:number,
    event_type:number,
    metro:number,
    dance:boolean,
    private:boolean,
    own_alcohol:boolean,
    parking:boolean,
    comment:string,
    minCost:number,
    organizations: Organization[],
    profit:number
    
}