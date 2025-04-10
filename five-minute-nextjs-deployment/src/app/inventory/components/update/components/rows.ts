import InventoryItem from "./InventoryItem";
const rows: InventoryItem[] = [
  new InventoryItem("주재료", "쌀", "포대"),
  new InventoryItem("주재료", "계란", "판"),
  new InventoryItem("주재료", "슬라이스김치", "박스"),
  new InventoryItem("주재료", "맛김치", "박스"),
  new InventoryItem("주재료", "목전지", "바트"),
  new InventoryItem("주재료", "삼겹살", "바트"),
  new InventoryItem("주재료", "우삼겹", "바트"),
  new InventoryItem("주재료", "찌개고기", "바트"),
  new InventoryItem("주재료", "닭다리살", "바트"),
  new InventoryItem("야채", "양파", "망"),
  new InventoryItem("야채", "상추", "박스"),
  new InventoryItem("야채", "두부", "팩"),
  new InventoryItem("야채", "숙주", "박스"),
  new InventoryItem("야채", "김가루", "봉지"),
  new InventoryItem("야채", "단무지", "팩"),
  new InventoryItem("야채", "생와사비", "팩"),
  new InventoryItem("야채", "청양고추", "봉지"),//250104
  new InventoryItem("소스", "데리야끼소스", "팩"),
  new InventoryItem("소스", "핫소스", "팩"),
  new InventoryItem("소스", "바베큐소스", "팩"),
  new InventoryItem("소스", "마요네즈", "팩"),
  new InventoryItem("조미료", "소금", "봉지"),
  new InventoryItem("조미료", "설탕", "봉지"),
  new InventoryItem("조미료", "후추", "봉지"),
  new InventoryItem("조미료", "고춧가루", "봉지"),
  new InventoryItem("조미료", "고추장", "통"),
  new InventoryItem("조미료", "쌈장", "통"),
  new InventoryItem("조미료", "물엿", "통"),
  new InventoryItem("조미료", "간장", "통"),
  new InventoryItem("조미료", "참기름", "통"),
  new InventoryItem("조미료", "미림", "통"),
  new InventoryItem("조미료", "블록카레", "박스"),
  new InventoryItem("조미료", "가루카레", "봉지"),
  new InventoryItem("조미료", "미원", "봉지"),
  new InventoryItem("조미료", "소고기다시다", "봉지"),
  new InventoryItem("조미료", "후리가케", "봉지"),
  new InventoryItem("조미료", "마늘후레이크", "통"),
  new InventoryItem("조미료", "만두간장", "봉지"),
  new InventoryItem("조미료", "파슬리", "봉지"),
  new InventoryItem("냉동식품", "치킨가라아게", "봉지"),
  new InventoryItem("냉동식품", "새우튀김", "봉지"),
  new InventoryItem("냉동식품", "돈까스", "봉지"),
  new InventoryItem("냉동식품", "김치만두", "봉지"),
  new InventoryItem("냉동식품", "고기만두", "봉지"),
  new InventoryItem("냉동식품", "갈비만두", "봉지"),
  new InventoryItem("냉동식품", "물만두", "봉지"),
  new InventoryItem("냉동식품", "해쉬브라운", "봉지"),
  new InventoryItem("냉동식품", "소세지", "봉지"),
  new InventoryItem("냉동식품", "버팔로윙", "봉지"),
  new InventoryItem("기타식재료", "우동액다시", "통"),
  new InventoryItem("기타식재료", "스팸", "통"),
  new InventoryItem("기타식재료", "참치", "통"),
  new InventoryItem("기타식재료", "식용유", "통"),
  new InventoryItem("음료", "콜라 245ml", "판"),
  new InventoryItem("음료", "사이다 245ml", "판"),
  new InventoryItem("음료", "제로콜라 335ml", "판"),
  new InventoryItem("음료", "제로사이다 335ml", "판"),
  new InventoryItem("음료", "콜라 500ml", "판"),
  new InventoryItem("음료", "사이다 500ml", "판"),
  new InventoryItem("음료", "물 500ml", "판"),
  new InventoryItem("음료", "트레비 190ml", "판"),
  new InventoryItem("에이드소스", "망고에이드", "통"),
  new InventoryItem("에이드소스", "레몬에이드", "통"),
  new InventoryItem("에이드소스", "청포도에이드", "통"),
  new InventoryItem("에이드소스", "자몽에이드", "통"),
  new InventoryItem("포장용기", "밥용기", "줄"),
  new InventoryItem("포장용기", "장국용기", "줄"),
  new InventoryItem("포장용기", "계란장용기", "줄"),
  new InventoryItem("포장용기", "카레용기", "줄"),
  new InventoryItem("포장용기", "찌개용기", "줄"),
  new InventoryItem("포장용기", "쌈장용기", "줄"), //250104
  new InventoryItem("포장용기", "종이봉투", "묶음"),
  new InventoryItem("포장용기", "숟가락", "박스"),
  new InventoryItem("포장용기", "젓가락", "박스"),
  new InventoryItem("포장용기", "랩", "개"),
  new InventoryItem("포장용기", "에이드 용기", "묶음"),
  new InventoryItem("포장용기", "빨대", "묶음"),
  new InventoryItem("포장용기", "에이드 비닐", "묶음"),
  new InventoryItem("포장용기", "비닐봉투(소)", "묶음"),
  new InventoryItem("포장용기", "비닐봉투(중)", "묶음"),
  new InventoryItem("포장용기", "비닐봉투(대)", "묶음"),
  new InventoryItem("포장용기", "비닐봉투(특대)", "묶음"),
  new InventoryItem("기타", "키친타올", "개"),
  new InventoryItem("기타", "핸드워시", "개"),
  new InventoryItem("기타", "주방세재", "통"),
  new InventoryItem("기타", "영수증용지", "박스"),
  new InventoryItem("직원간식", "커피", "개"),
  new InventoryItem("직원간식", "깔라만씨", "개"),
];

export default rows;