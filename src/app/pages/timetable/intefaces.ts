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
    isPayed: boolean;
}

export type ReservationForm = Pick<Reservation, 'form'>;

export interface ActiveFilters {
    playerOne: { isActive: boolean, isDisabled: boolean; };
    playerTwo: { isActive: boolean, isDisabled: boolean; };
    allOpponentsOne: { isActive: boolean, isDisabled: boolean; };
    allOpponentsTwo: { isActive: boolean, isDisabled: boolean; };
    opponentOne: { isActive: boolean, isDisabled: boolean; };
    opponentTwo: { isActive: boolean, isDisabled: boolean; };
}