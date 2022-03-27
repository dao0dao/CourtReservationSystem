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