import { Player } from "../players/interfaces";

export interface TimeTable {
    label: string;
}

export interface Reservation {
    id?: string;
    timetable: {
        transformY: number;
        transformX: number;
        ceilHeight: number;
        zIndex: number;
    };
    form: {
        date: string;
        timeFrom: string;
        timeTo: string;
        court: string;
        playerOne: Player | undefined;
        playerTwo: Player | undefined;
        guestOne: string;
        guestTwo: string;
    };
    payment: {
        hourCount: number;
    };

    isEditable?: boolean;
    isPlayerOnePayed: boolean;
    isPlayerTwoPayed: boolean;
}

export type ReservationForm = Pick<Reservation, 'form'>;

export type FormSQL = Omit<Reservation['form'], 'playerOne' | 'playerTwo'> & { playerOneId: string; } & { playerTwoId: string; };

export type ReservationSQL = Omit<Reservation, 'form'> & { form: FormSQL; };

export type UpdateReservationSQL = Omit<Partial<ReservationSQL>, 'form' | 'timetable' | 'payment'>
    & { form: Partial<Omit<FormSQL, 'date'>> & { date: string; }; }
    & { timetable?: Partial<Reservation['timetable']>; }
    & { payment?: Partial<Reservation['payment']>; };

export interface ActiveFilters {
    playerOne: { isActive: boolean, isDisabled: boolean; };
    playerTwo: { isActive: boolean, isDisabled: boolean; };
    allOpponentsOne: { isActive: boolean, isDisabled: boolean; };
    allOpponentsTwo: { isActive: boolean, isDisabled: boolean; };
    opponentOne: { isActive: boolean, isDisabled: boolean; };
    opponentTwo: { isActive: boolean, isDisabled: boolean; };
}

export interface DeleteConfirm {
    isConfirm: boolean,
    id?: string;
}