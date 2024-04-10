import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import { Color } from './color.js';
import { Tipo } from './tipo.js';
import { Rareza } from './rareza.js';
import { Carta } from './carta.js';

const DIR_BASE = './usuarios';

/**
 * @brief Clase que representa una colección de cartas.
 */
export class Coleccion {

	private dirBase: string;

	/**
	 * @brief Crea una instancia de la clase Coleccion.
	 */
	constructor() {
		this.dirBase = DIR_BASE;
	}

	/**
	 * @brief Obtiene el directorio base de la colección.
	 * @returns El directorio base de la colección.
	 */
	get dirbase() { return this.dirBase; }

  /**
   * @brief Añade una carta a la colección de un usuario.
   * @param usuario - El nombre del usuario.
   * @param carta - La carta a añadir.
   */
  añadirCarta(usuario: string, carta: Carta) : void {
    const dirUsuario = path.join(this.dirbase, usuario);
    if (!fs.existsSync(dirUsuario)) {
      fs.mkdirSync(dirUsuario);
    }

    const filePath = path.join(dirUsuario, `${carta.id}.json`);
    if (fs.existsSync(filePath)) {
      console.error(chalk.red('Error: La carta ya existe en la colección.'));
      throw new Error('La carta ya existe en la colección.');
    }

		// Si es de tipo Criatura, comprobar que tiene fuerza y resistencia. Si no es Criatura, no deben existir estos campos
		if (carta.tipo === Tipo.Criatura && (!carta.fuerza || !carta.resistencia)) {
			console.error(chalk.red('Error: Las criaturas deben tener fuerza y resistencia.'));
			throw new Error('Las criaturas deben tener fuerza y resistencia.');
		} 
		if (carta.tipo !== Tipo.Criatura && (carta.fuerza || carta.resistencia)) {
			console.error(chalk.red('Error: Las cartas que no son criaturas no deben tener fuerza ni resistencia.'));
			throw new Error('Las cartas que no son criaturas no deben tener fuerza ni resistencia.');
		}

		// Si es de tipo Planeswalker, comprobar que tiene marcas de lealtad. Si no es Planeswalker, no deben existir estas marcas
		if (carta.tipo === Tipo.Planeswalker && !carta.marcasLealtad) {
			console.error(chalk.red('Error: Los Planeswalker deben tener marcas de lealtad.'));
			throw new Error('Los Planeswalker deben tener marcas de lealtad.');
		}
		if (carta.tipo !== Tipo.Planeswalker && carta.marcasLealtad) {
			console.error(chalk.red('Error: Las cartas que no son Planeswalker no deben tener marcas de lealtad.'));
			throw new Error('Las cartas que no son Planeswalker no deben tener marcas de lealtad.');
		}

    fs.writeFileSync(filePath, JSON.stringify(carta, null, 2));
    console.log(chalk.green('Carta añadida correctamente.'));
  }

  /**
   * @brief Modifica una carta de la colección de un usuario.
   * @param usuario - El nombre del usuario.
   * @param carta - La carta a modificar.
   * @param argv - Los argumentos de modificación.
   */
  modificarCarta(usuario: string, carta: Carta, argv: any) : void {
    const dirUsuario = path.join(this.dirbase, usuario);
    const filePath = path.join(dirUsuario, `${carta.id}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red('Error: La carta no existe en la colección.'));
      throw new Error('La carta no existe en la colección.');
    }

    const cartaExistente : Carta = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Carta;
    
    // Actualizar solo los campos especificados en argv
  	if (argv.nombre) cartaExistente.nombre = argv.nombre;
  	if (argv.costeMana) cartaExistente.costeMana = argv.costeMana;
  	if (argv.color) cartaExistente.color = Color[argv.color as keyof typeof Color];
  	if (argv.tipo) cartaExistente.tipo = Tipo[argv.tipo as keyof typeof Tipo];
  	if (argv.rareza) cartaExistente.rareza = Rareza[argv.rareza as keyof typeof Rareza];
  	if (argv.textoReglas) cartaExistente.textoReglas = argv.textoReglas;
  	if (argv.fuerza) cartaExistente.fuerza = argv.fuerza;
  	if (argv.resistencia) cartaExistente.resistencia = argv.resistencia;
  	if (argv.marcasLealtad) cartaExistente.marcasLealtad = argv.marcasLealtad;
  	if (argv.valorMercado) cartaExistente.valorMercado = argv.valorMercado;

    fs.writeFileSync(filePath, JSON.stringify(cartaExistente, null, 2));
    console.log(chalk.green('Carta modificada correctamente.'));
  }

  /**
   * @brief Elimina una carta de la colección de un usuario.
   * @param usuario - El nombre del usuario.
   * @param id - El ID de la carta a eliminar.
   */
  eliminarCarta(usuario: string, id: number) : void {
    const dirUsuario = path.join(this.dirbase, usuario);
    const filePath = path.join(dirUsuario, `${id}.json`);

    if (!fs.existsSync(filePath)) {
      console.error(chalk.red('Error: La carta no existe en la colección.'));
      throw new Error('La carta no existe en la colección.');
    }

    fs.unlinkSync(filePath);
    console.log(chalk.green('Carta eliminada correctamente.'));
  }

  /**
   * @brief Lista todas las cartas de la colección de un usuario.
   * @param usuario - El nombre del usuario.
   */
  listarCartas(usuario: string) : void {
    const dirUsuario = path.join(this.dirbase, usuario);

    if (!fs.existsSync(dirUsuario)) {
      console.error(chalk.red('Error: El usuario no tiene cartas en su colección.'));
      throw new Error('El usuario no tiene cartas en su colección.');
    }

    const files = fs.readdirSync(dirUsuario);
    files.forEach(file => {
      const filePath = path.join(dirUsuario, file);
      const carta = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Carta;
      const text : string = JSON.stringify(carta, null, 2);
      if (carta.color === Color.colorless) {
        console.log(text);
      } else if (carta.color === Color.multicolor) {
        // Multicolor no es un color en sí mismo, sino una combinación de colores, cada letra del texto tendra uno de los 5 colores básicos
        let coloredText : string = '';
        for (let i = 0; i < text.length; i += 5) {
          for (let j = 0; j < 5; j++) {
            coloredText += (chalk as any)[Color[j]](text[i + j]);
          }
        }
        console.log(coloredText);
      } else {
        const coloredText : string = (chalk as any)[Color[carta.color]](text);
        console.log(coloredText);
      }
    });
  }

  /**
   * @brief Muestra una carta específica de la colección de un usuario.
   * @param usuario - El nombre del usuario.
   * @param id - El ID de la carta a mostrar.
   */
  mostrarCarta(usuario: string, id: number) : void {
    const dirUsuario = path.join(this.dirbase, usuario);
    const filePath = path.join(dirUsuario, `${id}.json`);

    if (!fs.existsSync(filePath)) {
      console.error(chalk.red('Error: La carta no existe en la colección.'));
      throw new Error('La carta no existe en la colección.');
    }

    const carta = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Carta;
    const text : string = JSON.stringify(carta, null, 2);
    if (carta.color === Color.colorless) {
      console.log(text);
    } else if (carta.color === Color.multicolor) {
      // Multicolor no es un color en sí mismo, sino una combinación de colores, cada letra del texto tendra uno de los 5 colores básicos
      let coloredText : string = '';
      for (let i = 0; i < text.length; i += 5) {
        for (let j = 0; j < 5; j++) {
          coloredText += (chalk as any)[Color[j]](text[i + j]);
        }
      }
      console.log(coloredText);
    } else {
      const coloredText : string = (chalk as any)[Color[carta.color]](text);
      console.log(coloredText);
    }
  }

  // Práctica 11: Ejercicios - PE101
  /**
   * @brief Añade una carta a la colección de un usuario.
   * @param usuario - El nombre del usuario.
   * @param carta - La carta a añadir.
   * @param callback - Callback usando la API asíncrona que recoge un error o la carta que se ha añadido
   */
  añadirCartaAsync(usuario: string, carta: Carta, callback:(err?: Error | undefined, data?: Carta | undefined) => void) : void {
    const dirUsuario = path.join(this.dirbase, usuario);
    fs.mkdir(dirUsuario, (error) => {
      if(!error) {
        console.log(chalk.green(`Se ha creado el directorio /${usuario}`))
      }
    });
    // if (!fs.existsSync(dirUsuario)) {
    //   fs.mkdirSync(dirUsuario);
    // }

    const filePath = path.join(dirUsuario, `${carta.id}.json`);
    // if (fs.existsSync(filePath)) {
    //   console.error(chalk.red('Error: La carta ya existe en la colección.'));
    //   callback(new Error('La carta ya existe en la colección.'), undefined);
    //   return;
    // }
    // Si es de tipo Criatura, comprobar que tiene fuerza y resistencia. Si no es Criatura, no deben existir estos campos
    if (carta.tipo === Tipo.Criatura && (!carta.fuerza || !carta.resistencia)) {
      console.error(chalk.red('Error: Las criaturas deben tener fuerza y resistencia.'));
      callback(new Error('Las criaturas deben tener fuerza y resistencia.'), undefined);
      return;
    } 
    if (carta.tipo !== Tipo.Criatura && (carta.fuerza || carta.resistencia)) {
      console.error(chalk.red('Error: Las cartas que no son criaturas no deben tener fuerza ni resistencia.'));
      callback(new Error('Las cartas que no son criaturas no deben tener fuerza ni resistencia.'), undefined);
      return;
    }
  
    // Si es de tipo Planeswalker, comprobar que tiene marcas de lealtad. Si no es Planeswalker, no deben existir estas marcas
    if (carta.tipo === Tipo.Planeswalker && !carta.marcasLealtad) {
      console.error(chalk.red('Error: Los Planeswalker deben tener marcas de lealtad.'));
      callback(new Error('Los Planeswalker deben tener marcas de lealtad.'), undefined);
      return;
    }
    if (carta.tipo !== Tipo.Planeswalker && carta.marcasLealtad) {
      console.error(chalk.red('Error: Las cartas que no son Planeswalker no deben tener marcas de lealtad.'));
      callback(new Error('Las cartas que no son Planeswalker no deben tener marcas de lealtad.'), undefined);
      return;
    }
    fs.access(filePath, (error) => {
      if (error) {
        callback(new Error('La carta ya existe en la colección.'), undefined);
        return;
      }
    });

    fs.writeFile(filePath, JSON.stringify(carta, null, 2), (error) => {
      if (error) {
        callback(error, undefined);
        return;
      }
      callback(undefined, carta);
    });
    console.log(chalk.green('Carta añadida correctamente.'));
  }

  /**
   * @brief Muestra una carta específica de la colección de un usuario.
   * @param usuario - El nombre del usuario.
   * @param id - El ID de la carta a mostrar.
   * @param callback - Callback usando la API asíncrona que recoge un error o la información de la carta con el color especificado en la misma
   */
  mostrarCartaAsync(usuario: string, id: number, callback:(err?: Error | undefined, data?: string | undefined) => void) : void {
    const dirUsuario = path.join(this.dirbase, usuario);
    const filePath = path.join(dirUsuario, `${id}.json`);
    // if (!fs.existsSync(filePath)) {
    //   console.error(chalk.red('Error: La carta no existe en la colección.'));
    //   callback(new Error('La carta no existe en la colección.'), undefined);
    //   return;
    // }
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        callback(new Error('La carta no existe en la colección.'), undefined);
        return;
      }
      const carta = JSON.parse(data) as Carta;
      const text : string = JSON.stringify(carta, null, 2);
      if (carta.color === Color.colorless) {
        console.log(text);
        callback(undefined, text);
      } else if (carta.color === Color.multicolor) {
        // Multicolor no es un color en sí mismo, sino una combinación de colores, cada letra del texto tendra uno de los 5 colores básicos
        let coloredText : string = '';
        for (let i = 0; i < text.length; i += 5) {
          for (let j = 0; j < 5; j++) {
            coloredText += (chalk as any)[Color[j]](text[i + j]);
          }
        }
        console.log(coloredText);
        callback(undefined, coloredText);
      } else {
        const coloredText : string = (chalk as any)[Color[carta.color]](text);
        console.log(coloredText);
        callback(undefined, coloredText);
      }
    })
  }
}