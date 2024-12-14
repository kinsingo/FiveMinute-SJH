// InventoryItem 클래스 정의
export default class InventoryItem {
    category: string;
    item: string;
    unit: string;
    stock: string;
    requiredOrder: string;
    constructor(
      category: string,
      item: string,
      unit: string,
      stock: string = "",
      requiredOrder: string = "",
    ) {
      this.category = category;
      this.item = item;
      this.unit = unit;
      this.stock = stock;
      this.requiredOrder = requiredOrder;
    }
  }
  

  