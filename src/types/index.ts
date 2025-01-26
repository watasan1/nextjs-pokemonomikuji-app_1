import { FORTUNE_LEVELS, LUCKY_PARAMS, TYPE_TRANSLATIONS } from "@/constants";

// APIからのレスポンスの型定義
interface PokeAPIResponse {
  id: number;
  name: string;
  stats: Array<{
    base_stat: number;
    stat: {
      name: StatKey;
    };
  }>;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: keyof typeof TYPE_TRANSLATIONS;
    };
  }>;
}

interface SpeciesResponse {
  names: Array<{
    name: string;
    language: {
      name: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

// ポケモンの基本情報の型定義
interface Pokemon {
  id: number;
  name: string;
  nameJa: string;
  stats: Record<LuckyParamValue, number>;
  imageUrl: string;
  type: Array<keyof typeof TYPE_TRANSLATIONS>;

  flavorText: string;
}

// 運勢は、日本語で５種類
type FortuneLevel = (typeof FORTUNE_LEVELS)[number];

interface FortuneResult {
  level: FortuneLevel;
  pokemon: Pokemon;
}

// ポケモンの能力パラメータ
export type StatKey = keyof typeof LUCKY_PARAMS;
export type LuckyParamValue = (typeof LUCKY_PARAMS)[StatKey];

export type {
  Pokemon,
  PokeAPIResponse,
  SpeciesResponse,
  FortuneLevel,
  FortuneResult,
};
