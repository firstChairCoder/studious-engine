import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import type Database from "@nozbe/watermelondb/Database";
import { MotiPressable } from "moti/interactions";
import type { ITextProps } from "native-base";
import { Box, Text, useColorModeValue } from "native-base";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// import AddListSheet from "../bottomTabs/lists/listScreen/AddListSheet";

import withDB from "@/db/models/withDB";
import { Tables } from "@/db/models/schema";
import type List from "@/db/models/list";
import type { listThemeType } from "@/theme/listTheme";

const ListChip = ({
  name,
  theme,
  isActive,
  ...p
}: ITextProps & {
  name: string;
  theme: listThemeType;
  isActive?: boolean;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const bg = isActive ? theme.main : useColorModeValue("gray.200", "gray.600");
  const color = isActive
    ? theme.secondary
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useColorModeValue("gray.600", "gray.100");
  return (
    <Text
      style={{ marginEnd: 10 }}
      mt="10px"
      px="3"
      alignItems="center"
      textAlign="center"
      py="1"
      fontSize="md"
      color={color}
      borderRadius={10}
      bg={bg}
      {...p}
    >
      {name}
    </Text>
  );
};

type ListChipsProps = {
  lists: List[];
  database: Database;
  activeListID: string;
  setActiveListID: Dispatch<SetStateAction<string>>;
  initialListID?: string;
};
const ListChips = ({
  lists,
  setActiveListID,
  activeListID,
  initialListID
}: ListChipsProps) => {
  useEffect(() => {
    if (activeListID) {
      return;
    }
    if (initialListID) {
      setActiveListID(initialListID);
    } else if (lists[0]) {
      setActiveListID(lists[0].id);
    }
  }, [initialListID, lists, activeListID]);
  const sheetRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();
  return (
    <Box flexDirection="row" flexWrap="wrap">
      {lists.map((list) => {
        return (
          <MotiPressable
            animate={({ pressed }) => {
              "worklet";
              return {
                scale: pressed ? 0.9 : 1
              };
            }}
            key={list.id}
            onPress={() => setActiveListID(list.id)}
          >
            <ListChip
              isActive={list.id === activeListID}
              name={list.name}
              theme={list.theme}
            />
          </MotiPressable>
        );
      })}
      <MotiPressable
        onPress={() => {
          sheetRef.current?.present();
        }}
        animate={({ pressed }) => {
          "worklet";
          return {
            scale: pressed ? 0.9 : 1
          };
        }}
      >
        <Text
          style={{ marginEnd: 10 }}
          mt="10px"
          px="10px"
          alignItems="center"
          textAlign="center"
          py="2px"
          fontSize="md"
          color="em.3"
          borderWidth={1}
          borderColor="em.3"
          borderStyle="dashed"
          borderRadius={10}
        >
          {t("add") + " " + t("list", { count: 1, postProcess: "interval" })}
        </Text>
      </MotiPressable>
      {/* <AddListSheet ref={sheetRef} /> */}
    </Box>
  );
};

export default withDB<ListChipsProps, { lists: List[] }>(
  ListChips,
  ["database"],
  ({ database }) => {
    return {
      lists: database.get<List>(Tables.List).query()
    };
  }
);
