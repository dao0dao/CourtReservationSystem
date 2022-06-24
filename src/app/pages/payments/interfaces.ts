export interface Services {
    id?: string;
    name: string;
    cost: number;
    isDeleting?: boolean;
}

export type Action = undefined | 'payments' | 'charge';