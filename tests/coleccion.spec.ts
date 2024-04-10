import 'mocha';
import { expect } from 'chai';

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import { Color } from '../src/code/color.js';
import { Tipo } from '../src/code/tipo.js';
import { Rareza } from '../src/code/rareza.js';
import { Carta } from '../src/code/carta.js';
import { Coleccion } from '../src/code/coleccion.js';

describe('Tests de la clase Coleccion', () => {
	const coleccion: Coleccion = new Coleccion();
	let carta_planewalker: Carta;
	let carta_criatura: Carta;
	let carta: Carta;
	let carta_err_criatura: Carta;
	let carta_err_planeswalker: Carta;
	let carta_err: Carta;
	let usuario: string;
	beforeEach(() => {
		usuario = 'Test';
		carta_criatura = {
			id: 1, 
			nombre: 'Test', 
			costeMana: 1, 
			color: Color.blue, 
			tipo: Tipo.Criatura, 
			rareza: Rareza.Comun, 
			textoReglas: 'Test', 
			fuerza: 2, 
			resistencia: 3, 
			valorMercado: 1
		};
		carta_planewalker = {
			id: 2,
			nombre: 'Test', 
			costeMana: 1, 
			color: Color.colorless, 
			tipo: Tipo.Planeswalker, 
			rareza: Rareza.Comun, 
			textoReglas: 'Test', 
			marcasLealtad: 2, 
			valorMercado: 1
		};
		carta = {
			id: 3, 
			nombre: 'Test', 
			costeMana: 1, 
			color: Color.multicolor, 
			tipo: Tipo.Tierra, 
			rareza: Rareza.Comun, 
			textoReglas: 'Test', 
			valorMercado: 1
		};
		carta_err_criatura = {
			id: 4, 
			nombre: 'Test', 
			costeMana: 1, 
			color: Color.white, 
			tipo: Tipo.Criatura, 
			rareza: Rareza.Comun, 
			textoReglas: 'Test', 
			valorMercado: 1
		};
		carta_err_planeswalker = {
			id: 5, 
			nombre: 'Test', 
			costeMana: 1, 
			color: Color.colorless, 
			tipo: Tipo.Planeswalker, 
			rareza: Rareza.Comun, 
			textoReglas: 'Test', 
			valorMercado: 1
		};
		carta_err = {
			id: 6, 
			nombre: 'Test', 
			costeMana: 1, 
			color: Color.multicolor, 
			tipo: Tipo.Tierra, 
			rareza: Rareza.Comun, 
			textoReglas: 'Test', 
			valorMercado: 1
		};
	});

	it('Se crea una Coleccion correctamente', () => {
		expect(coleccion).to.be.an.instanceof(Coleccion);
	});

	it('Se añade de forma asíncrona una carta correctamente', (done) => {
    coleccion.añadirCartaAsync(usuario, carta_criatura, (error?: Error, data?: Carta) => {
		  if (error) {
		  	expect(error.message).to.eql('La carta ya existe en la colección.');
		  } else {
		  	expect(data).to.be.deep.equal(carta_criatura);
		  }
    });
    coleccion.añadirCartaAsync(usuario, carta_err_criatura, (error?: Error, data?: Carta) => {
		  if (error) {
		  	expect(error.message).to.eql('Las criaturas deben tener fuerza y resistencia.');
		  } else {
		  	expect(data).to.be.deep.equal(carta_err_criatura);
		  }
    });

    carta_err.fuerza = 2;
    coleccion.añadirCartaAsync(usuario, carta_err, (error?: Error, data?: Carta) => {
		  if (error) {
		  	expect(error.message).to.eql('Las cartas que no son criaturas no deben tener fuerza ni resistencia.');
		  } else {
		  	expect(data).to.be.deep.equal(carta_err);
		  }
    });		
    carta_err.fuerza = undefined;
		
    coleccion.añadirCartaAsync(usuario, carta_err_planeswalker, (error?: Error, data?: Carta) => {
		  if (error) {
		  	expect(error.message).to.eql('Los Planeswalker deben tener marcas de lealtad.');
		  } else {
		  	expect(data).to.be.deep.equal(carta_err_criatura);
		  }
    });

    carta_err.marcasLealtad = 2;
    coleccion.añadirCartaAsync(usuario, carta_err, (error?: Error, data?: Carta) => {
		  if (error) {
		  	expect(error.message).to.eql('Las cartas que no son Planeswalker no deben tener marcas de lealtad.');
		  } else {
		  	expect(data).to.be.deep.equal(carta_err);
		  }
    });
    done();
  });

  it('Se muestra una carta de forma asíncrona correctamente', (done) => {
    coleccion.mostrarCartaAsync(usuario, carta_criatura.id, (error?: Error, data?: string) => {
		  if (error) {
		  	expect(error.message).to.eql(`La carta no existe en la colección.`);
		  } else {
		  	expect(data).to.be.deep.equal(chalk.blue('\{\n  "id": 1,\n  "nombre": "Test",\n  "costeMana": 1,\n  "color": 1,\n  "tipo": 1,\n  "rareza": 0,\n  "textoReglas": "Test",\n  "fuerza": 2,\n  "resistencia": 3,\n  "valorMercado": 1\n\}'));
		  }
    });
    coleccion.mostrarCartaAsync(usuario, carta_err.id, (error?: Error, data?: string) => {
		  if (error) {
		  	expect(error.message).to.eql(`La carta no existe en la colección.`);
		  } else {
		  	expect(data).to.be.deep.equal(chalk.red('x'));
		  }
    });
    done();
  })
});