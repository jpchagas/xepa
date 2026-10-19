// Xepa's curated recipes.
//
// Each ingredient:
//   name     what the recipe shows ("Cebola")
//   qty      amount for `servings` (omit for "a gosto")
//   unit     g, kg, ml, xícara, colher de sopa, colher de chá, unidade,
//            dente, maço, pé, lata, caixinha, pacote, fatia, pitada, a gosto
//   note     optional ("picada")
//   pantry   true for things people usually have at home; they start
//            unchecked when adding the recipe to a list
//   list     what goes on the shopping list:
//            { ceasa: 'Cebola Nacional', amount: 0.3 }
//                exact CEASA product name (live price); amount in the
//                product's unit: kg, or units for DZ/UND/MOL/BDJ products
//            { name: 'Creme de leite', amount: 1 }
//                product outside CEASA; amount in packages
//            omitted -> { name: <ingredient name>, amount: 1 }
//
// Rough weights used for CEASA amounts: cebola 150 g, tomate 120 g,
// cenoura 150 g, batata 200 g, pimentão 150 g, limão 80 g, alho 50 g
// (one head; also the minimum for a few cloves).
//
// `npm test` checks every `ceasa` name against a real CEASA quote, so
// a typo can't silently create a duplicate product.

export const RECIPE_CATEGORIES = [
  'Pratos principais',
  'Acompanhamentos',
  'Massas',
  'Sopas',
  'Saladas',
  'Lanches',
  'Doces',
  'Bebidas'
]

const recipes = [
  // ── Pratos principais ──────────────────────────────────────────────

  {
    id: 'strogonoff-de-frango',
    name: 'Strogonoff de frango',
    category: 'Pratos principais',
    emoji: '🍛',
    minutes: 35,
    servings: 4,
    ingredients: [
      { name: 'Filé de frango', qty: 600, unit: 'g', note: 'em cubos', list: { ceasa: 'Filé de Frango', amount: 0.6 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', note: 'picada', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alho', qty: 2, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Molho de tomate', qty: 1, unit: 'caixinha' },
      { name: 'Creme de leite', qty: 1, unit: 'caixinha' },
      { name: 'Champignon', qty: 1, unit: 'lata', note: 'opcional' },
      { name: 'Ketchup', qty: 2, unit: 'colher de sopa' },
      { name: 'Mostarda', qty: 1, unit: 'colher de sopa' },
      { name: 'Batata palha', qty: 1, unit: 'pacote', note: 'para servir' },
      { name: 'Óleo', qty: 2, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Tempere o frango com sal. Aqueça o óleo e doure o frango em fogo alto, em partes, para não soltar água.',
      'Junte a cebola e o alho e refogue até a cebola ficar transparente.',
      'Adicione o molho de tomate, o ketchup, a mostarda e o champignon. Cozinhe por 10 minutos em fogo baixo.',
      'Desligue o fogo, misture o creme de leite e acerte o sal.',
      'Sirva com arroz branco e batata palha.'
    ]
  },

  {
    id: 'strogonoff-de-carne',
    name: 'Strogonoff de carne',
    category: 'Pratos principais',
    emoji: '🥘',
    minutes: 40,
    servings: 4,
    ingredients: [
      { name: 'Alcatra', qty: 600, unit: 'g', note: 'em tiras', list: { ceasa: 'Alcatra', amount: 0.6 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', note: 'picada', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alho', qty: 2, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Molho de tomate', qty: 1, unit: 'caixinha' },
      { name: 'Creme de leite', qty: 1, unit: 'caixinha' },
      { name: 'Champignon', qty: 1, unit: 'lata' },
      { name: 'Mostarda', qty: 1, unit: 'colher de sopa' },
      { name: 'Batata palha', qty: 1, unit: 'pacote', note: 'para servir' },
      { name: 'Manteiga', qty: 1, unit: 'colher de sopa' },
      { name: 'Sal', unit: 'a gosto', pantry: true },
      { name: 'Pimenta-do-reino', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Tempere a carne com sal e pimenta. Doure na manteiga em fogo bem alto, em pequenas porções, e reserve.',
      'Na mesma panela, refogue a cebola e o alho.',
      'Volte a carne, junte o molho de tomate, a mostarda e o champignon e cozinhe por 5 minutos.',
      'Desligue o fogo e misture o creme de leite. Sirva com arroz e batata palha.'
    ]
  },

  {
    id: 'feijoada',
    name: 'Feijoada',
    category: 'Pratos principais',
    emoji: '🫘',
    minutes: 180,
    servings: 8,
    ingredients: [
      { name: 'Feijão preto', qty: 1, unit: 'kg', list: { ceasa: 'Feijão', amount: 1 } },
      { name: 'Costela suína', qty: 500, unit: 'g', list: { ceasa: 'Costela Suína', amount: 0.5 } },
      { name: 'Paleta suína', qty: 500, unit: 'g', note: 'em cubos', list: { ceasa: 'Paleta Suína', amount: 0.5 } },
      { name: 'Linguiça toscana', qty: 400, unit: 'g', list: { ceasa: 'Linguiça Toscana', amount: 0.4 } },
      { name: 'Carne seca', qty: 500, unit: 'g', note: 'dessalgada' },
      { name: 'Bacon', qty: 200, unit: 'g' },
      { name: 'Cebola', qty: 2, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.3 } },
      { name: 'Alho', qty: 1, unit: 'unidade', note: 'cabeça', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Louro', qty: 1, unit: 'maço', list: { ceasa: 'Louro', amount: 1 } },
      { name: 'Couve', qty: 1, unit: 'maço', note: 'para servir', list: { ceasa: 'Couve Manteiga', amount: 1 } },
      { name: 'Laranja', qty: 4, unit: 'unidade', note: 'para servir', list: { ceasa: 'Laranja Suco', amount: 0.8 } },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Deixe a carne seca de molho na véspera, trocando a água algumas vezes. Deixe o feijão de molho por 8 horas.',
      'Cozinhe o feijão com as folhas de louro e a carne seca na pressão por 30 minutos.',
      'Em outra panela, frite o bacon, doure a costela, a paleta e a linguiça em rodelas. Junte a cebola e o alho.',
      'Transfira as carnes para o feijão e cozinhe em fogo baixo por mais 1 hora, até o caldo engrossar. Acerte o sal.',
      'Sirva com arroz, couve refogada e laranja em gomos.'
    ]
  },

  {
    id: 'frango-assado-com-batatas',
    name: 'Frango assado com batatas',
    category: 'Pratos principais',
    emoji: '🍗',
    minutes: 75,
    servings: 4,
    ingredients: [
      { name: 'Coxa e sobrecoxa de frango', qty: 1.2, unit: 'kg', list: { ceasa: 'Coxa e Sobrecoxa de Frango', amount: 1.2 } },
      { name: 'Batata', qty: 4, unit: 'unidade', note: 'em gomos', list: { ceasa: 'Batata Branca', amount: 0.8 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alho', qty: 4, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Limão', qty: 1, unit: 'unidade', list: { ceasa: 'Limão Taiti', amount: 0.1 } },
      { name: 'Alecrim', qty: 1, unit: 'maço', list: { ceasa: 'Alecrim', amount: 1 } },
      { name: 'Azeite', qty: 3, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Tempere o frango com alho amassado, suco de limão, sal e alecrim. Deixe pegar gosto por 30 minutos.',
      'Distribua o frango e as batatas numa assadeira com a cebola em pétalas. Regue com azeite.',
      'Cubra com papel-alumínio e asse a 200 °C por 30 minutos.',
      'Retire o papel e asse por mais 25 minutos, até dourar.'
    ]
  },

  {
    id: 'bife-acebolado',
    name: 'Bife acebolado',
    category: 'Pratos principais',
    emoji: '🥩',
    minutes: 20,
    servings: 4,
    ingredients: [
      { name: 'Bife de alcatra', qty: 600, unit: 'g', list: { ceasa: 'Alcatra', amount: 0.6 } },
      { name: 'Cebola', qty: 2, unit: 'unidade', note: 'em rodelas', list: { ceasa: 'Cebola Nacional', amount: 0.3 } },
      { name: 'Alho', qty: 2, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Óleo', qty: 2, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true },
      { name: 'Pimenta-do-reino', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Tempere os bifes com alho, sal e pimenta.',
      'Aqueça bem a frigideira com óleo e frite os bifes 2 minutos de cada lado. Reserve.',
      'Na mesma frigideira, doure a cebola, raspando o fundo. Se grudar, pingue um pouco de água.',
      'Volte os bifes por 1 minuto e sirva com a cebola por cima.'
    ]
  },

  {
    id: 'carne-de-panela',
    name: 'Carne de panela com legumes',
    category: 'Pratos principais',
    emoji: '🍲',
    minutes: 90,
    servings: 6,
    ingredients: [
      { name: 'Acém', qty: 1, unit: 'kg', note: 'em cubos grandes', list: { ceasa: 'Acém', amount: 1 } },
      { name: 'Batata', qty: 3, unit: 'unidade', list: { ceasa: 'Batata Branca', amount: 0.6 } },
      { name: 'Cenoura', qty: 2, unit: 'unidade', list: { ceasa: 'Cenoura', amount: 0.3 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Tomate', qty: 2, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.24 } },
      { name: 'Alho', qty: 3, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Louro', qty: 2, unit: 'unidade', note: 'folhas', list: { ceasa: 'Louro', amount: 1 } },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Óleo', qty: 2, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Doure a carne em óleo bem quente na panela de pressão, em partes.',
      'Junte a cebola, o alho e o tomate e refogue até desmanchar.',
      'Cubra com água quente, adicione o louro e o sal e cozinhe na pressão por 35 minutos.',
      'Tire a pressão, junte batata e cenoura em pedaços e cozinhe sem pressão até ficarem macias.',
      'Finalize com cheiro-verde picado.'
    ]
  },

  {
    id: 'escondidinho-de-carne',
    name: 'Escondidinho de carne moída',
    category: 'Pratos principais',
    emoji: '🥧',
    minutes: 60,
    servings: 6,
    ingredients: [
      { name: 'Mandioca', qty: 1, unit: 'kg', list: { ceasa: 'Mandioca', amount: 1 } },
      { name: 'Carne moída (patinho)', qty: 500, unit: 'g', list: { ceasa: 'Patinho', amount: 0.5 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Tomate', qty: 2, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.24 } },
      { name: 'Alho', qty: 2, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Leite', qty: 1, unit: 'xícara' },
      { name: 'Manteiga', qty: 2, unit: 'colher de sopa' },
      { name: 'Queijo muçarela', qty: 200, unit: 'g', note: 'ralado' },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Cozinhe a mandioca em água com sal até ficar bem macia. Retire os fios e amasse com a manteiga e o leite até virar um purê.',
      'Refogue a cebola e o alho, junte a carne e cozinhe até secar. Acrescente o tomate e o cheiro-verde.',
      'Numa travessa, faça uma camada de carne e cubra com o purê de mandioca.',
      'Espalhe o queijo e leve ao forno a 200 °C por 20 minutos, até gratinar.'
    ]
  },

  {
    id: 'moqueca-de-peixe',
    name: 'Moqueca de peixe',
    category: 'Pratos principais',
    emoji: '🐟',
    minutes: 45,
    servings: 4,
    ingredients: [
      { name: 'Filé de cação', qty: 800, unit: 'g', note: 'em postas', list: { ceasa: 'Filé de Cação', amount: 0.8 } },
      { name: 'Tomate', qty: 3, unit: 'unidade', note: 'em rodelas', list: { ceasa: 'Tomate Longa Vida', amount: 0.36 } },
      { name: 'Cebola', qty: 2, unit: 'unidade', note: 'em rodelas', list: { ceasa: 'Cebola Nacional', amount: 0.3 } },
      { name: 'Pimentão vermelho', qty: 1, unit: 'unidade', list: { ceasa: 'Pimentão Vermelho', amount: 0.15 } },
      { name: 'Pimentão amarelo', qty: 1, unit: 'unidade', list: { ceasa: 'Pimentão Amarelo', amount: 0.15 } },
      { name: 'Limão', qty: 1, unit: 'unidade', list: { ceasa: 'Limão Taiti', amount: 0.1 } },
      { name: 'Alho', qty: 3, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Leite de coco', qty: 200, unit: 'ml' },
      { name: 'Azeite de dendê', qty: 2, unit: 'colher de sopa' },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Tempere o peixe com limão, alho e sal por 20 minutos.',
      'Numa panela larga, faça camadas de cebola, tomate e pimentões, intercalando com o peixe.',
      'Regue com o leite de coco e o dendê. Tampe e cozinhe em fogo médio por 20 minutos, sem mexer.',
      'Finalize com cheiro-verde. Sirva com arroz branco e pirão.'
    ]
  },

  {
    id: 'tilapia-com-legumes',
    name: 'Tilápia grelhada com legumes',
    category: 'Pratos principais',
    emoji: '🐠',
    minutes: 30,
    servings: 4,
    ingredients: [
      { name: 'Filé de tilápia', qty: 600, unit: 'g', list: { ceasa: 'Filé de Tilápia', amount: 0.6 } },
      { name: 'Abobrinha', qty: 1, unit: 'unidade', list: { ceasa: 'Abobrinha Italiana', amount: 0.25 } },
      { name: 'Cenoura', qty: 1, unit: 'unidade', list: { ceasa: 'Cenoura', amount: 0.15 } },
      { name: 'Brócolis', qty: 1, unit: 'maço', list: { ceasa: 'Brocolis', amount: 1 } },
      { name: 'Limão', qty: 1, unit: 'unidade', list: { ceasa: 'Limão Taiti', amount: 0.1 } },
      { name: 'Alho', qty: 2, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Azeite', qty: 3, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Tempere a tilápia com limão, alho e sal.',
      'Cozinhe o brócolis e a cenoura no vapor por 5 minutos, até ficarem al dente.',
      'Grelhe a abobrinha em fatias com um fio de azeite e reserve.',
      'Grelhe os filés em frigideira untada, 3 minutos de cada lado. Sirva com os legumes e azeite.'
    ]
  },

  {
    id: 'bacalhoada',
    name: 'Bacalhoada',
    category: 'Pratos principais',
    emoji: '🫒',
    minutes: 60,
    servings: 6,
    ingredients: [
      { name: 'Lombo de bacalhau dessalgado', qty: 800, unit: 'g', list: { ceasa: 'Lombo de Bacalhau Dessalgado', amount: 0.8 } },
      { name: 'Batata', qty: 4, unit: 'unidade', list: { ceasa: 'Batata Branca', amount: 0.8 } },
      { name: 'Cebola', qty: 2, unit: 'unidade', note: 'em rodelas', list: { ceasa: 'Cebola Nacional', amount: 0.3 } },
      { name: 'Pimentão vermelho', qty: 1, unit: 'unidade', list: { ceasa: 'Pimentão Vermelho', amount: 0.15 } },
      { name: 'Pimentão verde', qty: 1, unit: 'unidade', list: { ceasa: 'Pimentão Verde', amount: 0.15 } },
      { name: 'Tomate', qty: 2, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.24 } },
      { name: 'Alho', qty: 4, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Ovos', qty: 3, unit: 'unidade', note: 'cozidos' },
      { name: 'Azeitonas pretas', qty: 100, unit: 'g' },
      { name: 'Azeite', qty: 1, unit: 'xícara' }
    ],
    steps: [
      'Cozinhe as batatas em rodelas grossas até ficarem quase macias.',
      'Aqueça o bacalhau em água quente por 5 minutos e separe em lascas grandes.',
      'Numa travessa, faça camadas de batata, bacalhau, cebola, pimentões, tomate e alho.',
      'Regue generosamente com azeite e asse a 200 °C por 25 minutos.',
      'Finalize com os ovos cozidos e as azeitonas.'
    ]
  },

  {
    id: 'bobo-de-camarao',
    name: 'Bobó de camarão',
    category: 'Pratos principais',
    emoji: '🦐',
    minutes: 50,
    servings: 4,
    ingredients: [
      { name: 'Camarão sem cabeça', qty: 500, unit: 'g', list: { ceasa: 'Camarão Cinza (Vannamei) Sem Cabeça', amount: 0.5 } },
      { name: 'Mandioca', qty: 500, unit: 'g', list: { ceasa: 'Mandioca', amount: 0.5 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Tomate', qty: 2, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.24 } },
      { name: 'Pimentão vermelho', qty: 1, unit: 'unidade', list: { ceasa: 'Pimentão Vermelho', amount: 0.15 } },
      { name: 'Alho', qty: 3, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Leite de coco', qty: 200, unit: 'ml' },
      { name: 'Azeite de dendê', qty: 2, unit: 'colher de sopa' },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Cozinhe a mandioca até desmanchar e bata no liquidificador com o leite de coco e um pouco da água do cozimento.',
      'Refogue a cebola, o alho, o tomate e o pimentão no dendê.',
      'Junte o camarão e cozinhe por 3 minutos, só até ficar rosado.',
      'Misture o creme de mandioca, acerte o sal e finalize com cheiro-verde.'
    ]
  },

  {
    id: 'galinhada',
    name: 'Galinhada',
    category: 'Pratos principais',
    emoji: '🍚',
    minutes: 60,
    servings: 6,
    ingredients: [
      { name: 'Coxa e sobrecoxa de frango', qty: 1, unit: 'kg', list: { ceasa: 'Coxa e Sobrecoxa de Frango', amount: 1 } },
      { name: 'Arroz', qty: 2, unit: 'xícara' },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Tomate', qty: 2, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.24 } },
      { name: 'Pimentão verde', qty: 1, unit: 'unidade', list: { ceasa: 'Pimentão Verde', amount: 0.15 } },
      { name: 'Milho verde', qty: 2, unit: 'espiga', list: { ceasa: 'Milho Verde(3UN)', amount: 1 } },
      { name: 'Alho', qty: 3, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Cúrcuma (açafrão)', qty: 1, unit: 'colher de chá' },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Óleo', qty: 2, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Tempere o frango com alho e sal e doure bem no óleo.',
      'Junte a cebola, o pimentão e o tomate e refogue.',
      'Acrescente o arroz, a cúrcuma e os grãos de milho e misture.',
      'Cubra com 4 xícaras de água quente e cozinhe tampado em fogo baixo por 25 minutos.',
      'Finalize com cheiro-verde.'
    ]
  },

  {
    id: 'arroz-carreteiro',
    name: 'Arroz carreteiro',
    category: 'Pratos principais',
    emoji: '🤠',
    minutes: 50,
    servings: 6,
    ingredients: [
      { name: 'Charque', qty: 500, unit: 'g', note: 'dessalgado' },
      { name: 'Arroz', qty: 2, unit: 'xícara' },
      { name: 'Cebola', qty: 2, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.3 } },
      { name: 'Tomate', qty: 2, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.24 } },
      { name: 'Alho', qty: 3, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Óleo', qty: 2, unit: 'colher de sopa', pantry: true }
    ],
    steps: [
      'Deixe o charque de molho na véspera, trocando a água. Cozinhe por 15 minutos e corte em cubos pequenos.',
      'Frite o charque no óleo até dourar. Junte a cebola e o alho.',
      'Acrescente o tomate e o arroz e refogue por 2 minutos.',
      'Cubra com 4 xícaras de água quente e cozinhe em fogo baixo até secar. Finalize com cheiro-verde.'
    ]
  },

  {
    id: 'costela-assada',
    name: 'Costela bovina no forno',
    category: 'Pratos principais',
    emoji: '🍖',
    minutes: 240,
    servings: 6,
    ingredients: [
      { name: 'Costela bovina', qty: 2, unit: 'kg', list: { ceasa: 'Costela Bovina', amount: 2 } },
      { name: 'Cebola', qty: 2, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.3 } },
      { name: 'Alho', qty: 1, unit: 'unidade', note: 'cabeça', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Sal grosso', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Esfregue a costela com sal grosso e alho amassado.',
      'Coloque numa assadeira sobre a cebola em rodelas, com a parte do osso para baixo.',
      'Cubra com papel-alumínio e asse a 180 °C por 3 horas.',
      'Retire o papel e asse a 220 °C por mais 40 minutos, até dourar.'
    ]
  },

  // ── Acompanhamentos ───────────────────────────────────────────────

  {
    id: 'arroz-branco',
    name: 'Arroz branco soltinho',
    category: 'Acompanhamentos',
    emoji: '🍚',
    minutes: 25,
    servings: 4,
    ingredients: [
      { name: 'Arroz', qty: 2, unit: 'xícara' },
      { name: 'Cebola', qty: 0.5, unit: 'unidade', note: 'picada', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alho', qty: 2, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Óleo', qty: 2, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', qty: 1, unit: 'colher de chá', pantry: true }
    ],
    steps: [
      'Refogue a cebola e o alho no óleo sem deixar dourar.',
      'Junte o arroz e o sal e refogue por 1 minuto.',
      'Adicione 4 xícaras de água fervente e cozinhe tampado em fogo baixo por 15 minutos, até secar.',
      'Desligue e deixe descansar tampado por 5 minutos antes de soltar com o garfo.'
    ]
  },

  {
    id: 'feijao-caseiro',
    name: 'Feijão caseiro',
    category: 'Acompanhamentos',
    emoji: '🫘',
    minutes: 60,
    servings: 6,
    ingredients: [
      { name: 'Feijão', qty: 500, unit: 'g', list: { ceasa: 'Feijão', amount: 0.5 } },
      { name: 'Bacon', qty: 100, unit: 'g', note: 'opcional' },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alho', qty: 4, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Louro', qty: 2, unit: 'unidade', note: 'folhas', list: { ceasa: 'Louro', amount: 1 } },
      { name: 'Óleo', qty: 2, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Deixe o feijão de molho por pelo menos 6 horas e descarte a água.',
      'Cozinhe na pressão com água nova e o louro por 25 minutos.',
      'Frite o bacon, junte a cebola e o alho e doure.',
      'Adicione uma concha do feijão ao refogado, amasse e volte tudo para a panela. Cozinhe por 10 minutos e acerte o sal.'
    ]
  },

  {
    id: 'pure-de-batata',
    name: 'Purê de batata',
    category: 'Acompanhamentos',
    emoji: '🥔',
    minutes: 30,
    servings: 4,
    ingredients: [
      { name: 'Batata', qty: 1, unit: 'kg', list: { ceasa: 'Batata Branca', amount: 1 } },
      { name: 'Leite', qty: 1, unit: 'xícara' },
      { name: 'Manteiga', qty: 2, unit: 'colher de sopa' },
      { name: 'Noz-moscada', qty: 1, unit: 'pitada', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Cozinhe as batatas descascadas em água com sal até ficarem bem macias.',
      'Escorra e amasse ainda quentes.',
      'Leve ao fogo baixo com a manteiga e o leite quente, mexendo até ficar cremoso.',
      'Tempere com noz-moscada e sal.'
    ]
  },

  {
    id: 'farofa',
    name: 'Farofa de cebola e bacon',
    category: 'Acompanhamentos',
    emoji: '🥓',
    minutes: 15,
    servings: 6,
    ingredients: [
      { name: 'Farinha de mandioca', qty: 2, unit: 'xícara' },
      { name: 'Bacon', qty: 150, unit: 'g' },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Manteiga', qty: 2, unit: 'colher de sopa' },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Frite o bacon em cubos até ficar crocante.',
      'Junte a manteiga e a cebola e doure.',
      'Acrescente a farinha aos poucos, mexendo sem parar até ficar sequinha e dourada.',
      'Tempere com sal e misture o cheiro-verde.'
    ]
  },

  {
    id: 'maionese-de-batata',
    name: 'Maionese de batata',
    category: 'Acompanhamentos',
    emoji: '🥗',
    minutes: 40,
    servings: 8,
    ingredients: [
      { name: 'Batata', qty: 1, unit: 'kg', list: { ceasa: 'Batata Branca', amount: 1 } },
      { name: 'Cenoura', qty: 2, unit: 'unidade', list: { ceasa: 'Cenoura', amount: 0.3 } },
      { name: 'Ovos', qty: 4, unit: 'unidade', note: 'cozidos' },
      { name: 'Ervilha em lata', qty: 1, unit: 'lata' },
      { name: 'Maionese', qty: 1, unit: 'pacote' },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Cozinhe a batata e a cenoura em cubos em água com sal, até ficarem macias mas firmes. Escorra e deixe esfriar.',
      'Pique os ovos cozidos.',
      'Misture tudo com a ervilha, a maionese e o cheiro-verde. Acerte o sal.',
      'Leve à geladeira por 1 hora antes de servir.'
    ]
  },

  // ── Massas ────────────────────────────────────────────────────────

  {
    id: 'macarrao-bolonhesa',
    name: 'Macarrão à bolonhesa',
    category: 'Massas',
    emoji: '🍝',
    minutes: 40,
    servings: 4,
    ingredients: [
      { name: 'Macarrão', qty: 500, unit: 'g' },
      { name: 'Carne moída (patinho)', qty: 500, unit: 'g', list: { ceasa: 'Patinho', amount: 0.5 } },
      { name: 'Tomate italiano', qty: 6, unit: 'unidade', list: { ceasa: 'Tomate Italiano', amount: 0.7 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Cenoura', qty: 1, unit: 'unidade', note: 'ralada', list: { ceasa: 'Cenoura', amount: 0.15 } },
      { name: 'Alho', qty: 3, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Manjericão', qty: 1, unit: 'maço', list: { ceasa: 'Manjericão', amount: 1 } },
      { name: 'Queijo parmesão', qty: 100, unit: 'g', note: 'ralado' },
      { name: 'Azeite', qty: 2, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Bata os tomates no liquidificador e reserve.',
      'Refogue a cebola, o alho e a cenoura no azeite. Junte a carne e cozinhe até perder o tom rosado.',
      'Acrescente os tomates batidos e cozinhe em fogo baixo por 20 minutos. Acerte o sal e junte o manjericão.',
      'Cozinhe o macarrão em bastante água com sal, escorra e misture ao molho. Sirva com parmesão.'
    ]
  },

  {
    id: 'nhoque-ao-sugo',
    name: 'Nhoque de batata ao sugo',
    category: 'Massas',
    emoji: '🥟',
    minutes: 60,
    servings: 4,
    ingredients: [
      { name: 'Batata', qty: 1, unit: 'kg', list: { ceasa: 'Batata Branca', amount: 1 } },
      { name: 'Farinha de trigo', qty: 1.5, unit: 'xícara' },
      { name: 'Ovos', qty: 1, unit: 'unidade' },
      { name: 'Tomate italiano', qty: 8, unit: 'unidade', list: { ceasa: 'Tomate Italiano', amount: 0.9 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alho', qty: 3, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Manjericão', qty: 1, unit: 'maço', list: { ceasa: 'Manjericão', amount: 1 } },
      { name: 'Queijo parmesão', qty: 50, unit: 'g', note: 'ralado' },
      { name: 'Azeite', qty: 3, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Cozinhe as batatas com casca, descasque e passe no espremedor ainda quentes.',
      'Junte o ovo, o sal e a farinha aos poucos, até a massa desgrudar das mãos.',
      'Faça rolinhos, corte em pedaços de 2 cm e cozinhe em água fervente até subirem.',
      'Para o molho, refogue cebola e alho no azeite, junte os tomates picados e cozinhe por 20 minutos. Finalize com manjericão e parmesão.'
    ]
  },

  {
    id: 'macarrao-alho-oleo-brocolis',
    name: 'Macarrão alho e óleo com brócolis',
    category: 'Massas',
    emoji: '🥦',
    minutes: 20,
    servings: 4,
    ingredients: [
      { name: 'Macarrão', qty: 500, unit: 'g' },
      { name: 'Brócolis', qty: 1, unit: 'maço', list: { ceasa: 'Brocolis', amount: 1 } },
      { name: 'Alho', qty: 6, unit: 'dente', note: 'em lâminas', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Queijo parmesão', qty: 50, unit: 'g', note: 'ralado' },
      { name: 'Azeite', qty: 0.5, unit: 'xícara', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Cozinhe o macarrão em água com sal. Nos últimos 3 minutos, junte o brócolis em floretes.',
      'Enquanto isso, doure o alho no azeite em fogo baixo, sem queimar.',
      'Escorra a massa e o brócolis, misture ao azeite com alho e finalize com parmesão.'
    ]
  },

  // ── Sopas ─────────────────────────────────────────────────────────

  {
    id: 'sopa-de-legumes',
    name: 'Sopa de legumes',
    category: 'Sopas',
    emoji: '🥣',
    minutes: 40,
    servings: 6,
    ingredients: [
      { name: 'Batata', qty: 2, unit: 'unidade', list: { ceasa: 'Batata Branca', amount: 0.4 } },
      { name: 'Cenoura', qty: 2, unit: 'unidade', list: { ceasa: 'Cenoura', amount: 0.3 } },
      { name: 'Abobrinha', qty: 1, unit: 'unidade', list: { ceasa: 'Abobrinha Italiana', amount: 0.25 } },
      { name: 'Chuchu', qty: 1, unit: 'unidade', list: { ceasa: 'Chuchu', amount: 0.3 } },
      { name: 'Mandioquinha', qty: 2, unit: 'unidade', list: { ceasa: 'Mandioquinha', amount: 0.2 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Tomate', qty: 1, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.12 } },
      { name: 'Alho', qty: 2, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Macarrão de letrinhas', qty: 0.5, unit: 'xícara', note: 'opcional' },
      { name: 'Azeite', qty: 2, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Refogue a cebola, o alho e o tomate no azeite.',
      'Junte os legumes em cubos e 2 litros de água quente.',
      'Cozinhe por 20 minutos, até os legumes ficarem macios. Se quiser, adicione o macarrão nos últimos 8 minutos.',
      'Acerte o sal e finalize com cheiro-verde.'
    ]
  },

  {
    id: 'caldo-verde',
    name: 'Caldo verde',
    category: 'Sopas',
    emoji: '🥬',
    minutes: 40,
    servings: 6,
    ingredients: [
      { name: 'Batata', qty: 1, unit: 'kg', list: { ceasa: 'Batata Branca', amount: 1 } },
      { name: 'Couve', qty: 1, unit: 'maço', note: 'em tiras finas', list: { ceasa: 'Couve Manteiga', amount: 1 } },
      { name: 'Linguiça calabresa', qty: 300, unit: 'g' },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alho', qty: 3, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Azeite', qty: 3, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Cozinhe as batatas com a cebola e o alho em 2 litros de água até desmancharem. Bata no liquidificador.',
      'Doure a calabresa em rodelas no azeite.',
      'Volte o creme de batata ao fogo, junte a calabresa e a couve e cozinhe por 3 minutos.',
      'Acerte o sal e sirva com um fio de azeite.'
    ]
  },

  {
    id: 'canja',
    name: 'Canja de galinha',
    category: 'Sopas',
    emoji: '🐔',
    minutes: 45,
    servings: 6,
    ingredients: [
      { name: 'Filé de frango', qty: 500, unit: 'g', list: { ceasa: 'Filé de Frango', amount: 0.5 } },
      { name: 'Arroz', qty: 0.5, unit: 'xícara' },
      { name: 'Cenoura', qty: 2, unit: 'unidade', list: { ceasa: 'Cenoura', amount: 0.3 } },
      { name: 'Batata', qty: 1, unit: 'unidade', list: { ceasa: 'Batata Branca', amount: 0.2 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alho', qty: 2, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Óleo', qty: 1, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Cozinhe o frango em 2 litros de água com sal por 20 minutos. Retire e desfie, guardando o caldo.',
      'Refogue a cebola e o alho no óleo, junte o caldo, o arroz, a cenoura e a batata em cubos.',
      'Cozinhe por 15 minutos, até o arroz ficar macio.',
      'Volte o frango desfiado e finalize com cheiro-verde.'
    ]
  },

  {
    id: 'sopa-de-abobora',
    name: 'Creme de abóbora com gengibre',
    category: 'Sopas',
    emoji: '🎃',
    minutes: 35,
    servings: 4,
    ingredients: [
      { name: 'Abóbora cabotiá', qty: 1, unit: 'kg', list: { ceasa: 'Moranga Cabotiá', amount: 1 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alho', qty: 2, unit: 'dente', list: { ceasa: 'Alho Nacional', amount: 0.05 } },
      { name: 'Gengibre', qty: 1, unit: 'colher de sopa', note: 'ralado', list: { ceasa: 'Gengibre', amount: 0.05 } },
      { name: 'Creme de leite', qty: 0.5, unit: 'caixinha', note: 'opcional' },
      { name: 'Azeite', qty: 2, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Refogue a cebola, o alho e o gengibre no azeite.',
      'Junte a abóbora descascada em cubos e cubra com água quente. Cozinhe por 20 minutos.',
      'Bata no liquidificador até ficar liso e volte à panela.',
      'Acerte o sal e, se quiser, finalize com creme de leite.'
    ]
  },

  // ── Saladas ───────────────────────────────────────────────────────

  {
    id: 'salada-verde',
    name: 'Salada verde com tomate e pepino',
    category: 'Saladas',
    emoji: '🥗',
    minutes: 10,
    servings: 4,
    ingredients: [
      { name: 'Alface crespa', qty: 1, unit: 'pé', list: { ceasa: 'Alface Crespa', amount: 1 } },
      { name: 'Tomate', qty: 2, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.24 } },
      { name: 'Pepino', qty: 1, unit: 'unidade', list: { ceasa: 'Pepino Salada', amount: 0.2 } },
      { name: 'Cebola roxa', qty: 0.5, unit: 'unidade', list: { ceasa: 'Cebola Roxa', amount: 0.1 } },
      { name: 'Limão', qty: 1, unit: 'unidade', list: { ceasa: 'Limão Taiti', amount: 0.1 } },
      { name: 'Azeite', qty: 3, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Lave e seque bem as folhas e rasgue com as mãos.',
      'Corte o tomate e o pepino em rodelas e a cebola roxa em fatias finas.',
      'Monte a salada e tempere na hora de servir com limão, azeite e sal.'
    ]
  },

  {
    id: 'vinagrete',
    name: 'Vinagrete',
    category: 'Saladas',
    emoji: '🍅',
    minutes: 15,
    servings: 6,
    ingredients: [
      { name: 'Tomate', qty: 3, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.36 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Pimentão verde', qty: 1, unit: 'unidade', list: { ceasa: 'Pimentão Verde', amount: 0.15 } },
      { name: 'Cheiro-verde', qty: 1, unit: 'maço', list: { ceasa: 'Tempero Verde', amount: 1 } },
      { name: 'Vinagre', qty: 3, unit: 'colher de sopa', pantry: true },
      { name: 'Azeite', qty: 3, unit: 'colher de sopa', pantry: true },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ],
    steps: [
      'Pique o tomate (sem sementes), a cebola e o pimentão em cubinhos.',
      'Misture com o cheiro-verde picado.',
      'Tempere com vinagre, azeite e sal. Deixe descansar 10 minutos antes de servir.'
    ]
  },

  // ── Lanches ───────────────────────────────────────────────────────

  {
    id: 'torta-de-frango',
    name: 'Torta de liquidificador de frango',
    category: 'Lanches',
    emoji: '🥧',
    minutes: 60,
    servings: 8,
    ingredients: [
      { name: 'Filé de frango', qty: 400, unit: 'g', note: 'cozido e desfiado', list: { ceasa: 'Filé de Frango', amount: 0.4 } },
      { name: 'Tomate', qty: 1, unit: 'unidade', list: { ceasa: 'Tomate Longa Vida', amount: 0.12 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Milho verde', qty: 1, unit: 'espiga', list: { ceasa: 'Milho Verde(3UN)', amount: 1 } },
      { name: 'Ervilha em lata', qty: 1, unit: 'lata' },
      { name: 'Ovos', qty: 3, unit: 'unidade' },
      { name: 'Leite', qty: 2, unit: 'xícara' },
      { name: 'Farinha de trigo', qty: 2, unit: 'xícara' },
      { name: 'Queijo parmesão', qty: 50, unit: 'g', note: 'ralado' },
      { name: 'Fermento em pó', qty: 1, unit: 'colher de sopa' },
      { name: 'Óleo', qty: 0.5, unit: 'xícara', pantry: true },
      { name: 'Sal', qty: 1, unit: 'colher de chá', pantry: true }
    ],
    steps: [
      'Refogue o frango com a cebola e o tomate. Junte os grãos de milho e a ervilha e deixe esfriar.',
      'Bata no liquidificador os ovos, o leite, o óleo, a farinha, o parmesão e o sal. Misture o fermento.',
      'Numa forma untada, despeje metade da massa, espalhe o recheio e cubra com o restante.',
      'Asse a 180 °C por 40 minutos, até dourar.'
    ]
  },

  {
    id: 'pao-de-queijo',
    name: 'Pão de queijo',
    category: 'Lanches',
    emoji: '🧀',
    minutes: 45,
    servings: 6,
    ingredients: [
      { name: 'Polvilho azedo', qty: 500, unit: 'g' },
      { name: 'Queijo meia cura', qty: 250, unit: 'g', note: 'ralado' },
      { name: 'Ovos', qty: 3, unit: 'unidade' },
      { name: 'Leite', qty: 1, unit: 'xícara' },
      { name: 'Óleo', qty: 0.5, unit: 'xícara', pantry: true },
      { name: 'Sal', qty: 1, unit: 'colher de chá', pantry: true }
    ],
    steps: [
      'Ferva o leite com o óleo e o sal e despeje sobre o polvilho, misturando até esfriar.',
      'Junte os ovos um a um e depois o queijo, sovando até a massa ficar lisa.',
      'Com as mãos untadas, faça bolinhas e coloque numa assadeira, afastadas.',
      'Asse a 200 °C por 25 minutos, até dourar.'
    ]
  },

  // ── Doces ─────────────────────────────────────────────────────────

  {
    id: 'bolo-de-cenoura',
    name: 'Bolo de cenoura com chocolate',
    category: 'Doces',
    emoji: '🥕',
    minutes: 60,
    servings: 12,
    ingredients: [
      { name: 'Cenoura', qty: 3, unit: 'unidade', list: { ceasa: 'Cenoura', amount: 0.45 } },
      { name: 'Ovos', qty: 4, unit: 'unidade' },
      { name: 'Açúcar', qty: 2, unit: 'xícara' },
      { name: 'Farinha de trigo', qty: 2, unit: 'xícara' },
      { name: 'Fermento em pó', qty: 1, unit: 'colher de sopa' },
      { name: 'Chocolate em pó', qty: 4, unit: 'colher de sopa', note: 'cobertura' },
      { name: 'Manteiga', qty: 1, unit: 'colher de sopa', note: 'cobertura' },
      { name: 'Leite', qty: 0.5, unit: 'xícara', note: 'cobertura' },
      { name: 'Óleo', qty: 1, unit: 'xícara', pantry: true }
    ],
    steps: [
      'Bata no liquidificador a cenoura em pedaços, os ovos e o óleo.',
      'Numa tigela, misture o creme com 1½ xícara de açúcar e a farinha. Junte o fermento por último.',
      'Asse em forma untada a 180 °C por 40 minutos.',
      'Para a cobertura, ferva o chocolate, o restante do açúcar, a manteiga e o leite até engrossar. Espalhe sobre o bolo ainda quente.'
    ]
  },

  {
    id: 'bolo-de-banana',
    name: 'Bolo de banana com canela',
    category: 'Doces',
    emoji: '🍌',
    minutes: 55,
    servings: 10,
    ingredients: [
      { name: 'Banana nanica', qty: 5, unit: 'unidade', note: 'bem maduras', list: { ceasa: 'Banana Caturra / Nanica', amount: 0.7 } },
      { name: 'Ovos', qty: 3, unit: 'unidade' },
      { name: 'Açúcar', qty: 1, unit: 'xícara' },
      { name: 'Farinha de trigo', qty: 1.5, unit: 'xícara' },
      { name: 'Fermento em pó', qty: 1, unit: 'colher de sopa' },
      { name: 'Canela em pó', qty: 1, unit: 'colher de chá' },
      { name: 'Óleo', qty: 0.5, unit: 'xícara', pantry: true }
    ],
    steps: [
      'Bata no liquidificador 3 bananas, os ovos, o açúcar e o óleo.',
      'Misture a farinha e a canela e, por último, o fermento.',
      'Forre o fundo da forma com as bananas restantes em rodelas, polvilhe açúcar e canela e despeje a massa.',
      'Asse a 180 °C por 40 minutos.'
    ]
  },

  {
    id: 'mousse-de-maracuja',
    name: 'Mousse de maracujá',
    category: 'Doces',
    emoji: '💛',
    minutes: 15,
    servings: 6,
    ingredients: [
      { name: 'Maracujá', qty: 3, unit: 'unidade', list: { ceasa: 'Maracujá Azedo', amount: 0.6 } },
      { name: 'Leite condensado', qty: 1, unit: 'lata' },
      { name: 'Creme de leite', qty: 1, unit: 'caixinha' }
    ],
    steps: [
      'Bata a polpa de 2 maracujás no liquidificador (sem triturar as sementes) e coe.',
      'Bata o suco com o leite condensado e o creme de leite por 3 minutos.',
      'Distribua em taças, cubra com a polpa do último maracujá e leve à geladeira por 3 horas.'
    ]
  },

  {
    id: 'salada-de-frutas',
    name: 'Salada de frutas',
    category: 'Doces',
    emoji: '🍓',
    minutes: 20,
    servings: 6,
    ingredients: [
      { name: 'Banana prata', qty: 2, unit: 'unidade', list: { ceasa: 'Banana Prata / Branca', amount: 0.25 } },
      { name: 'Maçã', qty: 2, unit: 'unidade', list: { ceasa: 'Maçã Gala Nacional', amount: 0.3 } },
      { name: 'Manga', qty: 1, unit: 'unidade', list: { ceasa: 'Manga Tommy Atkins', amount: 0.4 } },
      { name: 'Mamão formosa', qty: 0.5, unit: 'unidade', list: { ceasa: 'Mamão Formosa', amount: 0.8 } },
      { name: 'Morango', qty: 1, unit: 'caixinha', list: { ceasa: 'Morango', amount: 0.3 } },
      { name: 'Uva', qty: 300, unit: 'g', list: { ceasa: 'Uva Comum de Mesa', amount: 0.3 } },
      { name: 'Laranja', qty: 3, unit: 'unidade', note: 'suco', list: { ceasa: 'Laranja Suco', amount: 0.6 } }
    ],
    steps: [
      'Lave bem todas as frutas.',
      'Corte em cubos pequenos, deixando a banana e a maçã por último para não escurecerem.',
      'Misture tudo com o suco das laranjas e leve à geladeira por 30 minutos.'
    ]
  },

  {
    id: 'pudim-de-leite',
    name: 'Pudim de leite condensado',
    category: 'Doces',
    emoji: '🍮',
    minutes: 70,
    servings: 8,
    ingredients: [
      { name: 'Leite condensado', qty: 1, unit: 'lata' },
      { name: 'Leite', qty: 2, unit: 'xícara', note: 'a mesma medida da lata' },
      { name: 'Ovos', qty: 3, unit: 'unidade' },
      { name: 'Açúcar', qty: 1, unit: 'xícara', note: 'calda' }
    ],
    steps: [
      'Derreta o açúcar na própria forma em fogo baixo até virar um caramelo dourado. Espalhe pelas laterais.',
      'Bata no liquidificador o leite condensado, o leite e os ovos.',
      'Despeje na forma, cubra com papel-alumínio e asse em banho-maria a 180 °C por 50 minutos.',
      'Deixe esfriar, leve à geladeira por 4 horas e desenforme.'
    ]
  },

  {
    id: 'brigadeiro',
    name: 'Brigadeiro de panela',
    category: 'Doces',
    emoji: '🍫',
    minutes: 15,
    servings: 6,
    ingredients: [
      { name: 'Leite condensado', qty: 1, unit: 'lata' },
      { name: 'Chocolate em pó', qty: 3, unit: 'colher de sopa' },
      { name: 'Manteiga', qty: 1, unit: 'colher de sopa' },
      { name: 'Chocolate granulado', qty: 1, unit: 'pacote', note: 'opcional' }
    ],
    steps: [
      'Leve tudo (menos o granulado) ao fogo baixo, mexendo sem parar.',
      'Cozinhe por 10 minutos, até desgrudar do fundo da panela.',
      'Sirva de colher ou, depois de frio, enrole em bolinhas e passe no granulado.'
    ]
  },

  // ── Bebidas ───────────────────────────────────────────────────────

  {
    id: 'suco-verde',
    name: 'Suco verde',
    category: 'Bebidas',
    emoji: '🥤',
    minutes: 10,
    servings: 2,
    ingredients: [
      { name: 'Couve', qty: 2, unit: 'unidade', note: 'folhas', list: { ceasa: 'Couve Manteiga', amount: 1 } },
      { name: 'Abacaxi', qty: 2, unit: 'fatia', list: { ceasa: 'Abacaxi Perola', amount: 1 } },
      { name: 'Maçã', qty: 1, unit: 'unidade', list: { ceasa: 'Maçã Gala Nacional', amount: 0.15 } },
      { name: 'Limão', qty: 1, unit: 'unidade', note: 'suco', list: { ceasa: 'Limão Taiti', amount: 0.1 } },
      { name: 'Gengibre', qty: 1, unit: 'unidade', note: 'pedaço pequeno', list: { ceasa: 'Gengibre', amount: 0.05 } }
    ],
    steps: [
      'Bata tudo no liquidificador com 400 ml de água gelada.',
      'Coe se preferir e sirva na hora.'
    ]
  },

  {
    id: 'limonada-suica',
    name: 'Limonada suíça',
    category: 'Bebidas',
    emoji: '🍋',
    minutes: 10,
    servings: 4,
    ingredients: [
      { name: 'Limão', qty: 3, unit: 'unidade', list: { ceasa: 'Limão Taiti', amount: 0.25 } },
      { name: 'Leite condensado', qty: 0.5, unit: 'lata' },
      { name: 'Açúcar', qty: 3, unit: 'colher de sopa', pantry: true }
    ],
    steps: [
      'Lave bem os limões, corte as pontas e divida em 4 partes, tirando o miolo branco.',
      'Bata rapidamente (no máximo 10 segundos) com 1 litro de água gelada, para não amargar, e coe.',
      'Volte ao liquidificador com o leite condensado e o açúcar, bata e sirva com gelo.'
    ]
  }
]

export default recipes
