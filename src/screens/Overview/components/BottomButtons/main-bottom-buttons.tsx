import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import type { ButtonPageProps } from "./type";
import { BottomButton } from ".";

export function MainButtons({
  task,
  removeTask,
  setPage
}: // eslint-disable-next-line @typescript-eslint/ban-types
ButtonPageProps & {}) {
  const { t } = useTranslation();
  const mainButtonData = [
    {
      label: t("today"),
      iconName: "coffee",
      color: "blue",
      onPress: () => {
        setPage("today");
      }
    },
    {
      label: t("done"),
      iconName: "check",
      color: "green",
      onPress: () => {
        task.setIsCompleted(true);
        removeTask();
      }
    },

    {
      label: t("later"),
      iconName: "sunset",
      color: "yellow",
      onPress: () => {
        setPage("later");
      }
    },
    {
      label: t("delete"),
      iconName: "x",
      color: "red",
      onPress: () => {
        task.markAsDeleted();
        removeTask();
      }
    }
  ];
  return (
    <ScrollView showsHorizontalScrollIndicator={false} horizontal>
      {mainButtonData.map((v, index) => {
        return (
          <BottomButton
            {...v}
            key={index}
            colorDark={v.color + ".400"}
            colorLight={v.color + ".500"}
            index={index}
          />
        );
      })}
    </ScrollView>
  );
}
