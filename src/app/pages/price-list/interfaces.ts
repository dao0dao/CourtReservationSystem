export type ModalAction = 'new' | 'edit' | 'show';

export interface HourPrice {
    from: string;
    to: string;
    price: number;
}

export interface HourPriceNumber {
    from: number;
    to: number;
    price: number;
}

export interface PriceList {
    id?: string;
    name: string;
    hours: { [key: string]: HourPrice; };
}

export type PriceListNumber = Omit<PriceList, 'hours'> & { hours: { [key: string]: HourPriceNumber; }; };

export interface ApiError {
    status: number;
    error: {
        alreadyExist?: boolean;
    };
}