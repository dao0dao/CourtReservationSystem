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
    time: string;
    court: number;
    playerOne: Player;
    playerTwo: Player;
    isPayed: boolean;
}

export interface ActiveFilters {
    playerOne: { isActive: boolean };
    playerTwo: { isActive: boolean };
    allOpponentsOne: { isActive: boolean, isDisabled: boolean; };
    allOpponentsTwo: { isActive: boolean, isDisabled: boolean; };
    opponentOne: { isActive: boolean, isDisabled: boolean; };
    opponentTwo: { isActive: boolean, isDisabled: boolean; };
}