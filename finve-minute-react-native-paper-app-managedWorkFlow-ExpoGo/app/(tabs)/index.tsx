import { Image, View, ScrollView } from "react-native";
import { Text, Divider, Icon } from "react-native-paper";

const donburiItems = [
  "[모두의 제육] 직화제육덮밥 도시락",
  "[무설탕] 제로 직화삼겹쌈장 덮밥 도시락",
  "우삼겹 데리덮밥 도시락",
  "[1위 메뉴 한솥단지] 치킨 에그마요 덮밥",
  "직화바베큐덮밥",
  "닭갈비덮밥",
  "닭다리살 바베큐덮밥",
  "스팸김치덮밥",
  "참치 에그마요 덮밥",
  "스팸 에그마요 덮밥",
  "참치김치 덮밥",
  "BIG돈까스 마요 덮밥",
];

const soupItems = ["돼지고기 김치찌개", "스팸 김치찌개"];

const friedRiceItems = [
  "스팸 김치볶음밥",
  "참치마요 김치볶음밥",
  "우삼겹 김치볶음밥",
  "오믈렛 김치볶음밥",
  "소세지 김치볶음밥",
];

const curryItems = [
  "가라아게 카레",
  "스팸 카레",
  "우삼겹 카레",
  "BIG돈까스 카레",
  "새우튀김 카레",
];

const sideItems = [
  "새우튀김 1ea",
  "가라아게(5조각)",
  "버팔로윙 4ea",
  "해쉬 브라운 2ea",
  "스팸구이 4조각",
  "소세지 4ea",
  "물만두 10ea",
  "수제 간장 계란장 1ea",
  "미니 카레",
  "김치포자만두 6ea",
  "고기포자만두 6ea",
  "갈비만두 6ea",
];

const drinkItems = [
  "망고 에이드",
  "청포도 에이드",
  "자몽 에이드",
  "레몬 에이드",
  "콜라 245ml(1개)",
  "사이다 245ml(1개)",
  "제로 콜라 355ml",
  "제로 사이다 355ml",
  "콜라 500ml",
  "사이다 500ml",
  "물",
];

const menuCategories = [
  { title: "덮밥 메뉴", items: donburiItems, icon: "bowl" }, 
  { title: "찌개 메뉴", items: soupItems, icon: "pot" }, 
  { title: "볶음밥 메뉴", items: friedRiceItems, icon: "rice" }, 
  { title: "카레 메뉴", items: curryItems, icon: "bowl-mix" }, 
  { title: "사이드 메뉴", items: sideItems, icon: "food-drumstick" }, 
  { title: "음료 메뉴", items: drinkItems, icon: "cup-water" }, 
];

export default function HomeScreen() {
  return (
    <ScrollView>
      {/* 메인 이미지 */}
      <View style={{ height: 250 }}>
        <Image
          source={require("@/assets/images/Main-Page.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      {/* 소개 섹션 */}
      <View style={{ padding: 32 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
          맛있는 5분 덮밥!
        </Text>
        <Text variant="bodyMedium" style={{ lineHeight: 22 }}>
          5분 덮밥은 바쁜 현대인을 위한 빠르고 맛있는 한 끼를 제공합니다. 신선한
          재료로 정성스럽게 만든 다양한 덮밥을 합리적인 가격에 즐길 수 있습니다.
          주문 후 단 5분 만에 따끈한 덮밥이 준비되며, 가성비와 맛을 모두 잡은
          인기 브랜드입니다.
        </Text>
      </View>

      {menuCategories.map((category, index) => (
        <Menus key={index} title={category.title} items={category.items} icon={category.icon} />
      ))}
    </ScrollView>
  );
}

function Menus({ icon, title, items }: {icon: string, title: string; items: string[] }) {
  return (
    <View>
      <Divider style={{ marginHorizontal: 32 }} />
      <View style={{ paddingVertical: 20, paddingHorizontal: 32 }}>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 }}>
        <Icon source={icon} size={24} />
        <Text variant="headlineSmall">{title}</Text>
      </View>

        {/* <Icon source={icon} size={24} />
        <Text variant="headlineSmall" style={{ marginBottom: 10 }}>
          {title}
        </Text> */}
        {items.map((item, index) => (
          <Text key={index} variant="bodyLarge" style={{ marginBottom: 5 }}>
            • {item}
          </Text>
        ))}
      </View>
    </View>
  );
}
