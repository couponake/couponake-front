import NotFoundClient from "@/components/NotFoundClient";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <NotFoundClient
      t={{
        title: t("title"),
        description: t("description"),
        backButton: t("backButton"),
        homeButton: t("homeButton"),
        ornamentalText: t("ornamentalText"),
      }}
    />
  );
}
