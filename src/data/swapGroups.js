// Groups of CEASA products that can stand in for each other in the
// kitchen. A swap is only suggested inside a group, and only when the
// nutrition (src/data/nutrition.js) is close enough — see
// utils/swapHelpers.js. Nutrition alone isn't enough: lettuce and
// potato are both low in fat, but they aren't interchangeable.
//
// Each product:
//   ceasa   exact CEASA product name (checked by `npm test`)
//   tabnut  TabNut food id (https://tabnut.dis.epm.br/alimento/<id>);
//           `npm run nutrition` downloads these into nutrition.js
//   approx  true when TabNut has no entry for this exact food and the
//           closest one is used (shown to the user)
//   note    how it behaves when cooking, shown when suggesting it —
//           especially relevant for items added for a recipe
//
// Not covered: beef. TabNut (USDA SR25) has no Brazilian beef cuts
// (acém, patinho, alcatra...), so there's no data to compare them.

const SWAP_GROUPS = [
  {
    id: 'raizes',
    label: 'batatas e raízes',
    products: [
      { ceasa: 'Batata Branca', tabnut: '11354', note: 'Batata de uso geral: cozida, frita, assada ou em purê.' },
      { ceasa: 'Batata Rosa', tabnut: '11355', note: 'Polpa mais firme; segura bem o formato cozida e em saladas.' },
      { ceasa: 'Batata Doce', tabnut: '11507', note: 'Mais adocicada e cozinha mais rápido. Ótima assada; em purê, sopas e maionese o sabor fica mais doce.' },
      { ceasa: 'Mandioca', tabnut: '11134', note: 'Precisa de mais tempo de cozimento e fica mais firme e fibrosa.' },
      { ceasa: 'Inhame', tabnut: '11518', note: 'Textura cremosa; engrossa caldos e sopas.' },
      { ceasa: 'Cara', tabnut: '11601', note: 'Textura cremosa e levemente pegajosa; bom em sopas e purês.' }
    ]
  },
  {
    id: 'legumes',
    label: 'legumes de refogar',
    products: [
      { ceasa: 'Abobrinha Italiana', tabnut: '11477', note: 'Cozinha rápido e solta pouca água se refogada em fogo alto.' },
      { ceasa: 'Abobrinha Tronco', tabnut: '11477', approx: true, note: 'Parecida com a italiana, com casca mais grossa.' },
      { ceasa: 'Chuchu', tabnut: '11149', note: 'Sabor mais neutro e solta mais água; leva alguns minutos a mais.' },
      { ceasa: 'Berinjela', tabnut: '11209', note: 'Absorve bastante óleo e fica bem macia; muda a textura do prato.' }
    ]
  },
  {
    id: 'aboboras',
    label: 'abóboras',
    products: [
      { ceasa: 'Abobora', tabnut: '11422', note: 'Polpa mais aguada; ótima em doces e cozidos.' },
      { ceasa: 'Moranga Cabotiá', tabnut: '11422', approx: true, note: 'Polpa mais seca e doce; ideal para cremes e assados.' },
      { ceasa: 'Moranga Amarela / Vermelha', tabnut: '11422', approx: true, note: 'Boa para sopas, cremes e camarão na moranga.' }
    ]
  },
  {
    id: 'tomates',
    label: 'tomates',
    products: [
      { ceasa: 'Tomate Longa Vida', tabnut: '11529', note: 'Firme e durável; bom para saladas e molhos.' },
      { ceasa: 'Tomate Italiano', tabnut: '11529', note: 'Mais polpa e menos semente; o melhor para molhos.' },
      { ceasa: 'Tomate Gaucho', tabnut: '11529', note: 'Grande e suculento; ótimo em saladas.' },
      { ceasa: 'Tomate Rasteiro', tabnut: '11529', note: 'Mais ácido e aguado; bom para molhos de cozimento longo.' }
    ]
  },
  {
    id: 'cebolas',
    label: 'cebolas',
    products: [
      { ceasa: 'Cebola Nacional', tabnut: '11282', note: 'Uso geral em refogados.' },
      { ceasa: 'Cebola Importada', tabnut: '11282', note: 'Mesmo uso da nacional.' },
      { ceasa: 'Cebola Roxa', tabnut: '11282', note: 'Mais suave, ótima crua; no refogado deixa o prato arroxeado.' }
    ]
  },
  {
    id: 'pimentoes',
    label: 'pimentões',
    products: [
      { ceasa: 'Pimentão Verde', tabnut: '11333', note: 'Sabor mais amargo e marcante.' },
      { ceasa: 'Pimentão Vermelho', tabnut: '11821', note: 'Mais doce e suave; dá cor ao prato.' },
      { ceasa: 'Pimentão Amarelo', tabnut: '11951', note: 'Doce e suave, parecido com o vermelho.' }
    ]
  },
  {
    id: 'folhas-salada',
    label: 'folhas para salada',
    products: [
      { ceasa: 'Alface Crespa', tabnut: '11252', note: 'Folhas crocantes e de sabor neutro.' },
      { ceasa: 'Alface Lisa', tabnut: '11250', note: 'Folhas macias e delicadas; murcham mais rápido.' },
      { ceasa: 'Alface Americana', tabnut: '11253', note: 'Bem crocante e durável; ótima em lanches.' },
      { ceasa: 'Alface Mimosa', tabnut: '11252', approx: true, note: 'Folhas macias e onduladas.' },
      { ceasa: 'Rúcula', tabnut: '11959', note: 'Sabor picante; muda bastante o gosto da salada.' },
      { ceasa: 'Agrião', tabnut: '11591', note: 'Sabor picante e levemente amargo.' },
      { ceasa: 'Chicória', tabnut: '11152', note: 'Amarga; combina com molhos mais fortes.' },
      { ceasa: 'Radite / Almeirão', tabnut: '11152', approx: true, note: 'Amargo; bom refogado ou com molhos fortes.' }
    ]
  },
  {
    id: 'folhas-refogar',
    label: 'folhas para refogar',
    products: [
      { ceasa: 'Couve Manteiga', tabnut: '11161', note: 'Clássica refogada e no caldo verde.' },
      { ceasa: 'Couve Verde', tabnut: '11161', note: 'Folhas um pouco mais firmes que a couve-manteiga.' },
      { ceasa: 'Espinafre', tabnut: '11457', note: 'Murcha muito ao cozinhar: rende menos e cozinha em segundos.' },
      { ceasa: 'Mostarda', tabnut: '11270', note: 'Sabor picante e levemente amargo.' },
      { ceasa: 'Acelga', tabnut: '11147', note: 'Sabor suave; os talos precisam de mais tempo que as folhas.' }
    ]
  },
  {
    id: 'frango',
    label: 'frango',
    products: [
      { ceasa: 'Filé de Frango', tabnut: '05117', note: 'Carne branca, magra; cozinha rápido e resseca se passar do ponto.' },
      { ceasa: 'Filé Sassami de Frango', tabnut: '05117', note: 'A parte mais macia do peito; cozinha ainda mais rápido.' },
      { ceasa: 'Coxa e Sobrecoxa de Frango', tabnut: '05119', note: 'Carne escura e mais suculenta; com osso, leva mais tempo.' }
    ]
  },
  {
    id: 'suinos',
    label: 'carne suína',
    products: [
      { ceasa: 'Pernil Suino', tabnut: '10010', note: 'Mais magro; ótimo assado ou desfiado.' },
      { ceasa: 'Paleta Suína', tabnut: '10072', note: 'Um pouco mais gordurosa e macia; boa para cozidos e assados lentos.' }
    ]
  },
  {
    id: 'peixes',
    label: 'peixes',
    products: [
      { ceasa: 'Filé de Tilápia', tabnut: '15261', note: 'Carne branca e delicada; grelhada, assada ou empanada.' },
      { ceasa: 'Filé de Pescada', tabnut: '15132', approx: true, note: 'Carne branca e macia; desmancha fácil, melhor assada ou empanada.' },
      { ceasa: 'Filé de Merluza', tabnut: '15132', approx: true, note: 'Carne branca e macia; desmancha fácil, melhor assada ou empanada.' },
      { ceasa: 'Filé de Panga', tabnut: '15010', approx: true, note: 'Sabor suave e textura macia; solta água ao cozinhar.' },
      { ceasa: 'Filé de Cação', tabnut: '15095', note: 'Carne firme, sem espinhas; a melhor para moquecas e ensopados.' }
    ]
  },
  {
    id: 'bananas',
    label: 'bananas',
    products: [
      { ceasa: 'Banana Caturra / Nanica', tabnut: '09040', note: 'Mais doce e macia; ideal para bolos e vitaminas.' },
      { ceasa: 'Banana Prata / Branca', tabnut: '09040', note: 'Mais firme e menos doce; boa para comer e fritar.' },
      { ceasa: 'Banana Maçã', tabnut: '09040', note: 'Sabor que lembra maçã; delicada.' }
    ]
  },
  {
    id: 'macas',
    label: 'maçãs',
    products: [
      { ceasa: 'Maçã Gala Nacional', tabnut: '09003', note: 'Doce e crocante.' },
      { ceasa: 'Maçã Fugi Nacional', tabnut: '09003', note: 'Doce e suculenta.' },
      { ceasa: 'Maçã Gala Importada', tabnut: '09003', note: 'Doce e crocante.' },
      { ceasa: 'Maçã Fugi Importada', tabnut: '09003', note: 'Doce e suculenta.' },
      { ceasa: 'Maçã Red Delicious', tabnut: '09003', note: 'Doce, de polpa mais farinhenta.' },
      { ceasa: 'Maçã Granny Smith', tabnut: '09003', note: 'Verde e ácida; muda o sabor de tortas e saladas.' }
    ]
  },
  {
    id: 'laranjas',
    label: 'laranjas',
    products: [
      { ceasa: 'Laranja Suco', tabnut: '09200', note: 'Muito suculenta; feita para suco.' },
      { ceasa: 'Laranja Umbigo (Bahia)', tabnut: '09202', note: 'Doce e sem sementes; melhor para comer em gomos.' },
      { ceasa: 'Laranja do Céu', tabnut: '09200', approx: true, note: 'Pouquíssima acidez; o suco fica bem doce.' }
    ]
  },
  {
    id: 'tangerinas',
    label: 'tangerinas',
    products: [
      { ceasa: 'Tangerina Ponkan', tabnut: '09218', note: 'Grande e fácil de descascar.' },
      { ceasa: 'Tangerina Montenegrina', tabnut: '09218', note: 'Muito doce e suculenta, com sementes.' },
      { ceasa: 'Tangerina Murcott', tabnut: '09218', note: 'Doce e suculenta, casca mais presa.' }
    ]
  },
  {
    id: 'peras',
    label: 'peras',
    products: [
      { ceasa: 'Pera Nacional', tabnut: '09252', note: 'Crocante e suculenta.' },
      { ceasa: 'Pera Willians / Packams', tabnut: '09252', note: 'Macia e perfumada quando madura.' },
      { ceasa: 'Pera Danjou Importada', tabnut: '09252', note: 'Polpa firme; boa para assar.' },
      { ceasa: 'Pera Vermelha', tabnut: '09252', note: 'Doce e macia.' }
    ]
  },
  {
    id: 'mamoes',
    label: 'mamões',
    products: [
      { ceasa: 'Mamão Formosa', tabnut: '09226', note: 'Grande; rende várias porções.' },
      { ceasa: 'Mamão Amazonas (Papaia)', tabnut: '09226', note: 'Pequeno e mais doce; uma porção por metade.' }
    ]
  },
  {
    id: 'mangas',
    label: 'mangas',
    products: [
      { ceasa: 'Manga Tommy Atkins', tabnut: '09176', note: 'Firme e com poucos fiapos.' },
      { ceasa: 'Manga Palmer', tabnut: '09176', note: 'Doce e sem fiapos; ótima para comer e sucos.' },
      { ceasa: 'Manga Espada', tabnut: '09176', note: 'Muito doce, com fiapos; melhor para sucos.' }
    ]
  },
  {
    id: 'melancias',
    label: 'melancias',
    products: [
      { ceasa: 'Melancia', tabnut: '09326', note: 'Grande; rende muito.' },
      { ceasa: 'Melancia Kodama / Baby', tabnut: '09326', note: 'Pequena, cabe na geladeira inteira.' }
    ]
  },
  {
    id: 'uvas',
    label: 'uvas',
    products: [
      { ceasa: 'Uva Comum de Mesa', tabnut: '09131', note: 'Tipo niágara/isabel: casca solta e sabor marcante.' },
      { ceasa: 'Uva Fina Mesa', tabnut: '09132', note: 'Tipo itália: bagas grandes e casca firme.' }
    ]
  }
]

export default SWAP_GROUPS
