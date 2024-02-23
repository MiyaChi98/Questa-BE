import { MultiChoise } from "src/constant/multichoise";

export type Quiz = {
  question: string;
  answer: MultiChoise;
  A: string;
  B: string;
  C?: string;
  D?: string;
  img?: string;
};
