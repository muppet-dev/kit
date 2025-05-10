import type { ConnectionInfo } from "@/client/providers/connection/manager";
import type { ServerNotification } from "@modelcontextprotocol/sdk/types.js";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import type { StdErrNotification } from "../types";

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
  const [notifications, setNotifications] = useState<ServerNotification[]>([]);
  const [stdErrNotifications, setStdErrNotifications] = useState<
    StdErrNotification[]
  >([]);

  function addNotification(notification: unknown) {
    setNotifications((prev) => [...prev, notification as ServerNotification]);
  }

  function addStdErrNotification(notification: unknown) {
    setStdErrNotifications((prev) => [
      ...prev,
      notification as StdErrNotification,
    ]);
  }

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
