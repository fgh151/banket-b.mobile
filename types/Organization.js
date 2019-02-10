import {Metro} from "./Metro";
import type {Hall} from "./Hall";

export  type Organization ={
id:number,
    name:string,
    contact:string,
    phone:string,
    email:string,
    address:string,
    images:string[],
    amount:number,
    halls:Hall[],
    metro:Metro[],



    rating:number,
    profit:number,
    minPrice:number,
    lastMessage:number

}