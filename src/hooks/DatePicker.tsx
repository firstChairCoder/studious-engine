import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import type { Dispatch, SetStateAction } from "react";

// Android support only for now
export const DatePicker = (
  value: Date,
  setValue: Dispatch<SetStateAction<Date>>
) => {
  const showDatePicker = () => {
    showPicker(value, "date", (date) => {
      if (date.type === "set") {
        const d = dayjs(date.nativeEvent.timestamp).toDate();

        showPicker(d, "time", (time) => {
          const t = dayjs(time.nativeEvent.timestamp).toDate();
          if (time.type === "set") {
            setValue(t);
          } else {
            setValue(d);
          }
        });
      }
    });
  };
  return showDatePicker;
};
export const showPicker = (
  value: Date,
  mode: "time" | "date",
  onChange?: (i: DateTimePickerEvent, date: Date | undefined) => void
) => {
  DateTimePickerAndroid.open({
    value,
    mode,
    onChange: onChange,
    is24Hour: false
  });
};
