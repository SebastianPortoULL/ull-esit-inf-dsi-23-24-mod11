import { Color } from "./color.js";
import { Tipo } from "./tipo.js";
import { Rareza } from "./rareza.js";

/**
 * @brief Interfaz que representa una carta del juego.
 * @param id Identificador único de la carta.
 * @param nombre Nombre de la carta.
 * @param costeMana Coste de maná de la carta.
 * @param color Color de la carta.
 * @param tipo Tipo de la carta.
 * @param rareza Rareza de la carta.
 * @param textoReglas Texto de reglas de la carta.
 * @param fuerza Fuerza de la carta (solo para criaturas).
 * @param resistencia Resistencia de la carta (solo para criaturas).
 * @param marcasLealtad Marcas de lealtad de la carta (solo para Planeswalker).
 * @param valorMercado Valor de mercado de la carta.
 */
export interface Carta {
  id: number;
  nombre: string;
  costeMana: number;
  color: Color;
  tipo: Tipo;
  rareza: Rareza;
  textoReglas: string;
  fuerza?: number;
  resistencia?: number;
  marcasLealtad?: number;
  valorMercado: number;
}