import { LUCKY_PARAMS } from "@/constants";
import { PokeAPIResponse, Pokemon, SpeciesResponse } from "@/types";

// APIのエンドポイント
const BASE_URL = "https://pokeapi.co/api/v2";

// ポケモンの基本情報を取得する
async function fetchPokemonData(id: number): Promise<PokeAPIResponse> {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!response.ok) throw new Error("Failed to fetch Pokemon data");
  return response.json();
}

// ポケモンの詳細情報を取得する
async function fetchSpeciesData(id: number): Promise<SpeciesResponse> {
  const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!response.ok) throw new Error("Failed to fetch Pokemon species data");
  return response.json();
}
// 配列から日本語テキストを見つける
const findJapaneseText = <T extends { language: { name: string } }>(
  textArray: T[],
  targetProperty: keyof T
): string => {
  return (
    (textArray.find((item) => item.language.name === "ja")?.[
      targetProperty
    ] as string) || ""
  );
};

// ポケモンの詳細文の整形
export const formatFlavorText = (text: string): string => {
  return (
    text
      // 「。」+改行 の場合は改行のみを削除し、それ以外の改行は「、」に変換
      .replace(/。\n/g, "。")
      .replace(/\n/g, "、")
      // 全角スペースを削除
      .replace(/[　]/g, "")
      // 文末が「。」で終わってない場合は追加
      .replace(/([^。])$/, "$1。")
  );
};

// メインの取得関数
export async function getPokemon(id: number): Promise<Pokemon> {
  try {
    const [pokemonResponse, speciesResponse] = await Promise.all([
      fetchPokemonData(id),
      fetchSpeciesData(id),
    ]);

    const stats = pokemonResponse.stats.reduce(
      (acc, stat) => {
        const mappedStat = LUCKY_PARAMS[stat.stat.name];
        if (mappedStat) {
          acc[mappedStat] = stat.base_stat;
        }
        return acc;
      },
      {
        "健康運（体力）": 0,
        "仕事運（目標達成）": 0,
        "対人運（コミュニケーション力）": 0,
        "ひらめき（創造性）": 0,
        "ストレス耐性（精神力）": 0,
        "決断（行動力）": 0,
      }
    );

    const japaneseFlavorText = formatFlavorText(
      findJapaneseText(speciesResponse.flavor_text_entries, "flavor_text") || ""
    );

    return {
      id: pokemonResponse.id,
      name: pokemonResponse.name,
      nameJa: findJapaneseText(speciesResponse.names, "name"),
      stats,
      imageUrl: pokemonResponse.sprites.other["official-artwork"].front_default,
      type: pokemonResponse.types.map((type) => type.type.name),
      flavorText: japaneseFlavorText,
    };
  } catch (error) {
    throw new Error(`Failed to fetch Pokemon: ${error}`);
  }
}
