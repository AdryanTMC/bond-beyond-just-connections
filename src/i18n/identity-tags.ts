import type { Lang } from "./dictionaries";

// Compact translations for identity tag labels + page header chip.
// Keyed by tag key (matches sections in app.identity.tsx).
// Falls back to English when a translation is missing.

type LangMap = Partial<Record<Lang, string>> & { en: string };

export const identityHeader: Record<Lang, string> = {
  en: "Identity",
  pt: "Identidade",
  es: "Identidad",
  fr: "Identité",
  de: "Identität",
  it: "Identità",
  ja: "アイデンティティ",
  ko: "정체성",
};

export const identityTagLabels: Record<string, LangMap> = {
  // lifestyle
  gym: { en: "Gym People", pt: "Academia", es: "Gimnasio", fr: "Salle de sport", de: "Fitnessstudio", it: "Palestra", ja: "ジム好き", ko: "헬스인" },
  athletes: { en: "Athletes", pt: "Atletas", es: "Atletas", fr: "Athlètes", de: "Athleten", it: "Atleti", ja: "アスリート", ko: "운동선수" },
  travelers: { en: "Travelers", pt: "Viajantes", es: "Viajeros", fr: "Voyageurs", de: "Reisende", it: "Viaggiatori", ja: "旅人", ko: "여행자" },
  luxury: { en: "Luxury Lifestyle", pt: "Estilo de luxo", es: "Estilo de lujo", fr: "Style luxe", de: "Luxus-Lifestyle", it: "Stile di lusso", ja: "ラグジュアリー", ko: "럭셔리" },
  minimalists: { en: "Minimalists", pt: "Minimalistas", es: "Minimalistas", fr: "Minimalistes", de: "Minimalisten", it: "Minimalisti", ja: "ミニマリスト", ko: "미니멀리스트" },
  entrepreneurs: { en: "Entrepreneurs", pt: "Empreendedores", es: "Emprendedores", fr: "Entrepreneurs", de: "Unternehmer", it: "Imprenditori", ja: "起業家", ko: "기업가" },
  creators: { en: "Creators", pt: "Criadores", es: "Creadores", fr: "Créateurs", de: "Kreative", it: "Creator", ja: "クリエイター", ko: "크리에이터" },
  influencers: { en: "Influencers", pt: "Influenciadores", es: "Influencers", fr: "Influenceurs", de: "Influencer", it: "Influencer", ja: "インフルエンサー", ko: "인플루언서" },
  nomads: { en: "Digital Nomads", pt: "Nômades digitais", es: "Nómadas digitales", fr: "Nomades digitaux", de: "Digitale Nomaden", it: "Nomadi digitali", ja: "デジタルノマド", ko: "디지털 노마드" },
  artists: { en: "Artists", pt: "Artistas", es: "Artistas", fr: "Artistes", de: "Künstler", it: "Artisti", ja: "アーティスト", ko: "예술가" },
  musicians: { en: "Musicians", pt: "Músicos", es: "Músicos", fr: "Musiciens", de: "Musiker", it: "Musicisti", ja: "ミュージシャン", ko: "뮤지션" },
  fashion: { en: "Fashion Lovers", pt: "Apaixonados por moda", es: "Amantes de la moda", fr: "Mode", de: "Mode-Fans", it: "Amanti della moda", ja: "ファッション好き", ko: "패션 애호가" },
  moto: { en: "Motorcycle Riders", pt: "Motociclistas", es: "Motociclistas", fr: "Motards", de: "Motorradfahrer", it: "Motociclisti", ja: "バイク乗り", ko: "라이더" },
  cars: { en: "Car Enthusiasts", pt: "Apaixonados por carros", es: "Apasionados del motor", fr: "Passionnés d'autos", de: "Auto-Fans", it: "Amanti delle auto", ja: "車好き", ko: "자동차 마니아" },
  beach: { en: "Beach Lifestyle", pt: "Praia", es: "Vida de playa", fr: "Plage", de: "Strand-Lifestyle", it: "Vita da spiaggia", ja: "ビーチ派", ko: "비치 라이프" },
  nature: { en: "Nature Lovers", pt: "Amantes da natureza", es: "Amantes de la naturaleza", fr: "Amoureux de la nature", de: "Naturliebhaber", it: "Amanti della natura", ja: "自然好き", ko: "자연 애호가" },
  pets: { en: "Pet Lovers", pt: "Amantes de pets", es: "Amantes de mascotas", fr: "Amis des animaux", de: "Tierfreunde", it: "Amanti degli animali", ja: "ペット好き", ko: "반려동물 애호가" },
  // personality
  goth: { en: "Goth", pt: "Gótico", es: "Gótico", fr: "Gothique", de: "Gothic", it: "Gotico", ja: "ゴス", ko: "고스" },
  nerd: { en: "Nerd", pt: "Nerd", es: "Nerd", fr: "Nerd", de: "Nerd", it: "Nerd", ja: "ナード", ko: "너드" },
  geek: { en: "Geek", pt: "Geek", es: "Geek", fr: "Geek", de: "Geek", it: "Geek", ja: "ギーク", ko: "긱" },
  academic: { en: "Academic", pt: "Acadêmico", es: "Académico", fr: "Académique", de: "Akademisch", it: "Accademico", ja: "アカデミック", ko: "학자형" },
  students: { en: "University Students", pt: "Universitários", es: "Universitarios", fr: "Étudiants", de: "Studenten", it: "Universitari", ja: "大学生", ko: "대학생" },
  introvert: { en: "Introvert", pt: "Introvertido", es: "Introvertido", fr: "Introverti", de: "Introvertiert", it: "Introverso", ja: "内向的", ko: "내향형" },
  extrovert: { en: "Extrovert", pt: "Extrovertido", es: "Extrovertido", fr: "Extraverti", de: "Extravertiert", it: "Estroverso", ja: "外向的", ko: "외향형" },
  romantic: { en: "Romantic", pt: "Romântico", es: "Romántico", fr: "Romantique", de: "Romantisch", it: "Romantico", ja: "ロマンチスト", ko: "로맨틱" },
  intellectual: { en: "Intellectual", pt: "Intelectual", es: "Intelectual", fr: "Intellectuel", de: "Intellektuell", it: "Intellettuale", ja: "知的", ko: "지적인" },
  spiritual: { en: "Spiritual", pt: "Espiritualizado", es: "Espiritual", fr: "Spirituel", de: "Spirituell", it: "Spirituale", ja: "スピリチュアル", ko: "영적인" },
  alternative: { en: "Alternative", pt: "Alternativo", es: "Alternativo", fr: "Alternatif", de: "Alternativ", it: "Alternativo", ja: "オルタナ", ko: "얼터너티브" },
  traditional: { en: "Traditional", pt: "Tradicional", es: "Tradicional", fr: "Traditionnel", de: "Traditionell", it: "Tradizionale", ja: "伝統的", ko: "전통적" },
  ambitious: { en: "Ambitious", pt: "Ambicioso", es: "Ambicioso", fr: "Ambitieux", de: "Ehrgeizig", it: "Ambizioso", ja: "野心家", ko: "야망가" },
  homeoriented: { en: "Home Oriented", pt: "Caseiro", es: "Hogareño", fr: "Casanier", de: "Häuslich", it: "Casalingo", ja: "家庭派", ko: "집순이/집돌이" },
  quiet: { en: "Quiet People", pt: "Pessoas tranquilas", es: "Personas tranquilas", fr: "Calmes", de: "Ruhig", it: "Tranquilli", ja: "物静か", ko: "조용한 사람" },
  party: { en: "Party People", pt: "Festeiros", es: "Fiesteros", fr: "Fêtards", de: "Partyleute", it: "Festaioli", ja: "パーティー好き", ko: "파티피플" },
  // belief
  christian: { en: "Christian", pt: "Cristão", es: "Cristiano", fr: "Chrétien", de: "Christlich", it: "Cristiano", ja: "キリスト教徒", ko: "기독교" },
  catholic: { en: "Catholic", pt: "Católico", es: "Católico", fr: "Catholique", de: "Katholisch", it: "Cattolico", ja: "カトリック", ko: "가톨릭" },
  evangelical: { en: "Evangelical", pt: "Evangélico", es: "Evangélico", fr: "Évangélique", de: "Evangelisch", it: "Evangelico", ja: "福音派", ko: "개신교" },
  muslim: { en: "Muslim", pt: "Muçulmano", es: "Musulmán", fr: "Musulman", de: "Muslimisch", it: "Musulmano", ja: "イスラム教徒", ko: "무슬림" },
  jewish: { en: "Jewish", pt: "Judeu", es: "Judío", fr: "Juif", de: "Jüdisch", it: "Ebreo", ja: "ユダヤ教徒", ko: "유대교" },
  buddhist: { en: "Buddhist", pt: "Budista", es: "Budista", fr: "Bouddhiste", de: "Buddhistisch", it: "Buddista", ja: "仏教徒", ko: "불교" },
  spiritualism: { en: "Spiritual", pt: "Espiritualidade", es: "Espiritual", fr: "Spirituel", de: "Spirituell", it: "Spirituale", ja: "スピリチュアル", ko: "영성" },
  astrology: { en: "Astrology / Zodiac", pt: "Astrologia / Zodíaco", es: "Astrología / Zodíaco", fr: "Astrologie / Zodiaque", de: "Astrologie / Sternzeichen", it: "Astrologia / Zodiaco", ja: "占星術", ko: "점성술" },
  atheist: { en: "Atheist", pt: "Ateu", es: "Ateo", fr: "Athée", de: "Atheist", it: "Ateo", ja: "無神論", ko: "무신론" },
  agnostic: { en: "Agnostic", pt: "Agnóstico", es: "Agnóstico", fr: "Agnostique", de: "Agnostisch", it: "Agnostico", ja: "不可知論", ko: "불가지론" },
  // orientation
  friendship: { en: "Friendship", pt: "Amizade", es: "Amistad", fr: "Amitié", de: "Freundschaft", it: "Amicizia", ja: "友情", ko: "우정" },
  longterm: { en: "Long-Term Relationship", pt: "Relação séria", es: "Relación seria", fr: "Relation sérieuse", de: "Feste Beziehung", it: "Relazione seria", ja: "真剣交際", ko: "장기 연애" },
  casual: { en: "Casual Dating", pt: "Encontros casuais", es: "Citas casuales", fr: "Rencontres casual", de: "Casual Dating", it: "Incontri casual", ja: "気軽なデート", ko: "캐주얼 데이트" },
  marriage: { en: "Marriage Focused", pt: "Foco em casamento", es: "Enfoque en matrimonio", fr: "Mariage", de: "Heirat im Sinn", it: "Verso il matrimonio", ja: "結婚志向", ko: "결혼 지향" },
  networking: { en: "Networking", pt: "Networking", es: "Networking", fr: "Réseautage", de: "Networking", it: "Networking", ja: "ネットワーキング", ko: "네트워킹" },
  closecircle: { en: "Close Circle", pt: "Círculo íntimo", es: "Círculo cercano", fr: "Cercle proche", de: "Innerer Kreis", it: "Cerchia intima", ja: "親密な輪", ko: "가까운 모임" },
  community: { en: "Community", pt: "Comunidade", es: "Comunidad", fr: "Communauté", de: "Gemeinschaft", it: "Comunità", ja: "コミュニティ", ko: "커뮤니티" },
  // identity-incl
  lgbtqia: { en: "LGBTQIA+", pt: "LGBTQIA+", es: "LGBTQIA+", fr: "LGBTQIA+", de: "LGBTQIA+", it: "LGBTQIA+", ja: "LGBTQIA+", ko: "LGBTQIA+" },
  hetero: { en: "Heterosexual", pt: "Heterossexual", es: "Heterosexual", fr: "Hétérosexuel", de: "Heterosexuell", it: "Eterosessuale", ja: "異性愛", ko: "이성애" },
  bi: { en: "Bisexual", pt: "Bissexual", es: "Bisexual", fr: "Bisexuel", de: "Bisexuell", it: "Bisessuale", ja: "バイセクシュアル", ko: "양성애" },
  gay: { en: "Gay", pt: "Gay", es: "Gay", fr: "Gay", de: "Schwul", it: "Gay", ja: "ゲイ", ko: "게이" },
  lesbian: { en: "Lesbian", pt: "Lésbica", es: "Lesbiana", fr: "Lesbienne", de: "Lesbisch", it: "Lesbica", ja: "レズビアン", ko: "레즈비언" },
  nb: { en: "Non-binary", pt: "Não-binário", es: "No binario", fr: "Non binaire", de: "Nichtbinär", it: "Non binario", ja: "ノンバイナリー", ko: "논바이너리" },
  trans: { en: "Transgender", pt: "Transgênero", es: "Transgénero", fr: "Transgenre", de: "Transgender", it: "Transgender", ja: "トランスジェンダー", ko: "트랜스젠더" },
  // hobbies
  gaming: { en: "Gaming", pt: "Games", es: "Videojuegos", fr: "Jeux vidéo", de: "Gaming", it: "Videogiochi", ja: "ゲーム", ko: "게임" },
  anime: { en: "Anime", pt: "Anime", es: "Anime", fr: "Anime", de: "Anime", it: "Anime", ja: "アニメ", ko: "애니메" },
  tech: { en: "Technology", pt: "Tecnologia", es: "Tecnología", fr: "Technologie", de: "Technik", it: "Tecnologia", ja: "テクノロジー", ko: "기술" },
  books: { en: "Books", pt: "Livros", es: "Libros", fr: "Livres", de: "Bücher", it: "Libri", ja: "読書", ko: "독서" },
  cooking: { en: "Cooking", pt: "Culinária", es: "Cocina", fr: "Cuisine", de: "Kochen", it: "Cucina", ja: "料理", ko: "요리" },
  photo: { en: "Photography", pt: "Fotografia", es: "Fotografía", fr: "Photographie", de: "Fotografie", it: "Fotografia", ja: "写真", ko: "사진" },
  fitness: { en: "Fitness", pt: "Fitness", es: "Fitness", fr: "Fitness", de: "Fitness", it: "Fitness", ja: "フィットネス", ko: "피트니스" },
  cinema: { en: "Cinema", pt: "Cinema", es: "Cine", fr: "Cinéma", de: "Kino", it: "Cinema", ja: "映画", ko: "영화" },
  music: { en: "Music", pt: "Música", es: "Música", fr: "Musique", de: "Musik", it: "Musica", ja: "音楽", ko: "음악" },
  dance: { en: "Dance", pt: "Dança", es: "Danza", fr: "Danse", de: "Tanz", it: "Danza", ja: "ダンス", ko: "댄스" },
  hiking: { en: "Hiking", pt: "Trilhas", es: "Senderismo", fr: "Randonnée", de: "Wandern", it: "Escursionismo", ja: "ハイキング", ko: "등산" },
  meditation: { en: "Meditation", pt: "Meditação", es: "Meditación", fr: "Méditation", de: "Meditation", it: "Meditazione", ja: "瞑想", ko: "명상" },
  investing: { en: "Investing", pt: "Investimentos", es: "Inversión", fr: "Investissement", de: "Investieren", it: "Investimenti", ja: "投資", ko: "투자" },
  startups: { en: "Startups", pt: "Startups", es: "Startups", fr: "Startups", de: "Startups", it: "Startup", ja: "スタートアップ", ko: "스타트업" },
  ai: { en: "Artificial Intelligence", pt: "Inteligência Artificial", es: "Inteligencia Artificial", fr: "Intelligence Artificielle", de: "Künstliche Intelligenz", it: "Intelligenza Artificiale", ja: "人工知能", ko: "인공지능" },
  content: { en: "Content Creation", pt: "Criação de conteúdo", es: "Creación de contenido", fr: "Création de contenu", de: "Content-Erstellung", it: "Creazione di contenuti", ja: "コンテンツ制作", ko: "콘텐츠 제작" },
  podcasts: { en: "Podcasts", pt: "Podcasts", es: "Podcasts", fr: "Podcasts", de: "Podcasts", it: "Podcast", ja: "ポッドキャスト", ko: "팟캐스트" },
  camping: { en: "Camping", pt: "Camping", es: "Camping", fr: "Camping", de: "Camping", it: "Campeggio", ja: "キャンプ", ko: "캠핑" },
  // food
  vegan: { en: "Vegan", pt: "Vegano", es: "Vegano", fr: "Végan", de: "Vegan", it: "Vegano", ja: "ヴィーガン", ko: "비건" },
  vegetarian: { en: "Vegetarian", pt: "Vegetariano", es: "Vegetariano", fr: "Végétarien", de: "Vegetarisch", it: "Vegetariano", ja: "ベジタリアン", ko: "채식주의" },
  healthy: { en: "Healthy Lifestyle", pt: "Vida saudável", es: "Vida saludable", fr: "Vie saine", de: "Gesunder Lifestyle", it: "Vita sana", ja: "健康志向", ko: "건강한 라이프" },
  coffee: { en: "Coffee Lovers", pt: "Apaixonados por café", es: "Amantes del café", fr: "Amateurs de café", de: "Kaffee-Liebhaber", it: "Amanti del caffè", ja: "コーヒー好き", ko: "커피 애호가" },
  wine: { en: "Wine Lovers", pt: "Apaixonados por vinho", es: "Amantes del vino", fr: "Amateurs de vin", de: "Weinliebhaber", it: "Amanti del vino", ja: "ワイン好き", ko: "와인 애호가" },
  foodies: { en: "Foodies", pt: "Foodies", es: "Foodies", fr: "Foodies", de: "Foodies", it: "Foodies", ja: "グルメ", ko: "푸디" },
  // social
  middle: { en: "Middle Class", pt: "Classe média", es: "Clase media", fr: "Classe moyenne", de: "Mittelschicht", it: "Classe media", ja: "ミドルクラス", ko: "중산층" },
  high: { en: "High Class", pt: "Classe alta", es: "Clase alta", fr: "Classe aisée", de: "Oberschicht", it: "Alta società", ja: "ハイクラス", ko: "상류층" },
  luxe: { en: "Luxury Lifestyle", pt: "Estilo de luxo", es: "Estilo de lujo", fr: "Style luxe", de: "Luxus-Lifestyle", it: "Stile di lusso", ja: "ラグジュアリー", ko: "럭셔리" },
  founders: { en: "Startup Founders", pt: "Fundadores de startup", es: "Fundadores de startup", fr: "Fondateurs de startup", de: "Startup-Gründer", it: "Founder di startup", ja: "創業者", ko: "스타트업 창업자" },
  ceos: { en: "CEOs", pt: "CEOs", es: "CEOs", fr: "CEO", de: "CEOs", it: "CEO", ja: "CEO", ko: "CEO" },
  studs: { en: "Students", pt: "Estudantes", es: "Estudiantes", fr: "Étudiants", de: "Studierende", it: "Studenti", ja: "学生", ko: "학생" },
  pros: { en: "Professionals", pt: "Profissionais", es: "Profesionales", fr: "Professionnels", de: "Berufstätige", it: "Professionisti", ja: "プロフェッショナル", ko: "직장인" },
  investors: { en: "Investors", pt: "Investidores", es: "Inversores", fr: "Investisseurs", de: "Investoren", it: "Investitori", ja: "投資家", ko: "투자자" },
  // generation
  ya: { en: "Young Adults", pt: "Jovens adultos", es: "Jóvenes adultos", fr: "Jeunes adultes", de: "Junge Erwachsene", it: "Giovani adulti", ja: "若年層", ko: "젊은 성인" },
  millennial: { en: "Millennials", pt: "Millennials", es: "Millennials", fr: "Millennials", de: "Millennials", it: "Millennial", ja: "ミレニアル", ko: "밀레니얼" },
  genz: { en: "Gen Z", pt: "Geração Z", es: "Generación Z", fr: "Génération Z", de: "Gen Z", it: "Gen Z", ja: "Z世代", ko: "Z세대" },
  mature: { en: "Mature Adults", pt: "Adultos maduros", es: "Adultos maduros", fr: "Adultes matures", de: "Reife Erwachsene", it: "Adulti maturi", ja: "成熟層", ko: "중장년" },
  seniors: { en: "Seniors", pt: "Seniores", es: "Mayores", fr: "Seniors", de: "Senioren", it: "Senior", ja: "シニア", ko: "시니어" },
};

export function tagLabel(key: string, lang: Lang, fallback: string): string {
  const entry = identityTagLabels[key];
  if (!entry) return fallback;
  return entry[lang] ?? entry.en ?? fallback;
}