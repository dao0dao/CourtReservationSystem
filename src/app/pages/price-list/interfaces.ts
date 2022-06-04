export type ModalAction = 'new' | 'edit' | 'show';

export interface HourPrice {
    from: string;
    to: string;
    price: number;
}

export interface PriceList {
    id?: string;
    name: string;
    hours: { [key: string]: HourPrice; };
}

export interface ApiError {
    status: number;
    error: {
        alreadyExist?: boolean;
    };
}