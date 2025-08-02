"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BellIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import moment from "moment";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NotificationProps } from "@/types";
import { useStore } from "@/store";
import { Spinner } from "@heroui/spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Badge } from "@heroui/badge";
import { Switch } from "@heroui/switch";
import { toast } from "@/components/ui/custom-toast";
import axiosInstance from '@/lib/axios';
import api from "@/lib/api";

export default function UserNotifications({
  notifications,
}: {
  notifications: NotificationProps[] | null | undefined;
}) {
  const t = useTranslations();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user } = useStore((store) => store);
  const local = useLocale();

  const userNotifications = notifications?.filter(
    (notification) =>
      notification.notifiable_id === user?.id ||
      notification.notifiable_id === 0
  );

  // useEffect(() => {
  //     if (userNotifications && userNotifications?.length > 0) {
  //         unreadNotifications.value = userNotifications?.filter(
  //             (item) => item.status === "unread",
  //         ).length;
  //     }
  // }, [userNotifications]);

  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(!!user?.notify_sub);
  const [isToggling, setIsToggling] = useState(false);

  const toggleNotificationSubscription = async () => {
    if (!user) {
      toast.error(t("auth.please_login"));
      return;
    }
    setIsToggling(true);
    try {
      const data= await api.request.post("stores/notify-subscription", {
        subscribe: !isSubscribed,
      });
      setIsSubscribed(data.isSubscribed);
      toast.success(
        data.isSubscribed
          ? t("Subscribed to notifications")
          : t("Unsubscribed from notifications")
      );
    } catch (error) {
      toast.error(t("Failed to update notification preferences"));
    } finally {
      setIsToggling(false);
    }
  };
  // const markAsRead = async (notification: Notification) => {
  //     if (notification.status === "unread") {
  //         setIsMarkingAsRead(true);
  //         try {
  //             await MyAxios.post("notifications/status", {
  //                 notification_id: notification.id,
  //             });
  //             refetch();
  //         } catch (error: any) {
  //             const errorMessage =
  //                 error?.response?.data?.message || t("حدث خطأ ما");
  //             toast.error(errorMessage);
  //         } finally {
  //             setIsMarkingAsRead(false);
  //         }
  //     }
  // };
  return (
    <Popover>
      <Badge
        content={userNotifications?.length}
        isOneChar
        isInvisible={userNotifications && userNotifications?.length <= 0}
        size="lg"
        color="danger"
      >
        <PopoverTrigger>
          <button
            className="p-2 mt-1 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
            aria-label="Notifications"
          >
            <BellIcon
              size={24}
              className={cn(
                "text-gray-600",
                userNotifications &&
                  userNotifications?.length > 0 &&
                  "animate-swing"
              )}
            />
          </button>
        </PopoverTrigger>
      </Badge>
      <PopoverContent>
        <Card
          className="border-0 shadow-none min-w-70"
          dir={local === "ar" ? "rtl" : "ltr"}
        >
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {t("Notifications")}
                {user && (
                  <div className="flex items-center gap-2 ms-4">
                    <Switch
                      isSelected={isSubscribed}
                      onValueChange={toggleNotificationSubscription}
                      isDisabled={isToggling}
                      size="sm"
                      color="primary"
                      className="ml-2"
                    />
                    <span className="text-sm text-gray-500">
                      {isSubscribed ? t("Subscribed") : t("Subscribe")}
                    </span>
                  </div>
                )}
              </div>
            </CardTitle>
            {unreadNotifications > 0 && (
              <CardDescription>
                {t("notifications.unread", {
                  count: unreadNotifications,
                })}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0 max-h-[500px] overflow-y-auto">
            <div className="space-y-4 divide-y divide-gray-100 p-4">
              {userNotifications && userNotifications?.length > 0 ? (
                userNotifications.map((notification) => (
                  <button
                    className="rtl:text-right ltr:text-left gap-4 w-full p-2 rounded-md hover:bg-gray-50"
                    key={notification?.id}
                    // onClick={() => {
                    //     markAsRead(notification);
                    // }}
                  >
                    <div className="space-y-1">
                      <h1 className="text-base font-semibold relative ">
                        {notification?.data}
                        <div
                          className={`absolute rtl:left-0 ltr:right-0 animate-ping h-2 w-2 rounded-full ${
                            notification?.status !== "unread"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        />
                      </h1>
                      {/* <p className="text-sm font-medium">
                                                {i18n.language === "ar"
                                                    ? notification?.title_ar
                                                    : notification?.title_en}
                                            </p> */}
                      <p className="text-sm text-muted-foreground">
                        {moment(notification?.created_at).fromNow()}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <h1>{t("No notifications")}</h1>
              )}
              {isMarkingAsRead && (
                <div className="flex justify-center">
                  <Spinner size="sm" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
