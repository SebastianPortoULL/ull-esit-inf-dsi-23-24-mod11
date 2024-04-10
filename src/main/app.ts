import yargs from 'yargs';
import { Color } from '../code/color.js';
import { Tipo } from '../code/tipo.js';
import { Rareza } from '../code/rareza.js';
import { Carta } from '../code/carta.js';
import { Coleccion } from '../code/coleccion.js';
import { hideBin } from 'yargs/helpers';

let coleccion = new Coleccion();

const argv = yargs(hideBin(process.argv))
  .command({
    command: 'añadir',
    describe: 'Añadir una carta a la colección',
    builder: {
      usuario: {
        describe: 'Nombre del usuario',
        demandOption: true,
        type: 'string',
      },
      id: {
        describe: 'ID de la carta',
        demandOption: true,
        type: 'number',
      },
      nombre: {
        describe: 'Nombre de la carta',
        demandOption: true,
        type: 'string',
      },
      costeMana: {
        describe: 'Coste de maná',
        demandOption: true,
        type: 'number',
      },
      color: {
        describe: 'Color',
        demandOption: true,
        choices: Object.keys(Color),
        type: 'string',
      },
      tipo: {
        describe: 'Tipo',
        demandOption: true,
        choices: Object.keys(Tipo),
        type: 'string',
      },
      rareza: {
        describe: 'Rareza',
        demandOption: true,
        choices: Object.keys(Rareza),
        type: 'string',
      },
      textoReglas: {
        describe: 'Texto de reglas',
        demandOption: true,
        type: 'string',
      },
      fuerza: {
        describe: 'Fuerza (solo para criaturas)',
        type: 'number',
      },
      resistencia: {
        describe: 'Resistencia (solo para criaturas)',
        type: 'number',
      },
      marcasLealtad: {
        describe: 'Marcas de lealtad (solo para Planeswalker)',
        type: 'number',
      },
      valorMercado: {
        describe: 'Valor de mercado',
        demandOption: true,
        type: 'number',
      },
    },
    handler: (argv) => {
      const carta: Carta = {
        id: argv.id,
        nombre: argv.nombre,
        costeMana: argv.costeMana,
        color: Color[argv.color as keyof typeof Color],
        tipo: Tipo[argv.tipo as keyof typeof Tipo],
        rareza: Rareza[argv.rareza as keyof typeof Rareza],
        textoReglas: argv.textoReglas,
        fuerza: argv.fuerza,
        resistencia: argv.resistencia,
        marcasLealtad: argv.marcasLealtad,
        valorMercado: argv.valorMercado,
      };
      coleccion.añadirCarta(argv.usuario, carta);
    },
  })
	.command({
	  command: 'modificar',
	  describe: 'Modificar una carta de la colección',
	  builder: {
	    usuario: {
	      describe: 'Nombre del usuario',
	      demandOption: true,
	      type: 'string',
	    },
	    id: {
	      describe: 'ID de la carta',
	      demandOption: true,
	      type: 'number',
	    },
			nombre: {
	      describe: 'Nombre de la carta',
	      type: 'string',
	    },
	    costeMana: {
	      describe: 'Coste de maná',
	      type: 'number',
	    },
	    color: {
	      describe: 'Color',
	      choices: Object.keys(Color),
	      type: 'string',
	    },
	    tipo: {
	      describe: 'Tipo',
	      choices: Object.keys(Tipo),
	      type: 'string',
	    },
	    rareza: {
	      describe: 'Rareza',
	      choices: Object.keys(Rareza),
	      type: 'string',
	    },
	    textoReglas: {
	      describe: 'Texto de reglas',
	      type: 'string',
	    },
	    fuerza: {
	      describe: 'Fuerza (solo para criaturas)',
	      type: 'number',
	    },
	    resistencia: {
	      describe: 'Resistencia (solo para criaturas)',
	      type: 'number',
	    },
	    marcasLealtad: {
	      describe: 'Marcas de lealtad (solo para Planeswalker)',
	      type: 'number',
	    },
	    valorMercado: {
	      describe: 'Valor de mercado',
	      type: 'number',
	    },			
	  },
	  handler: (argv) => {
	    const carta: Carta = {
	      id: argv.id,
	      nombre: argv.nombre,
	      costeMana: argv.costeMana,
	      color: Color[argv.color as keyof typeof Color],
	      tipo: Tipo[argv.tipo as keyof typeof Tipo],
	      rareza: Rareza[argv.rareza as keyof typeof Rareza],
	      textoReglas: argv.textoReglas,
	      fuerza: argv.fuerza,
	      resistencia: argv.resistencia,
	      marcasLealtad: argv.marcasLealtad,
	      valorMercado: argv.valorMercado,
	    };
	    coleccion.modificarCarta(argv.usuario, carta, argv);
	  },
	})
	.command({
	  command: 'eliminar',
	  describe: 'Eliminar una carta de la colección',
	  builder: {
	    usuario: {
	      describe: 'Nombre del usuario',
	      demandOption: true,
	      type: 'string',
	    },
	    id: {
	      describe: 'ID de la carta',
	      demandOption: true,
	      type: 'number',
	    },
	  },
	  handler: (argv) => {
	    coleccion.eliminarCarta(argv.usuario, argv.id);
	  },
	})
	.command({
	  command: 'listar',
	  describe: 'Listar las cartas en la colección',
	  builder: {
	    usuario: {
	      describe: 'Nombre del usuario',
	      demandOption: true,
	      type: 'string',
	    },
	  },
	  handler: (argv) => {
	    coleccion.listarCartas(argv.usuario);
	  },
	})
	.command({
	  command: 'mostrar',
	  describe: 'Mostrar información de una carta específica',
	  builder: {
	    usuario: {
	      describe: 'Nombre del usuario',
	      demandOption: true,
	      type: 'string',
	    },
	    id: {
	      describe: 'ID de la carta',
	      demandOption: true,
	      type: 'number',
	    },
	  },
	  handler: (argv) => {
	    coleccion.mostrarCarta(argv.usuario, argv.id);
	  },
	})
	.help()
	.alias('help', 'h')
	.argv;

