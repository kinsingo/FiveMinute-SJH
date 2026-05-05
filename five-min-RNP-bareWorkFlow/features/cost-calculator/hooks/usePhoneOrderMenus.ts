import {
  ensurePhoneOrderMenusSeeded,
  subscribeToPhoneOrderMenus,
} from "@/features/cost-calculator/services/phone-order-menu-firestore";
import { PhoneOrderMenu } from "@/features/cost-calculator/types";
import { useEffect, useState } from "react";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "메뉴 데이터를 불러오지 못했습니다.";
}

export function usePhoneOrderMenus() {
  const [menus, setMenus] = useState<PhoneOrderMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    async function startSubscription() {
      try {
        setIsLoading(true);
        setError(null);
        await ensurePhoneOrderMenusSeeded();

        if (!isMounted) {
          return;
        }

        unsubscribe = subscribeToPhoneOrderMenus({
          onNext: (nextMenus) => {
            if (!isMounted) {
              return;
            }

            setMenus(nextMenus);
            setIsLoading(false);
          },
          onError: (subscriptionError) => {
            if (!isMounted) {
              return;
            }

            setError(getErrorMessage(subscriptionError));
            setIsLoading(false);
          },
        });
      } catch (seedError) {
        if (!isMounted) {
          return;
        }

        setError(getErrorMessage(seedError));
        setIsLoading(false);
      }
    }

    void startSubscription();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  return {
    menus,
    isLoading,
    error,
  };
}
