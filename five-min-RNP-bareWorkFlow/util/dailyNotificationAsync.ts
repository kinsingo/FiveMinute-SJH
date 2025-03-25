import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Position } from "@/store/context/AuthContext";

// 매일 오후 3시에 재고 관리 알림 예약
// 직원이나 미로그인 상태일 경우 모든 예약된 알림 삭제
// AuthContext에 적용해서, Position정보 바뀔때마다 해당 함수 호출 되도록 함
export const scheduleDailyInventoryNotification = async (position: Position) => {
  if (position === "직원" || position === "") {
    await Notifications.cancelAllScheduledNotificationsAsync(); //모든 예약된 알림 삭제
    console.log("[재고 관리] 알림이 삭제되었습니다");
  } else {
    const Title = "[알림] 재고관리";
    const Body = "4시 전까지 재고 업데이트 진행 바랍니다";
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const isAlreadyScheduled = scheduledNotifications.some((notification) => {
      return notification.content.title === Title && notification.content.body === Body;
    });

    if (!isAlreadyScheduled) {
      console.log("[재고 관리] 알림이 예약되지 않아 새로 등록합니다.");
      await Notifications.scheduleNotificationAsync({
        content: {
          title: Title,
          body: Body,
          data: {
            isInventoryAlarm: true,
            redirectURL: `/inventory`,
          },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: 15,
          minute: 0,
        },
      });
    } else {
      console.log("[재고 관리] 이미 알림이 예약되어 있습니다.");
    }
  }
};
