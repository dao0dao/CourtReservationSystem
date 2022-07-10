export interface Balance {
    id: string;
    playerId: string;
    playerName: string;
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
export type methodHistory = Omit<method, 'debet'>;

export interface BalancePayment {
    id: string;
    playerId: string;
    method: method;
}

export interface Timestamp {
    dateFrom: string,
    dateTo: string;
}

export interface Payment {
    playerId: string;
    historyId: string;
    price: number;
    service: string;
    method: methodHistory;
}