import { Player } from "../players/interfaces";

export interface TimeTable {
    label: string;
}

export interface Reservation {
    id: string;
    transformY: number;
    transformX: number;
    multiplierY: number;
    zIndex: number;

    date: string;
    timeFrom: string;
    timeTo: string;
    court: number;
    playerOne: Player | undefined;
    playerTwo: Player | undefined;
    guestOne: string;
    guestTwo: string;

    isPayed: boolean;
}

export type ReservationForm = Pick<Reservation, 'date' | 'timeFrom' | 'timeTo' | 'court' | 'playerOne' | 'playerTwo' | 'guestOne' | 'guestTwo'>;

export interface ActiveFilters {
    playerOne: { isActive: boolean, isDisabled: boolean; };
    playerTwo: { isActive: boolean, isDisabled: boolean; };
    allOpponentsOne: { isActive: boolean, isDisabled: boolean; };
    allOpponentsTwo: { isActive: boolean, isDisabled: boolean; };
    opponentOne: { isActive: boolean, isDisabled: boolean; };
    opponentTwo: { isActive: boolean, isDisabled: boolean; };
}