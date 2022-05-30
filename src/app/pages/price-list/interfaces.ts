export type ModalAction = 'new' | 'edit' | 'show';

export interface HourPrice {
    from: string;
    to: string;
    price: number;
}

export interface PriceList {
    name: string,
    hours: { [key: string]: HourPrice; };
}