import type { ConnectionInfo } from "@/client/providers/connection/manager";
import type { ServerNotification } from "@modelcontextprotocol/sdk/types.js";
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { StdErrNotification } from "../types";
import { nanoid } from "nanoid";

type NotificationContextType = ReturnType<typeof useNotificationManager>;

const NotificationContext = createContext<NotificationContextType | null>(null);

export type NotificationProvider = {
  connection?: ConnectionInfo;
};

export const NotificationProvider = ({
  children,
  ...props
}: PropsWithChildren<NotificationProvider>) => {
  const values = useNotificationManager(props);

  return (
    <NotificationContext.Provider value={values}>
      {children}
    </NotificationContext.Provider>
  );
};

function useNotificationManager(props: NotificationProvider) {
  const [notifications, setNotifications] = useState<
    (ServerNotification & { id: string; timestamp: { start: number } })[]
  >([]);
  const [stdErrNotifications, setStdErrNotifications] = useState<
    (StdErrNotification & { id: string; timestamp: { start: number } })[]
  >([]);

  const addNotification = useCallback((notification: unknown) => {
    setNotifications((prev) => [
      ...prev,
      {
        ...(notification as ServerNotification),
        id: nanoid(),
        timestamp: { start: Date.now() },
      },
    ]);
  }, []);

  const addStdErrNotification = useCallback((notification: unknown) => {
    setStdErrNotifications((prev) => [
      ...prev,
      {
        ...(notification as StdErrNotification),
        id: nanoid(),
        timestamp: { start: Date.now() },
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
