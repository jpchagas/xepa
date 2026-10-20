// Seasonal produce (época de safra) for the "da estação" badge.
//
// SEASONS lists the foods of each season by their everyday name;
// FOOD_PRODUCTS maps each name to the CEASA products it covers.
// `npm test` checks every CEASA name and that every food is mapped.
//
// Seasons follow the southern hemisphere (equinoxes and solstices),
// so months shared by two seasons (e.g. March) aren't ambiguous.
// Imported products are left out: they follow another harvest.

export const SEASONS = [
  {
    id: 'verao',
    name: 'Verão',
    months: 'dezembro a março',
    starts: { month: 12, day: 21 },
    foods: {
      frutas: ['manga', 'melancia', 'melão', 'abacaxi', 'mamão', 'maracujá'],
      legumes: ['pepino', 'tomate', 'abobrinha', 'quiabo', 'pimentão'],
      verduras: ['alface', 'rúcula', 'chicória', 'cebolinha']
    }
  },
  {
    id: 'outono',
    name: 'Outono',
    months: 'março a junho',
    starts: { month: 3, day: 21 },
    foods: {
      frutas: ['abacate', 'caqui', 'maçã', 'laranja', 'tangerina'],
      legumes: ['beterraba', 'cenoura', 'abóbora', 'inhame'],
      verduras: ['couve', 'brócolis', 'repolho', 'acelga']
    }
  },
  {
    id: 'inverno',
    name: 'Inverno',
    months: 'junho a setembro',
    starts: { month: 6, day: 21 },
    foods: {
      frutas: ['morango', 'tangerina', 'laranja', 'abacate', 'maçã'],
      legumes: ['batata-doce', 'cenoura', 'beterraba', 'mandioca'],
      verduras: ['espinafre', 'agrião', 'couve', 'couve-flor']
    }
  },
  {
    id: 'primavera',
    name: 'Primavera',
    months: 'setembro a dezembro',
    starts: { month: 9, day: 23 },
    foods: {
      frutas: ['jabuticaba', 'acerola', 'ameixa', 'manga', 'uva'],
      legumes: ['abobrinha', 'berinjela', 'tomate', 'pimentão'],
      verduras: ['rúcula', 'alface', 'brócolis', 'espinafre']
    }
  }
]


export const FOOD_PRODUCTS = {
  // Frutas
  abacate: ['Abacate Avocado', 'Abacate Comum'],
  abacaxi: ['Abacaxi Perola', 'Abacaxi Terra de Areia'],
  acerola: ['Acerola'],
  ameixa: ['Ameixa Nacional'],
  caqui: ['Caqui Fuyu', 'Caqui Chocolate', 'Caqui Mole'],
  jabuticaba: ['Jabuticaba'],
  laranja: ['Laranja Suco', 'Laranja Umbigo (Bahia)', 'Laranja do Céu'],
  maçã: ['Maçã Gala Nacional', 'Maçã Fugi Nacional'],
  mamão: ['Mamão Formosa', 'Mamão Amazonas (Papaia)'],
  manga: ['Manga Tommy Atkins', 'Manga Palmer', 'Manga Espada'],
  maracujá: ['Maracujá Azedo', 'Maracujá Doce'],
  melancia: ['Melancia', 'Melancia Kodama / Baby', 'Melancia Pingo Doce'],
  melão: [
    'Melão Comum (Gaucho)',
    'Melão Cantaloupe',
    'Melão Espanhol',
    'Melão Galia',
    'Melão Orange',
    'Melão Pele de Sapo',
    'Melão Rei'
  ],
  morango: ['Morango'],
  tangerina: [
    'Tangerina Ponkan',
    'Tangerina Montenegrina',
    'Tangerina Murcott',
    'Tangerina Comum / Cai',
    'Tangerina Outras'
  ],
  uva: ['Uva Comum de Mesa', 'Uva Fina Mesa'],

  // Legumes
  abobrinha: ['Abobrinha Italiana', 'Abobrinha Tronco'],
  abóbora: ['Abobora', 'Moranga Cabotiá', 'Moranga Amarela / Vermelha', 'Moranga Mini'],
  'batata-doce': ['Batata Doce'],
  berinjela: ['Berinjela'],
  beterraba: ['Beterraba'],
  cenoura: ['Cenoura', 'Cenoura Baby'],
  inhame: ['Inhame'],
  mandioca: ['Mandioca'],
  pepino: ['Pepino Salada', 'Pepino Japones', 'Pepino Conserva'],
  pimentão: [
    'Pimentão Verde',
    'Pimentão Vermelho',
    'Pimentão Amarelo',
    'Pimentão Capeleti',
    'Pimentão Mini'
  ],
  quiabo: ['Quiabo'],
  tomate: [
    'Tomate Longa Vida',
    'Tomate Italiano',
    'Tomate Gaucho',
    'Tomate Rasteiro',
    'Tomate Cereja (Mini Tomates)'
  ],

  // Verduras
  acelga: ['Acelga'],
  agrião: ['Agrião'],
  alface: ['Alface Crespa', 'Alface Lisa', 'Alface Americana', 'Alface Mimosa'],
  brócolis: ['Brocolis'],
  // CEASA doesn't sell cebolinha alone; it comes in the tempero verde
  // bunch (salsa + cebolinha).
  cebolinha: ['Tempero Verde'],
  chicória: ['Chicória'],
  couve: ['Couve Manteiga', 'Couve Verde'],
  'couve-flor': ['Couve Flor'],
  espinafre: ['Espinafre'],
  repolho: ['Repolho Verde', 'Repolho Roxo'],
  rúcula: ['Rúcula']
}
