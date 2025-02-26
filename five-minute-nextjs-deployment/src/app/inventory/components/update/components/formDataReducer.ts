import InventoryItem from "./InventoryItem";
type Action =
  | {
      type: "UPDATE_FIELD";
      payload: {
        index: number;
        field: keyof InventoryItem;
        value: string | number;
      };
    }
  | {
      type: "LOAD_DATA";
      payload: InventoryItem[];
    };

export default function formDataReducer(state: InventoryItem[], action: Action) {
  switch (action.type) {
    case "UPDATE_FIELD": {
      const { index, field, value } = action.payload;
      return state.map(
        (item, i) =>
          i === index ? { ...item, [field]: value, isEdited: true } : item // 해당 row를 수정 상태로 설정
      );
    }
    case "LOAD_DATA": {
      return action.payload.map((item) => ({
        ...item,
        isEdited: false, // 초기화 시 모든 row를 수정되지 않은 상태로 설정
      }));
    }
    default:
      return state;
  }
}