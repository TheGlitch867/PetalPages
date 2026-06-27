export type AlphabetLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

export interface AlphabetChallengeEntry {
  title: string;
  colorId?: AlphabetColorId;
  completed?: boolean;
}

export type AlphabetChallengeEntries = Partial<
  Record<AlphabetLetter, AlphabetChallengeEntry>
>;

export type AlphabetColorId =
  | "red"
  | "orange"
  | "yellow"
  | "pale-yellow"
  | "pale-green"
  | "grass-green"
  | "baby-blue"
  | "ocean-blue"
  | "light-purple"
  | "lilac-blue"
  | "baby-pink"
  | "magenta"
  | "white"
  | "grey"
  | "brown";
