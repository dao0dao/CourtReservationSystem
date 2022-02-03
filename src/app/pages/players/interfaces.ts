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

export interface Player {
  weeks: Week[];
  opponents: Opponent[];
  name: string,
  surname: string,
  telephone: number,
  email: string,
  account: number,
  priceSummer: number,
  priceWinter: number,
  court: number,
  strings: string,
  tension: number,
  balls: string,
  notes: string;
};

export interface AddPlayerError {
  name?: boolean;
  surname?: boolean;
  telephone?: boolean;
  email?: boolean;
  account?: boolean;
  priceSummer?: boolean;
  priceWinter?: boolean;
  court?: boolean;
  strings?: boolean;
  tension?: boolean;
  balls?: boolean;
  opponents?: boolean;
  weeks?: boolean;
  notes?: boolean;
}

