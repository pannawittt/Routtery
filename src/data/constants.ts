export type Mode = "walk" | "bike" | "boat";
export type LotteryStatus = "available" | "active" | "done";
export type Lang = "TH" | "EN";

export const modeConfig: Record<Mode, { color: string; label: string; emoji: string }> = {
  walk: { color: "#00A878", label: "เดินเท้า", emoji: "🚶" },
  bike: { color: "#7B2FBE", label: "จักรยาน", emoji: "🚲" },
  boat: { color: "#0057B8", label: "เรือคลอง", emoji: "⛵" },
};

export interface CheckpointData {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  teaser: string;
  story: string;
  question: string;
  options: string[];
  correct: number;
  lat: number;
  lng: number;
}

export const checkpoints: CheckpointData[] = [
  {
    id: 0,
    name: "ตลาดน้อย",
    subtitle: "ชุมชนจีนโบราณริมคลอง",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=900&h=400&fit=crop&auto=format",
    teaser: "ชุมชนจีนเก่าแก่อายุกว่า 200 ปี ที่ยังคงรักษาเอกลักษณ์ดั้งเดิมไว้อย่างงดงาม",
    story: "ตลาดน้อยเป็นชุมชนชาวจีนเก่าแก่ที่ตั้งอยู่ริมคลองผดุงกรุงเกษม มีประวัติศาสตร์ยาวนานกว่า 200 ปี อาคารเก่าแก่สถาปัตยกรรมชิโน-โปรตุกีสยังคงอยู่ท่ามกลางวิถีชีวิตที่เปลี่ยนไป ตรอกซอกซอยเล็กๆ นำพาผู้มาเยือนย้อนเวลากลับสู่อดีต เสน่ห์ของย่านนี้อยู่ที่ร้านรวงเก่าๆ ที่ยังดำเนินกิจการมาหลายชั่วอายุคน",
    question: "ตลาดน้อยมีอายุประมาณกี่ปี?",
    options: ["ประมาณ 100 ปี", "ประมาณ 200 ปี", "ประมาณ 300 ปี", "ประมาณ 400 ปี"],
    correct: 1,
    lat: 13.7370, lng: 100.5100,
  },
  {
    id: 1,
    name: "หัวลำโพง",
    subtitle: "สถานีรถไฟประวัติศาสตร์",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=900&h=400&fit=crop&auto=format",
    teaser: "สถานีรถไฟที่เก่าแก่ที่สุดของกรุงเทพฯ สร้างในรัชกาลที่ 5",
    story: "สถานีรถไฟกรุงเทพ หรือหัวลำโพง สร้างขึ้นในสมัยรัชกาลที่ 5 ออกแบบโดยสถาปนิกชาวอิตาลีในสไตล์นีโอคลาสสิก โดมขนาดใหญ่ตรงกลางเป็นสัญลักษณ์ที่โดดเด่นของสถานี มีอายุกว่า 100 ปีและยังคงเปิดให้บริการ สถานีแห่งนี้เชื่อมโยงกรุงเทพฯ กับทุกภูมิภาคมาตลอดกว่าศตวรรษ",
    question: "หัวลำโพงสร้างในสมัยรัชกาลที่เท่าไหร่?",
    options: ["รัชกาลที่ 5", "รัชกาลที่ 6", "รัชกาลที่ 7", "รัชกาลที่ 4"],
    correct: 0,
    lat: 13.7382, lng: 100.5161,
  },
  {
    id: 2,
    name: "โบ๊เบ๊",
    subtitle: "ตลาดค้าส่งชื่อดัง",
    image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=900&h=400&fit=crop&auto=format",
    teaser: "ตลาดค้าส่งเสื้อผ้าที่ใหญ่ที่สุดแห่งหนึ่งในกรุงเทพฯ",
    story: "โบ๊เบ๊เป็นตลาดค้าส่งขนาดใหญ่ที่มีชื่อเสียงด้านเสื้อผ้า สิ่งทอ และของชำร่วย ตั้งอยู่ริมคลองผดุงกรุงเกษม มีพ่อค้าแม่ค้าจากทั่วประเทศมาซื้อสินค้าเป็นประจำ บรรยากาศคึกคักตั้งแต่เช้ามืดจนถึงค่ำ กลิ่นอายของตลาดเก่าผสมกับความวุ่นวายสุดมีชีวิตชีวา",
    question: "โบ๊เบ๊ขึ้นชื่อเรื่องอะไรเป็นพิเศษ?",
    options: ["อาหารสด", "เครื่องจักร", "เสื้อผ้าและสิ่งทอ", "ของโบราณ"],
    correct: 2,
    lat: 13.7510, lng: 100.5108,
  },
  {
    id: 3,
    name: "นางเลิ้ง",
    subtitle: "ย่านดั้งเดิมของไทย",
    image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=900&h=400&fit=crop&auto=format",
    teaser: "ย่านเก่าแก่ที่ยังคงรักษาวิถีชีวิตดั้งเดิมของชาวไทยไว้ได้อย่างดี",
    story: "นางเลิ้งเป็นย่านชุมชนหนาแน่น ชาวบ้านส่วนใหญ่เป็นลูกหลานของชาวไทยที่อพยพมาตั้งถิ่นฐานตั้งแต่สมัยต้นรัตนโกสินทร์ ชุมชนยังคงรักษาประเพณีและวิถีชีวิตดั้งเดิมไว้เป็นอย่างดี มีร้านก๋วยเตี๋ยวเก่าแก่และตลาดสดที่เปิดมาหลายสิบปี",
    question: "นางเลิ้งมีลักษณะเด่นอย่างไร?",
    options: ["ตลาดสดขนาดใหญ่", "วัดโบราณ", "ชุมชนดั้งเดิมรัตนโกสินทร์", "ย่านธุรกิจ"],
    correct: 2,
    lat: 13.7600, lng: 100.5082,
  },
  {
    id: 4,
    name: "สถานที่ราชการ",
    subtitle: "ศูนย์กลางราชการฝั่งคลอง",
    image: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=900&h=400&fit=crop&auto=format",
    teaser: "กลุ่มอาคารราชการที่สะท้อนสถาปัตยกรรมแห่งยุคสมัย",
    story: "ริมฝั่งคลองผดุงกรุงเกษมมีอาคารราชการสำคัญหลายแห่ง สะท้อนความสำคัญของคลองสายนี้ในยุคที่การเดินทางทางน้ำเป็นหัวใจหลัก สถาปัตยกรรมผสมผสานระหว่างแบบตะวันตกและไทยประยุกต์ ให้ภาพรวมที่สง่างามตลอดสองฝั่งคลอง",
    question: "อาคารราชการริมคลองนี้สะท้อนสิ่งใด?",
    options: ["ความสำคัญของคลองในอดีต", "การพัฒนาอุตสาหกรรม", "ประวัติศาสตร์ทหาร", "ศิลปะสมัยใหม่"],
    correct: 0,
    lat: 13.7648, lng: 100.5030,
  },
  {
    id: 5,
    name: "เทเวศร์",
    subtitle: "ตลาดดอกไม้และวิวริมน้ำ",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=400&fit=crop&auto=format",
    teaser: "ย่านที่มีชื่อเสียงด้านตลาดดอกไม้และบรรยากาศริมน้ำที่งดงาม",
    story: "เทเวศร์ขึ้นชื่อเรื่องตลาดดอกไม้ริมน้ำที่มีสีสันสวยงาม ทุกเช้าพ่อค้าแม่ค้านำดอกไม้นานาชนิดมาวางขายริมคลอง บรรยากาศยามเช้าเต็มไปด้วยกลิ่นหอมและสีสันของดอกไม้นับร้อยชนิด ถือเป็นหนึ่งในมุมที่งดงามที่สุดของคลองผดุงกรุงเกษม",
    question: "เทเวศร์ขึ้นชื่อเรื่องอะไรเป็นพิเศษ?",
    options: ["ร้านกาแฟ", "อาหารทะเล", "ตลาดดอกไม้", "ของเก่า"],
    correct: 2,
    lat: 13.7718, lng: 100.5010,
  },
];

export type PlaceCategory = "food" | "cafe" | "shop" | "temple";

export interface PlaceData {
  id: number;
  name: string;
  nameEn: string;
  category: PlaceCategory;
  emoji: string;
  description: string;
  lat: number;
  lng: number;
  nearCheckpoint: number;
}

export const places: PlaceData[] = [
  {
    id: 1, name: "ร้านก๋วยเตี๋ยวเรือนาย", nameEn: "Canal Boat Noodle", category: "food", emoji: "🍜",
    description: "ก๋วยเตี๋ยวเรือต้นตำรับริมคลอง เปิดมากว่า 40 ปี หอมกลิ่นเครื่องเทศแท้",
    lat: 13.7375, lng: 100.5095, nearCheckpoint: 0,
  },
  {
    id: 2, name: "กาแฟโบ๊เบ๊", nameEn: "Bobae Coffee", category: "cafe", emoji: "☕",
    description: "ร้านกาแฟโบราณคั่วสดในซอยตลาดน้อย ชงด้วยถุงผ้าตามแบบดั้งเดิม",
    lat: 13.7368, lng: 100.5108, nearCheckpoint: 0,
  },
  {
    id: 3, name: "ข้าวต้มหัวลำโพง", nameEn: "Hua Lamphong Congee", category: "food", emoji: "🥣",
    description: "ข้าวต้มปลาเปิดตี 4 บริการนักเดินทางมาหลายชั่วอายุคน ข้างสถานีรถไฟ",
    lat: 13.7388, lng: 100.5155, nearCheckpoint: 1,
  },
  {
    id: 4, name: "วัดไตรมิตร", nameEn: "Wat Traimit", category: "temple", emoji: "🛕",
    description: "วัดที่ประดิษฐานพระพุทธมหาสุวรรณปฏิมากร หรือพระพุทธรูปทองคำบริสุทธิ์",
    lat: 13.7395, lng: 100.5128, nearCheckpoint: 1,
  },
  {
    id: 5, name: "ของชำร่วยโบ๊เบ๊", nameEn: "Bobae Souvenirs", category: "shop", emoji: "🛍️",
    description: "ร้านขายของที่ระลึกและผ้าไทยราคาถูกในตลาดโบ๊เบ๊ ลองต่อราคาได้",
    lat: 13.7505, lng: 100.5112, nearCheckpoint: 2,
  },
  {
    id: 6, name: "ส้มตำนางเลิ้ง", nameEn: "Nang Loeng Som Tam", category: "food", emoji: "🥗",
    description: "ส้มตำตำสดทุกจาน รสแซบต้นตำรับอีสาน อยู่ในตลาดนางเลิ้งเก่า",
    lat: 13.7595, lng: 100.5078, nearCheckpoint: 3,
  },
  {
    id: 7, name: "ขนมไทยนางเลิ้ง", nameEn: "Nang Loeng Thai Sweets", category: "food", emoji: "🍡",
    description: "ขนมไทยโบราณทำสดทุกวัน ทองหยิบ ฝอยทอง จ่ามงกุฎ รสชาติต้นตำรับ",
    lat: 13.7608, lng: 100.5086, nearCheckpoint: 3,
  },
  {
    id: 8, name: "คาเฟ่ริมคลอง", nameEn: "Canal Side Café", category: "cafe", emoji: "☕",
    description: "คาเฟ่วิวคลองผดุงฯ นั่งจิบกาแฟชมบรรยากาศเรือแล่นผ่านยามบ่าย",
    lat: 13.7645, lng: 100.5035, nearCheckpoint: 4,
  },
  {
    id: 9, name: "ร้านหนังสือเก่า", nameEn: "Old Bookshop", category: "shop", emoji: "📚",
    description: "ร้านหนังสือมือสองเก่าแก่ มีหนังสือหายากและโปสการ์ดวินเทจกรุงเทพฯ",
    lat: 13.7655, lng: 100.5025, nearCheckpoint: 4,
  },
  {
    id: 10, name: "ตลาดดอกไม้เทเวศร์", nameEn: "Thewet Flower Market", category: "shop", emoji: "💐",
    description: "ตลาดดอกไม้ริมแม่น้ำที่ใหญ่ที่สุดในกรุงเทพฯ เปิดตั้งแต่ตี 4 ถึงเย็น",
    lat: 13.7720, lng: 100.5005, nearCheckpoint: 5,
  },
  {
    id: 11, name: "ข้าวแกงเทเวศร์", nameEn: "Thewet Rice & Curry", category: "food", emoji: "🍛",
    description: "ข้าวแกงรสเด็ดกับแกงมากกว่า 20 อย่างต่อวัน ราคาถูก เปิดเช้าถึงบ่าย",
    lat: 13.7712, lng: 100.5015, nearCheckpoint: 5,
  },
];

export interface LotteryChallenge {
  id: number;
  name: string;
  methods: Mode[];
  task: string;
  requiredPhotos: number;
}

export const lotteryData: LotteryChallenge[] = [
  { id: 1, name: "จอนหมาจร", methods: ["walk", "bike"], task: "ถ่ายรูปหมาจรจัด 3 ตัวที่ไม่ซ้ำกัน", requiredPhotos: 3 },
  { id: 2, name: "แชะ ship", methods: ["walk", "bike", "boat"], task: "ถ่ายรูปเรือ 3 ลำที่ไม่ซ้ำกัน", requiredPhotos: 3 },
  { id: 3, name: "สะพานเทวดาสร้าง", methods: ["walk", "bike", "boat"], task: "ถ่ายรูปสะพาน 5 สะพาน", requiredPhotos: 5 },
  { id: 4, name: "colour hunting", methods: ["walk", "bike"], task: "ถ่ายรูปสิ่งของตามสีสุ่ม 6 รูป", requiredPhotos: 6 },
  { id: 5, name: "คลองตัดคลอง", methods: ["walk", "bike", "boat"], task: "ถ่ายรูปทางแยกคลอง 3 จุด", requiredPhotos: 3 },
  { id: 6, name: "กินเอาภาพ", methods: ["walk", "bike", "boat"], task: "ถ่ายรูปอาหารก่อนกิน 3 ร้าน", requiredPhotos: 3 },
  { id: 7, name: "กินเอาอิ่ม", methods: ["walk", "bike", "boat"], task: "ถ่ายรูปอาหารหลังกิน 3 ร้าน", requiredPhotos: 3 },
  { id: 8, name: "พิราบ(คาบ)", methods: ["walk"], task: "ถ่ายรูปนกพิราบกำลังคาบสิ่งของ", requiredPhotos: 1 },
  { id: 9, name: "มองแมว", methods: ["walk", "bike"], task: "ถ่ายรูปแมว 3 ตัวที่ไม่ซ้ำกัน", requiredPhotos: 3 },
  { id: 10, name: "ป้ายยา", methods: ["walk", "bike"], task: "ถ่ายรูปป้ายร้านขายยาเก่าแก่ 6 ภาพ", requiredPhotos: 6 },
];

export const checkpointNavItems = [
  { href: "/plan", label: "แผนที่" },
  { href: "/explore", label: "เส้นทาง" },
  { href: "/lottery", label: "ล็อตเตอรี่" },
  { href: "/stamps", label: "สะสม" },
];
