import { usePhoneOrderMenus } from "@/features/cost-calculator/hooks/usePhoneOrderMenus";
import { CalculatorRow, PhoneOrderMenu } from "@/features/cost-calculator/types";
import { AuthContext } from "@/store/context/AuthContext";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  DataTable,
  Dialog,
  HelperText,
  IconButton,
  List,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

const DEFAULT_CUSTOM_PRICE = 10000;
const DEFAULT_CUSTOM_MENU_NAME = "기타";
const DEFAULT_CUSTOM_QUANTITY = 1;

interface CustomItemInput {
  menuName: string;
  price: number;
  quantity: number;
}

function createRowId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ko-KR");
}

function getCategories(menus: PhoneOrderMenu[]) {
  const seenCategories = new Set<string>();
  const categories: string[] = [];

  menus.forEach((menu) => {
    if (!seenCategories.has(menu.category)) {
      seenCategories.add(menu.category);
      categories.push(menu.category);
    }
  });

  return categories;
}

function CustomItemDialog({
  visible,
  onDismiss,
  onSubmit,
}: {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (input: CustomItemInput) => void;
}) {
  const [menuName, setMenuName] = useState(DEFAULT_CUSTOM_MENU_NAME);
  const [priceText, setPriceText] = useState(String(DEFAULT_CUSTOM_PRICE));
  const [quantityText, setQuantityText] = useState(String(DEFAULT_CUSTOM_QUANTITY));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setMenuName(DEFAULT_CUSTOM_MENU_NAME);
    setPriceText(String(DEFAULT_CUSTOM_PRICE));
    setQuantityText(String(DEFAULT_CUSTOM_QUANTITY));
    setError(null);
  }, [visible]);

  function handleSubmit() {
    const normalizedName = menuName.trim() || DEFAULT_CUSTOM_MENU_NAME;
    const parsedPrice = priceText ? Number.parseInt(priceText, 10) : Number.NaN;
    const parsedQuantity = quantityText ? Number.parseInt(quantityText, 10) : Number.NaN;

    if (!Number.isInteger(parsedPrice) || parsedPrice <= 0) {
      setError("기타 항목 가격은 1원 이상으로 입력해 주세요.");
      return;
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError("기타 항목 수량은 1개 이상으로 입력해 주세요.");
      return;
    }

    setError(null);
    onSubmit({
      menuName: normalizedName,
      price: parsedPrice,
      quantity: parsedQuantity,
    });
  }

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>기타 항목 추가</Dialog.Title>
      <Dialog.Content>
        <TextInput
          mode="outlined"
          label="메뉴명"
          value={menuName}
          onChangeText={setMenuName}
          autoCorrect={false}
          style={styles.dialogInput}
        />
        <TextInput
          mode="outlined"
          label="가격"
          keyboardType="number-pad"
          value={priceText}
          onChangeText={(text) => setPriceText(text.replace(/[^0-9]/g, ""))}
          right={<TextInput.Affix text="원" />}
          style={styles.dialogInput}
        />
        <TextInput
          mode="outlined"
          label="수량"
          keyboardType="number-pad"
          value={quantityText}
          onChangeText={(text) => setQuantityText(text.replace(/[^0-9]/g, ""))}
          style={styles.dialogInput}
        />
        <HelperText type="error" visible={!!error}>
          {error || " "}
        </HelperText>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>닫기</Button>
        <Button mode="contained" onPress={handleSubmit}>
          추가
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export default function PhoneOrderCalculatorScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const { menus, isLoading, error } = usePhoneOrderMenus();
  const [rows, setRows] = useState<CalculatorRow[]>([]);
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>({});
  const [calculatedTotal, setCalculatedTotal] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryDialogVisible, setIsCategoryDialogVisible] = useState(false);
  const [isMenuDialogVisible, setIsMenuDialogVisible] = useState(false);
  const [isCustomDialogVisible, setIsCustomDialogVisible] = useState(false);

  const categories = getCategories(menus);
  const selectedMenus = selectedCategory
    ? menus.filter((menu) => menu.category === selectedCategory)
    : [];

  function replaceRows(nextRows: CalculatorRow[]) {
    setRows(nextRows);
    setQuantityDrafts((previousDrafts) => {
      const nextRowIds = new Set(nextRows.map((row) => row.id));

      return Object.fromEntries(
        Object.entries(previousDrafts).filter(([rowId]) => nextRowIds.has(rowId)),
      );
    });
    setCalculatedTotal(null);
  }

  function updateRows(updater: (previousRows: CalculatorRow[]) => CalculatorRow[]) {
    setRows((previousRows) => updater(previousRows));
    setCalculatedTotal(null);
  }

  function handleOpenCategoryDialog() {
    setSelectedCategory(null);
    setIsMenuDialogVisible(false);
    setIsCategoryDialogVisible(true);
  }

  function handleCloseDialogs() {
    setSelectedCategory(null);
    setIsCategoryDialogVisible(false);
    setIsMenuDialogVisible(false);
  }

  function handleOpenCustomDialog() {
    handleCloseDialogs();
    setIsCustomDialogVisible(true);
  }

  function handleCloseCustomDialog() {
    setIsCustomDialogVisible(false);
  }

  function handleCategorySelect(category: string) {
    setSelectedCategory(category);
    setIsCategoryDialogVisible(false);
    setIsMenuDialogVisible(true);
  }

  function handleMenuSelect(menu: PhoneOrderMenu) {
    replaceRows([
      ...rows,
      {
        id: createRowId(),
        category: menu.category,
        menuName: menu.name,
        price: menu.price,
        quantity: 1,
        isCustom: false,
      },
    ]);
    handleCloseDialogs();
  }

  function handleAddCustomRow(input: CustomItemInput) {
    replaceRows([
      ...rows,
      {
        id: createRowId(),
        category: "기타",
        menuName: input.menuName,
        price: input.price,
        quantity: input.quantity,
        isCustom: true,
      },
    ]);
    handleCloseCustomDialog();
  }

  function handleQuantityTextChange(rowId: string, rawValue: string) {
    const numericText = rawValue.replace(/[^0-9]/g, "");
    setQuantityDrafts((previousDrafts) => ({
      ...previousDrafts,
      [rowId]: numericText,
    }));

    if (!numericText) {
      setCalculatedTotal(null);
      return;
    }

    const nextQuantity = Math.max(1, Number.parseInt(numericText, 10));

    updateRows((previousRows) =>
      previousRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              quantity: nextQuantity,
            }
          : row,
      ),
    );
  }

  function handleQuantityInputBlur(rowId: string) {
    const quantityDraft = quantityDrafts[rowId];

    if (quantityDraft === undefined) {
      return;
    }

    const nextQuantity = quantityDraft ? Math.max(1, Number.parseInt(quantityDraft, 10)) : 1;

    updateRows((previousRows) =>
      previousRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              quantity: nextQuantity,
            }
          : row,
      ),
    );

    setQuantityDrafts((previousDrafts) => {
      const nextDrafts = { ...previousDrafts };
      delete nextDrafts[rowId];
      return nextDrafts;
    });
  }

  function handleRemoveRow(rowId: string) {
    replaceRows(rows.filter((row) => row.id !== rowId));
  }

  function handleCalculate() {
    const normalizedRows = rows.map((row) => {
      const quantityDraft = quantityDrafts[row.id];

      if (quantityDraft === undefined) {
        return row;
      }

      return {
        ...row,
        quantity: quantityDraft ? Math.max(1, Number.parseInt(quantityDraft, 10)) : 1,
      };
    });

    setRows(normalizedRows);
    setQuantityDrafts({});

    for (const row of normalizedRows) {
      if (!Number.isInteger(row.quantity) || row.quantity < 1) {
        Alert.alert("수량 확인", `${row.menuName} 수량은 1개 이상이어야 합니다.`);
        return;
      }

      if (row.isCustom && (!Number.isInteger(row.price) || row.price <= 0)) {
        Alert.alert("가격 확인", "기타 항목 가격은 1원 이상으로 입력해 주세요.");
        return;
      }
    }

    setCalculatedTotal(normalizedRows.reduce((sum, row) => sum + row.price * row.quantity, 0));
  }

  function handleReset() {
    replaceRows([]);
    setSelectedCategory(null);
    setIsCategoryDialogVisible(false);
    setIsMenuDialogVisible(false);
    setIsCustomDialogVisible(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="headlineSmall">전화주문 가격계산기</Text>
          <Text variant="bodyMedium" style={styles.description}>
            카테고리와 메뉴를 선택해 주문 항목을 추가하고, 수량을 조정한 뒤 총 금액을 빠르게
            계산합니다.
          </Text>
          {auth.user?.isAdmin ? (
            <Button
              mode="outlined"
              icon="cog-outline"
              onPress={() => router.push("/cost-calculator/manage")}
              style={styles.adminButton}
            >
              관리자 메뉴 관리
            </Button>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.actionRow}>
        <Button mode="contained" icon="plus" onPress={handleOpenCategoryDialog}>
          항목 추가
        </Button>
        <Button mode="contained-tonal" icon="pencil-plus-outline" onPress={handleOpenCustomDialog}>
          기타 항목 추가
        </Button>
        <Button mode="contained-tonal" icon="calculator" onPress={handleCalculate}>
          계산
        </Button>
        <Button mode="outlined" icon="refresh" onPress={handleReset}>
          초기화
        </Button>
      </View>

      <HelperText type="error" visible={!!error}>
        {error || " "}
      </HelperText>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">주문 항목</Text>
          {isLoading ? <ActivityIndicator style={styles.loading} /> : null}
          {rows.length === 0 ? (
            <Text variant="bodyMedium" style={styles.emptyText}>
              선택된 주문 항목이 없습니다.
            </Text>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title textStyle={styles.headerText} style={styles.menuCell}>
                  메뉴
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText} style={styles.priceCell}>
                  가격
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText} style={styles.quantityCell}>
                  수량
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText} style={styles.iconCell}>
                  삭제
                </DataTable.Title>
              </DataTable.Header>

              {rows.map((row) => (
                <DataTable.Row key={row.id}>
                  <DataTable.Cell style={styles.menuCell}>
                    <Text variant="bodySmall" numberOfLines={1} style={styles.cellText}>
                      {row.menuName}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell style={styles.priceCell}>
                    <Text variant="bodySmall" numberOfLines={1} style={styles.cellText}>
                      {formatCurrency(row.price)}원
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell style={styles.quantityCell}>
                    <TextInput
                      mode="outlined"
                      dense
                      keyboardType="number-pad"
                      value={quantityDrafts[row.id] ?? String(row.quantity)}
                      onChangeText={(text) => handleQuantityTextChange(row.id, text)}
                      onBlur={() => handleQuantityInputBlur(row.id)}
                      style={styles.expandedQuantityInput}
                    />
                  </DataTable.Cell>

                  <DataTable.Cell style={styles.iconCell}>
                    <IconButton
                      icon="delete-outline"
                      size={16}
                      onPress={() => handleRemoveRow(row.id)}
                      style={styles.iconButton}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          )}
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">계산 결과</Text>
          {calculatedTotal === null ? (
            <Text variant="bodyMedium" style={styles.resultGuide}>
              주문 항목을 고른 뒤 [계산] 버튼을 눌러 총 금액을 확인하세요.
            </Text>
          ) : (
            <Text variant="headlineMedium" style={styles.totalText}>
              총 금액: {formatCurrency(calculatedTotal)}원
            </Text>
          )}
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={isCategoryDialogVisible} onDismiss={handleCloseDialogs}>
          <Dialog.Title>카테고리 선택</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <ScrollView>
              {isLoading ? <ActivityIndicator style={styles.loading} /> : null}
              {!isLoading && categories.length === 0 ? (
                <Text variant="bodyMedium" style={styles.dialogEmptyText}>
                  등록된 메뉴가 없습니다. 기타 항목을 사용할 수 있습니다.
                </Text>
              ) : null}
              {categories.map((category) => (
                <List.Item
                  key={category}
                  title={category}
                  left={(props) => <List.Icon {...props} icon="format-list-bulleted-square" />}
                  onPress={() => handleCategorySelect(category)}
                />
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={handleCloseDialogs}>닫기</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={isMenuDialogVisible} onDismiss={handleCloseDialogs}>
          <Dialog.Title>{selectedCategory || "메뉴"} 선택</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <ScrollView>
              {selectedMenus.map((menu) => (
                <List.Item
                  key={menu.id}
                  title={menu.name}
                  description={`${formatCurrency(menu.price)}원`}
                  left={(props) => <List.Icon {...props} icon="food" />}
                  onPress={() => handleMenuSelect(menu)}
                />
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setIsMenuDialogVisible(false)}>닫기</Button>
          </Dialog.Actions>
        </Dialog>

        <CustomItemDialog
          visible={isCustomDialogVisible}
          onDismiss={handleCloseCustomDialog}
          onSubmit={handleAddCustomRow}
        />
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  description: {
    marginTop: 8,
  },
  adminButton: {
    marginTop: 16,
    alignSelf: "flex-start",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  loading: {
    marginTop: 12,
  },
  emptyText: {
    marginTop: 16,
  },
  headerText: {
    fontSize: 12,
  },
  cellText: {
    fontSize: 12,
  },
  menuCell: {
    flex: 1.25,
    justifyContent: "flex-start",
  },
  priceCell: {
    flex: 1.15,
    justifyContent: "center",
  },
  quantityCell: {
    flex: 0.8,
    justifyContent: "center",
  },
  iconCell: {
    flex: 0.5,
    justifyContent: "center",
  },
  expandedQuantityInput: {
    width: "100%",
    minWidth: 56,
    height: 38,
  },
  iconButton: {
    margin: 0,
  },
  totalText: {
    marginTop: 12,
    fontWeight: "700",
  },
  resultGuide: {
    marginTop: 12,
  },
  dialogScrollArea: {
    maxHeight: 320,
  },
  dialogInput: {
    marginTop: 12,
  },
  dialogEmptyText: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
