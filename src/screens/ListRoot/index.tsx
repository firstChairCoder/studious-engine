import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Heading, Icon, ScrollView, Text } from "native-base";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Database } from "@nozbe/watermelondb";
import { Feather } from "@expo/vector-icons";

import type { ListStackScreenProps } from "@/navigation/types";
import { Fab, LeftAccentCard, StatusBar } from "@/components";
import type List from "@/db/models/list";
import withDB from "@/db/models/withDB";
import { Tables } from "@/db/models/schema";
import { database } from "@/db/db";

type ListViewProps = ListStackScreenProps<"Root"> & {
  lists: List[];
  database: Database;
};

interface RawCardProps {
  list: List;
  navigation: any;
  count: number;
}

const RawCard = ({ list, navigation, count }: RawCardProps) => {
  const { t } = useTranslation();
  return (
    <LeftAccentCard
      style={{ marginHorizontal: 10 }}
      onPress={() => {
        navigation.push("List", {
          listID: list.id
        });
      }}
      theme={list.theme}
    >
      <Text
        textAlign="left"
        isTruncated
        style={{ paddingEnd: 10 }}
        fontSize="xl"
        bold
      >
        {list.name}
      </Text>
      <Text fontSize="md">
        {t("task-left-count", { count, postProcess: "interval" })}
      </Text>
    </LeftAccentCard>
  );
};

const Card = withDB(RawCard, ["list"], ({ list }) => ({
  list,
  count: list.tasks.observeCount()
}));

const ListView = withDB<ListViewProps, { lists: List[] }>(
  ({ lists, navigation }) => (
    <>
      {lists.map((list) => (
        <Card key={list.id} navigation={navigation} list={list} />
      ))}
    </>
  ),
  ["database"],

  // eslint-disable-next-line @typescript-eslint/no-shadow
  ({ database }) => ({
    lists: database.get<List>(Tables.List).query()
  })
);

export const ListRootScreen = (props: ListStackScreenProps<"Root">) => {
  const addListRef = useRef<BottomSheetModalMethods>(null);
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <Heading mx="20px" mt="20px" mb="10px">
        {t("list", { count: 10, postProcess: "interval" })}
      </Heading>
      <ScrollView>
        <ListView {...props} database={database} />
      </ScrollView>
      <Fab
        style={{
          width: undefined,
          paddingHorizontal: 15,
          borderRadius: 15,
          flexDirection: "row"
        }}
        onPress={() => {
          addListRef.current?.present();
        }}
      >
        <Icon
          size={25}
          style={{ marginEnd: 5 }}
          name="plus"
          as={Feather}
          color="em.1"
        />
        <Text color="em.1" fontSize="md" bold>
          {t("add") + " " + t("list", { count: 1, postProcess: "interval" })}
        </Text>
      </Fab>
      {/* <AddListSheet ref={addListRef} /> */}
    </SafeAreaView>
  );
};
