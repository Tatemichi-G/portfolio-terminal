// =====================
// Workers
// （public/img/prof に合わせている）
// =====================
export const Workers = [
  {
    id: 1,
    name: "Genki Tatemichi",
    nameJa: "立道元気",
    livingAge: "06/09",
    url: "/img/prof/prof_tatemichi.png",
    description: `近畿大学を卒業後、（株）エレコムグループにて営業職として約4年間、（株）ぐるなびで代行プランナーとしてマーケティング・コンサルティング分野に1年間従事しました。
    現在はフロントエンドエンジニアへの転職を目指し、制作活動に励んでいます。ユーザーインタラクティブなサイト制作が好きで、GSAP/ScrollTriggerやThree.jsを使った演出が得意です。`,
    skill: `HTML/CSS/JavaScript/Figma/Photoshop/Illustrator`,
    skill2: `GSAP/ScrollTrigger/Three/React/R3F/`,
  },
];

// =====================
// works
// （public/img/thumbnails/PC に合わせている）
// =====================
export const works = [
  // =====================
  // My Works
  // =====================
  {
    id: 1,
    workerId: 1,
    name: "RoomPlanner",
    nameJa: "ルームプランナー",
    title: "VanillaJS × ThreeJS で作成した、インテリア空間デザインアプリ",
    url: "/img/thumbnail/PC/roomplanner.png",
    stacks: "VanillaJS/Three",
    tagId: 1,
  },
  {
    id: 2,
    workerId: 1,
    name: "ThreeCarsDemo",
    nameJa: "Threeカーデモ",
    title:
      "ThreeJS × ScrollTrigger(GSAP)で作成した、スクロールインタラクティブなデモサイト",
    url: "/img/thumbnail/PC/Three_cars_demo_2.png",
    video: "/video/urbanCarDemo.mp4",
    stacks: "VanillaJS/Three/GSAP・ScrollTrigger",
    tagId: 2,
  },
  {
    id: 3,
    workerId: 1,
    name: "CarColorEditor",
    nameJa: "カーモデルカラーエディタ",
    title: "R3Fで作成した、車モデルのメッシュカラーエディタ",
    url: "/img/thumbnail/PC/Car_Model_color_editor.png",
    stacks: "React-Three-Fiber",
    tagId: 1,
  },
  {
    id: 4,
    workerId: 1,
    name: "TaskWorkplace",
    nameJa: "タスクワークプレイス",
    title:
      "Reactで作成した、カレンダー連動・日別タスク管理・期限切れ一覧・完了履歴を備えたタスク管理アプリ",
    url: "/img/thumbnail/PC/Task_Workplace.png",
    stacks: "React",
    tagId: 1,
  },
  {
    id: 5,
    workerId: 1,
    name: "NOTE STACKS",
    nameJa: "ノートスタックス",
    title:
      "React/PHP/MariaDB/Docker/nginxで作成した、メモアプリ",
    url: "/img/thumbnail/PC/note_stacks.png",
    stacks: "React/PHP/Docker/nginx",
    tagId: 1,
  },

  // =====================
  // Paintings
  // workerId: すべて 1
  // =====================
  {
    id: 21,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "花瓶の花と法螺貝",
    title: "Anne Vallayer-Coster / 静物画",
    description:
      "花々の繊細な質感と、貝殻の硬質な存在感を対比させた優雅な静物画。18世紀フランス絵画らしい洗練が光る作品。",
    url: "/img/thumbnail/PC/Anne_Vallayer_Coster_Vase_of_Flowers_and_Conch_Shell.jpg",
  },
  {
    id: 22,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "ルーヴシエンヌの道",
    title: "Auguste Renoir / 風景画",
    description:
      "やわらかな光と空気の揺らぎを感じさせる初期ルノワールの風景画。印象派らしい明るい筆触が魅力。",
    url: "/img/thumbnail/PC/Auguste_Renoir_A_Road_in_Louveciennes.jpg",
  },
  {
    id: 23,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "ウジェーヌ・ミュレ",
    title: "Auguste Renoir / 肖像画",
    description:
      "パリの文化人を描いた肖像画。人物の温かみと、ルノワール特有の柔らかな色彩感覚がよく表れている。",
    url: "/img/thumbnail/PC/Auguste_Renoir_Eugene_Murer.jpg",
  },
  {
    id: 24,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "カチュール・マンデスの娘たち",
    title: "Auguste Renoir / 肖像画",
    description:
      "少女たちの気品と無垢さを軽やかな色面で描いた作品。人物表現の華やかさと親密さが同居している。",
    url: "/img/thumbnail/PC/Auguste_Renoir_The_Daughters_of_Catulle_Mendes_Huguette.jpg",
  },
  {
    id: 25,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "楽園",
    title: "Carlo Saraceni / 宗教・寓意画",
    description:
      "劇的な光と色彩で理想化された世界を描く作品。バロック初期らしい幻想性と緊張感を感じさせる。",
    url: "/img/thumbnail/PC/Carlo_Saraceni_Paradise.jpg",
  },
  {
    id: 26,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "花束",
    title: "Clara Peeters / 静物画",
    description:
      "花々の鮮度や質感を緻密に描いた静物画。小さな対象の観察力と、静かな華やかさが印象的な作品。",
    url: "/img/thumbnail/PC/Clara_Peeters_A_Bouquet_of_Flowers.jpg",
  },
  {
    id: 27,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "帽子店にて",
    title: "Edgar Degas / 近代生活画",
    description:
      "都会的な空気と人物の一瞬の仕草を切り取ったドガらしい作品。室内光の扱いと構図の洗練が際立つ。",
    url: "/img/thumbnail/PC/Edgar_Degas_At_the_Milliner's.jpg",
  },
  {
    id: 28,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "惑星と大陸の寓意",
    title: "Giovanni Battista Tiepolo / 天井画・寓意画",
    description:
      "壮大な構成と軽やかな色彩で天上的世界を描いたティエポロの代表的な寓意表現。祝祭的で華やかな一作。",
    url: "/img/thumbnail/PC/Giovanni_Battista_Tiepolo_Allegory_of_the_Planets_and_Continents.jpg",
  },
  {
    id: 29,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "エジプトへの逃避",
    title: "Giovanni Battista Tiepolo / 宗教画",
    description:
      "宗教的主題を明るく軽快な筆致で描いた作品。旅の不安と神聖さが、伸びやかな構図の中に共存している。",
    url: "/img/thumbnail/PC/Giovanni_Battista_Tiepolo_The_Flight_into_Egypt.jpg",
  },
  {
    id: 30,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "急使",
    title: "Giovanni Boldini / 肖像・人物画",
    description:
      "スピード感のある筆致と黒の流麗な扱いが印象的な作品。ボルディーニらしい都会的な気配が強い。",
    url: "/img/thumbnail/PC/Giovanni_Boldini_The_Dispatch_Bearer.jpg",
  },
  {
    id: 31,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "マーダ・プリマヴェージ",
    title: "Gustav Klimt / 肖像画",
    description:
      "鮮やかな色彩と装飾性の中に、少女の存在感を際立たせた肖像画。クリムト後期の軽やかさが見える作品。",
    url: "/img/thumbnail/PC/Gustav_Klimt_Mada_Primavesi.jpg",
  },
  {
    id: 32,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "音楽",
    title: "Gustav Klimt / 象徴主義",
    description:
      "音楽の持つ精神性と官能性を象徴的に描いた作品。クリムトらしい装飾感覚と余韻のある構成が魅力。",
    url: "/img/thumbnail/PC/Gustav_Klimt_Music.jpg",
  },
  {
    id: 33,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "アデーレ・ブロッホ＝バウアーの肖像 I",
    title: "Gustav Klimt / 肖像画",
    description:
      "黄金様式を代表するクリムトの傑作。人物と装飾が溶け合うような構成が、唯一無二の華やかさを生んでいる。",
    url: "/img/thumbnail/PC/Gustav_Klimt_Portrait_of_Adele_Bloch_Bauer.jpg",
  },
  {
    id: 34,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "接吻",
    title: "Gustav Klimt / 象徴主義",
    description:
      "愛と融合の瞬間を金箔の装飾性の中に封じ込めた代表作。親密さと永遠性を同時に感じさせる。",
    url: "/img/thumbnail/PC/Gustav_Klimt_The_Kiss.jpg",
  },
  {
    id: 35,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "薔薇と百合",
    title: "Henri Fantin-Latour / 静物画",
    description:
      "花の柔らかさと色の深みを静かに描いた上品な静物画。詩的で落ち着いた空気感が美しい。",
    url: "/img/thumbnail/PC/Henri_Fantin_Latour_Roses_and_Lilies.jpg",
  },
  {
    id: 36,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "聖体を礼拝する聖母",
    title: "Jean-Auguste-Dominique Ingres / 宗教画",
    description:
      "アングルらしい端正な線と静謐さが際立つ宗教画。厳かな構成の中に澄んだ精神性が漂う。",
    url: "/img/thumbnail/PC/Jean_Auguste_Dominique_Ingres_The_Virgin_Adoring_the_Host.jpg",
  },
  {
    id: 37,
    workerId: 1,
     name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "マドンナ・デッラ・サルーテの回廊から見たヴェネツィア",
    title: "J. M. W. Turner / 風景画",
    description:
      "光と水の反射が溶け合う、ターナーらしい幻想的なヴェネツィア景観。都市そのものが光に変わるような作品。",
    url: "/img/thumbnail/PC/Joseph_Mallord_William_Turner_Venice_from_the_Porch_of_Madonna_della_Salute.jpg",
  },
  {
    id: 38,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "ソロモンの審判",
    title: "Leonaert Bramer / 宗教・歴史画",
    description:
      "聖書の場面を劇的な構図と陰影で描いた作品。人物の動きと緊張感が画面全体に満ちている。",
    url: "/img/thumbnail/PC/Leonaert_Bramer_The_Judgment_of_Solomon.jpg",
  },
  {
    id: 39,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "玉座の聖母子",
    title: "Master of the Magdalen / 宗教画",
    description:
      "中世末期の敬虔な空気を伝える聖母子像。正面性の強い構図と装飾的な細部が印象に残る。",
    url: "/img/thumbnail/PC/Master_of_the_Magdalen_Madonna_and_Child_Enthroned.jpg",
  },
  {
    id: 40,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "漁師たち",
    title: "Paul Cézanne / 風景・人物画",
    description:
      "人物と自然を安定した構造でまとめたセザンヌらしい作品。色面による量感表現が魅力。",
    url: "/img/thumbnail/PC/Paul_Cezanne_The_Fishermen.jpg",
  },
  {
    id: 41,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "狼と狐の狩り",
    title: "Peter Paul Rubens / 狩猟画",
    description:
      "激しい運動感と躍動する群像表現が圧巻の作品。ルーベンス特有の力強さが全面に出ている。",
    url: "/img/thumbnail/PC/Peter_Paul_Rubens_Wolf_and_Fox_Hunt.jpg",
  },
  {
    id: 42,
    workerId: 1,
    name: "※作品のプレースホルダです。随時作品に更新されます。",
    nameJa: "レディ・スミスとその子どもたち",
    title: "Sir Joshua Reynolds / 肖像画",
    description:
      "母子の気品と親密さを上品にまとめた肖像画。18世紀イギリス肖像画の優雅さを感じさせる一作。",
    url: "/img/thumbnail/PC/Sir_Joshua_Reynolds_Lady_Smith_and_Her_Children.jpg",
  },
];

export const workTags = [
  { id: 1, tagName: "WebApp" },
  { id: 2, tagName: "WebSite" },
  { id: 3, tagName: "LandingPage" },
  { id: 4, tagName: "CampDesign" },
  { id: 5, tagName: "Photo" },
  { id: 6, tagName: "3Dmodel" },
];

