export interface Balance {
    id: string;
    date: string;
    service: string;
    price: number;
    isPaid: boolean;
    method: method;
    beforePayment: number;
    afterPayment: number;
    cashier: string;
}

export type method = 'payment' | 'cash' | 'transfer' | 'debet' | 'game';

export interface BalancePayment {
    id: string;
    playerId: string;
    method: method;
}

export interface Timestamp {
    dateFrom: string,
    dateTo: string;
}