import { nanoid } from "nanoid";
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type NotificationContextType = ReturnType<typeof useNotificationManager>;

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = (props: PropsWithChildren) => {
  const values = useNotificationManager();

  return (
    <NotificationContext.Provider value={values}>
      {props.children}
    </NotificationContext.Provider>
  );
};

function useNotificationManager() {
  const [notifications, setNotifications] = useState<
    { id: string; timestamp: { start: number }; request: string }[]
  >([]);
  const [stdErrNotifications, setStdErrNotifications] = useState<
    { id: string; timestamp: { start: number }; request: string }[]
  >([]);

  const addNotification = useCallback((notification: unknown) => {
    setNotifications((prev) => [
      ...prev,
      {
        id: nanoid(),
        timestamp: { start: Date.now() },
        request: JSON.stringify(notification),
      },
    ]);
  }, []);

  const addStdErrNotification = useCallback((notification: unknown) => {
    setStdErrNotifications((prev) => [
      ...prev,
      {
        id: nanoid(),
        timestamp: { start: Date.now() },
        request: JSON.stringify(notification),
      },
    ]);
  }, []);

  function clearNotifications() {
    setNotifications([]);
  }

  function clearStdErrNotifications() {
    setStdErrNotifications([]);
  }

  return {
    notifications,
    stdErrNotifications,
    addNotification,
    addStdErrNotification,
    clearNotifications,
    clearStdErrNotifications,
  };
}

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context)
    throw new Error("Missing NotificationContext.Provider in the tree!");

  return context;
};
