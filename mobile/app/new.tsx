import { useRouter } from "expo-router";
import { FlexView } from "../components/themed/flex-view";
import { StatusBar } from "expo-status-bar";
import { Label } from "../components/themed/label";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { TextBox } from "../components/themed/text-box";
import { Touchable } from "../components/themed/touchable";
import api from "../api/client";

export default function NewPage() {
  const { back } = useRouter();
  const [desc, setDesc] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState("");

  // _e is import { DateTimePickerEvent, } from "@react-native-community/datetimepicker";
  // more : https://github.com/react-native-datetimepicker/datetimepicker#usage
  const onChangeStartDate = (_e: any, date?: Date) => {
    const currentDate = date;
    setStartDate(currentDate ?? new Date());
  };
  const onChangeEndDate = (_e: any, date?: Date) => {
    const currentDate = date;
    setEndDate(currentDate ?? new Date());
  };

  async function onSave() {
    setError("");
    if (startDate > endDate) {
      setError("Başlangıç tarihi bitiş tarihinden sonra olamaz");
      return;
    }
    const newEvent = {
      desc,
      starts: startDate,
      ends: endDate,
    };
    const res = await api.createEvent(newEvent);
    if (res && res.id) {
      back();
    }
    setError("biseyler ters gitti");
  }

  return (
    <FlexView paddingHorizontal="10%">
      <StatusBar style="light" />
      <FlexView height="20%" />
      <FlexView height="60%">
        <FlexView>
          <Label>Aciklama</Label>
          <TextBox onChangeText={setDesc}>{desc}</TextBox>
        </FlexView>
        <FlexView
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Label width="50%">Başlangıç</Label>
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={onChangeStartDate}
            style={{
              backgroundColor: "white",
            }}
          />
        </FlexView>
        <FlexView
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Label width="50%">Bitiş</Label>
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={onChangeEndDate}
            style={{
              backgroundColor: "white",
            }}
          />
        </FlexView>
      </FlexView>
      <FlexView height="20%">
        <Touchable onPress={onSave}>Oluştur</Touchable>
        <Label>{error}</Label>
      </FlexView>
    </FlexView>
  );
}
