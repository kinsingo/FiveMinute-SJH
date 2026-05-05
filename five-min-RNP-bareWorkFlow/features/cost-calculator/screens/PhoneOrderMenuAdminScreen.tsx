import { usePhoneOrderMenus } from "@/features/cost-calculator/hooks/usePhoneOrderMenus";
import {
  addPhoneOrderMenu,
  deletePhoneOrderMenu,
  updatePhoneOrderMenu,
} from "@/features/cost-calculator/services/phone-order-menu-firestore";
import { PhoneOrderMenu } from "@/features/cost-calculator/types";
import { AuthContext } from "@/store/context/AuthContext";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  DataTable,
  HelperText,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

function formatCurrency(value: number) {
  return value.toLocaleString("ko-KR");
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "메뉴를 처리하지 못했습니다.";
}

const DUPLICATE_MENU_MESSAGE = "이미 동일한 메뉴가 있습니다. 등록된 메뉴 목록을 확인해주세요.";

export default function PhoneOrderMenuAdminScreen() {
  const theme = useTheme();
  const router = useRouter();
  const auth = useContext(AuthContext);
  const { menus, isLoading, error } = usePhoneOrderMenus();
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [priceText, setPriceText] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDeleteMenuId, setPendingDeleteMenuId] = useState<string | null>(null);

  if (!auth.user?.isAdmin) {
    return (
      <View style={styles.blockedContainer}>
        <Card style={styles.blockedCard}>
          <Card.Content>
            <Text variant="headlineSmall">관리자 전용 화면</Text>
            <Text variant="bodyMedium" style={styles.blockedDescription}>
              전화주문 메뉴 관리 페이지는 관리자만 접근할 수 있습니다.
            </Text>
            <Button mode="contained" onPress={() => router.replace("/cost-calculator")}>
              계산기 화면으로 이동
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  function resetForm() {
    setEditingMenuId(null);
    setCategory("");
    setName("");
    setPriceText("");
    setSubmitError(null);
  }

  function handleEdit(menu: PhoneOrderMenu) {
    setEditingMenuId(menu.id);
    setCategory(menu.category);
    setName(menu.name);
    setPriceText(String(menu.price));
    setSubmitError(null);
  }

  async function handleSubmit() {
    const normalizedName = name.trim();
    const parsedPrice = priceText ? Number.parseInt(priceText, 10) : Number.NaN;
    const duplicateMenu = normalizedName
      ? menus.find((menu) => menu.id !== editingMenuId && menu.name.trim() === normalizedName)
      : undefined;

    if (duplicateMenu) {
      setSubmitError(DUPLICATE_MENU_MESSAGE);
      Alert.alert("중복 메뉴", DUPLICATE_MENU_MESSAGE);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (editingMenuId) {
        await updatePhoneOrderMenu({
          menuId: editingMenuId,
          input: {
            category,
            name,
            price: parsedPrice,
          },
        });
      } else {
        await addPhoneOrderMenu({
          category,
          name,
          price: parsedPrice,
        });
      }

      resetForm();
    } catch (submitActionError) {
      setSubmitError(getErrorMessage(submitActionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(menu: PhoneOrderMenu) {
    try {
      setPendingDeleteMenuId(menu.id);
      await deletePhoneOrderMenu(menu.id);

      if (editingMenuId === menu.id) {
        resetForm();
      }
    } catch (deleteError) {
      Alert.alert("삭제 실패", getErrorMessage(deleteError));
    } finally {
      setPendingDeleteMenuId(null);
    }
  }

  function confirmDelete(menu: PhoneOrderMenu) {
    Alert.alert("메뉴 삭제", `${menu.category} / ${menu.name} 메뉴를 삭제하시겠습니까?`, [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          void handleDelete(menu);
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="headlineSmall">전화주문 메뉴 관리</Text>
          <Text variant="bodyMedium" style={styles.description}>
            카테고리, 메뉴명, 가격을 등록하고 수정해 계산기에 노출되는 메뉴를 관리합니다.
          </Text>

          <TextInput
            mode="outlined"
            label="카테고리"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="메뉴명"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="가격"
            keyboardType="number-pad"
            value={priceText}
            onChangeText={(text) => setPriceText(text.replace(/[^0-9]/g, ""))}
            right={<TextInput.Affix text="원" />}
            style={styles.input}
          />

          <HelperText type="error" visible={!!submitError}>
            {submitError || " "}
          </HelperText>

          <View style={styles.formActions}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {editingMenuId ? "수정 저장" : "메뉴 추가"}
            </Button>
            <Button mode="text" onPress={resetForm} disabled={isSubmitting}>
              입력 초기화
            </Button>
          </View>
        </Card.Content>
      </Card>

      <HelperText type="error" visible={!!error}>
        {error || " "}
      </HelperText>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">등록된 메뉴 목록</Text>
          {isLoading ? <ActivityIndicator style={styles.loading} /> : null}
          {!isLoading && menus.length === 0 ? (
            <Text variant="bodyMedium" style={styles.emptyText}>
              등록된 메뉴가 없습니다.
            </Text>
          ) : null}

          {menus.length > 0 ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title textStyle={styles.headerText} style={styles.categoryCell}>
                  카테고리
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText} style={styles.nameCell}>
                  메뉴
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText} style={styles.priceCell}>
                  가격
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText} style={styles.actionCell}>
                  수정
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText} style={styles.actionCell}>
                  삭제
                </DataTable.Title>
              </DataTable.Header>

              {menus.map((menu) => (
                <DataTable.Row key={menu.id}>
                  <DataTable.Cell style={styles.categoryCell}>
                    <Text variant="bodySmall" numberOfLines={1} style={styles.cellText}>
                      {menu.category}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.nameCell}>
                    <Text variant="bodySmall" numberOfLines={1} style={styles.cellText}>
                      {menu.name}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.priceCell}>
                    <Text variant="bodySmall" numberOfLines={1} style={styles.cellText}>
                      {formatCurrency(menu.price)}원
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.actionCell}>
                    <IconButton
                      icon="pencil-outline"
                      size={16}
                      onPress={() => handleEdit(menu)}
                      disabled={isSubmitting || pendingDeleteMenuId === menu.id}
                      style={styles.iconButton}
                    />
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.actionCell}>
                    {pendingDeleteMenuId === menu.id ? (
                      <ActivityIndicator size={16} />
                    ) : (
                      <IconButton
                        icon="delete-outline"
                        size={16}
                        iconColor={theme.colors.error}
                        onPress={() => confirmDelete(menu)}
                        disabled={isSubmitting}
                        style={styles.iconButton}
                      />
                    )}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          ) : null}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  blockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  blockedCard: {
    width: "100%",
    maxWidth: 360,
  },
  blockedDescription: {
    marginTop: 8,
    marginBottom: 16,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    marginTop: 12,
  },
  formActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
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
  categoryCell: {
    flex: 1.05,
    justifyContent: "flex-start",
  },
  nameCell: {
    flex: 1.25,
    justifyContent: "flex-start",
  },
  priceCell: {
    flex: 0.9,
    justifyContent: "center",
  },
  actionCell: {
    flex: 0.45,
    justifyContent: "center",
  },
  iconButton: {
    margin: 0,
  },
});
