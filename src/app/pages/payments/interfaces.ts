export interface Services {
    name: string;
    cost: number;
}

export type Action = undefined | 'payments' | 'charge';