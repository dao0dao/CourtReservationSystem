

export interface Services {
    id?: string;
    name: string;
    cost: number;
    isDeleting?: boolean;
}

export type Action = undefined | 'payments' | 'charge';

export interface ServicePayment {
    id: string,
    value: number,
    name: string;
    serviceName: string;
    paymentMethod: 'charge' | 'payment' | 'cash' | 'transfer' | 'debit';
}

export type PaymentMethod = ServicePayment['paymentMethod'];