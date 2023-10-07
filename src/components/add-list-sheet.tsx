import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Box, Input, Text, useTheme } from "native-base";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useTranslation } from "react-i18next";

import Backdrop from "./backdrop";
import Footer from "./footer";
import ThemeButton from "./theme-button";

import { listThemes } from "@/theme/listTheme";
import { database } from "@/db/db";
import type List from "@/db/models/list";
import { Tables } from "@/db/models/schema";
import { getUid } from "@/utils/getUid";

const AddListSheet = forwardRef<BottomSheetModalMethods>((_, ref) => {
  const { surface } = useTheme().colors;
  const innerRef = useRef<BottomSheetModalMethods>(null);
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useImperativeHandle(ref, () => innerRef.current);
  const [name, setName] = useState("");
  const [activeTheme, setActiveTheme] = useState(listThemes.mint);
  return (
    <BottomSheetModal
      snapPoints={["90%"]}
      onDismiss={() => {
        setName("");
      }}
      enableDismissOnClose
      backdropComponent={Backdrop}
      ref={innerRef}
      backgroundStyle={{
        backgroundColor: surface
      }}
    >
      <BottomSheetScrollView
        style={{ paddingHorizontal: 20, paddingVertical: 10 }}
      >
        <Text fontSize="2xl" bold mb="5" color="em.1">
          {t("create-new-list")}
        </Text>

        <Text mb="2" fontSize="md" bold>
          {t("list-name")}
        </Text>
        <Input
          h="40px"
          defaultValue={name}
          onChangeText={(i) => setName(i)}
          fontSize="lg"
        />

        <Text mt="5" mb="2" fontSize="md" bold>
          {t("theme")}
        </Text>
        <Box flexDirection="row" flexWrap="wrap">
          {Object.keys(listThemes).map((v, i) => {
            const theme = listThemes[v];
            return (
              <ThemeButton
                onPress={() => {
                  setActiveTheme(theme);
                }}
                key={i}
                active={theme === activeTheme}
                theme={theme}
              />
            );
          })}
        </Box>
      </BottomSheetScrollView>
      <Footer
        onPress={() => {
          if (!name) {
            return;
          }
          database.write(async () => {
            database.get<List>(Tables.List).create((list) => {
              list.name = name;
              list.id = getUid();
              list.theme = activeTheme;
            });
          });
          innerRef.current?.close();
        }}
        label={t("create-new-list")}
      />
    </BottomSheetModal>
  );
});

export default AddListSheet;
