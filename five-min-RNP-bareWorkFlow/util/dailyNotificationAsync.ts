import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";

const INVENTORY_NOTIFICATION_TITLE = "[알림] 재고관리";
const INVENTORY_NOTIFICATION_BODY = "4시 전까지 재고 업데이트 진행 바랍니다";
const INVENTORY_NOTIFICATION_TYPE = "dailyInventoryReminder";

const isInventoryNotification = (notification: Notifications.NotificationRequest) => {
  const notificationData = notification.content.data as { notificationType?: string } | undefined;

  return (
    notificationData?.notificationType === INVENTORY_NOTIFICATION_TYPE ||
    (notification.content.title === INVENTORY_NOTIFICATION_TITLE &&
      notification.content.body === INVENTORY_NOTIFICATION_BODY)
  );
};

// 앱을 한 번이라도 실행해 권한을 허용한 사용자는 로그인 상태와 무관하게 매일 오후 3시에 알림을 받음
export const scheduleDailyInventoryNotification = async () => {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    console.log("[재고 관리] 알림 권한이 없어 예약을 건너뜁니다.");
    return;
  }

  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const inventoryNotifications = scheduledNotifications.filter(isInventoryNotification);

  if (inventoryNotifications.length === 1) {
    console.log("[재고 관리] 이미 알림이 예약되어 있습니다.");
    return;
  }

  await Promise.all(
    inventoryNotifications.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier),
    ),
  );

  if (inventoryNotifications.length > 1) {
    console.log("[재고 관리] 중복 예약을 정리하고 다시 등록합니다.");
  } else {
    console.log("[재고 관리] 알림이 예약되지 않아 새로 등록합니다.");
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: INVENTORY_NOTIFICATION_TITLE,
      body: INVENTORY_NOTIFICATION_BODY,
      data: {
        notificationType: INVENTORY_NOTIFICATION_TYPE,
        isInventoryAlarm: true,
        redirectURL: "/inventory",
      },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: 15,
      minute: 0,
    },
  });
};
