export interface Week {
  days: {
    0?: boolean | undefined;
    1?: boolean | undefined;
    2?: boolean | undefined;
    3?: boolean | undefined;
    4?: boolean | undefined;
    5?: boolean | undefined;
    6?: boolean | undefined;
  };
  time: {
    from: string;
    to: string;
  };
}

export interface Opponent {
  id: string,
  name: string,
  surname: string;
}

export type OpponentSql = Omit<Opponent, 'name' | 'surname'>;

export interface Player {
  id?: string;
  weeks: Week[];
  opponents: Opponent[];
  name: string,
  surname: string,
  telephone: number,
  email: string,
  account: number,
  priceListId: string;
  court: number,
  stringsName: string,
  tension: number,
  balls: string,
  notes: string;
};

export type PlayerSql = Omit<Player, 'opponents'> & { opponents: OpponentSql[]; };

export interface AddPlayerError {
  name?: boolean;
  surname?: boolean;
  telephone?: boolean;
  email?: boolean;
  account?: boolean;
  priceListId?: boolean;
  court?: boolean;
  strings?: boolean;
  tension?: boolean;
  balls?: boolean;
  opponents?: boolean;
  weeks?: boolean;
  notes?: boolean;
}

export interface EditPlayerError extends AddPlayerError {
  id?: boolean;
  nonExistPlayer?: boolean;
  alreadyExist?: boolean;
}