import { Product } from "./product.model";
import { Currency } from "./currency.model"; 

export interface Receipt{
    id:string;
    img: string;
    date: string;
    counter: number;
    hour: string;
    clientId: string;    
    openingId: string;
    products: Product[];
    amountReceived: number;
    change: number;
    cashierId: string;     
    currency: Currency[];
    tax: number;
    taxPercent: number;
    subtotal: number; 
    total:number;  
}