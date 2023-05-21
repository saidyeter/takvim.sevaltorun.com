import { useRouter } from "expo-router";
import { FlexView } from "../components/themed/flex-view";
import { StatusBar } from "expo-status-bar";
import { Label } from "../components/themed/label";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { TextBox } from "../components/themed/text-box";
import { Touchable } from "../components/themed/touchable";
import api from "../api/client";
import { Platform } from "react-native";

export default function NewPage() {
  const { back } = useRouter();
  const [desc, setDesc] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState("");
  const [showEndDate, setShowEndDate] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);

  // _e is import { DateTimePickerEvent, } from "@react-native-community/datetimepicker";
  // more : https://github.com/react-native-datetimepicker/datetimepicker#usage
  const onChangeStartDate = (_e: any, date?: Date) => {
    const currentDate = date;
    setStartDate(currentDate ?? new Date());
    setShowStartDate(false);
  };
  const onChangeEndDate = (_e: any, date?: Date) => {
    const currentDate = date;
    setEndDate(currentDate ?? new Date());
    setShowEndDate(false);
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
    <FlexView
      paddingVertical="25%"
      paddingHorizontal="5%"
    >
      <StatusBar style="light" />
      <FlexView>
        <Label textAlign="left">Aciklama</Label>
        <TextBox onChangeText={setDesc}>{desc}</TextBox>
      </FlexView>
      <FlexView
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Label
          width="50%"
          textAlign="left"
        >
          Başlangıç
        </Label>

        {Platform.OS == "ios" && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={onChangeStartDate}
            style={{
              backgroundColor: "#ACBCFF",
            }}
          />
        )}
        {Platform.OS == "android" && showStartDate && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={onChangeStartDate}
          />
        )}
        {Platform.OS == "android" && !showStartDate && (
          <Touchable
            width="50%"
            onPress={() => {
              setShowStartDate(true);
            }}
          >
            {getLocaleDate(startDate)}
          </Touchable>
        )}
      </FlexView>
      <FlexView
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Label
          width="50%"
          textAlign="left"
        >
          Bitiş
        </Label>

        {Platform.OS == "ios" && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={onChangeEndDate}
            style={{
              backgroundColor: "#ACBCFF",
            }}
          />
        )}
        {Platform.OS == "android" && showEndDate && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={onChangeEndDate}
          />
        )}
        {Platform.OS == "android" && !showEndDate && (
          <Touchable
            width="50%"
            onPress={() => {
              setShowEndDate(true);
            }}
          >
            {getLocaleDate(endDate)}
          </Touchable>
        )}
      </FlexView>
      <FlexView>
        <Touchable onPress={onSave}>Oluştur</Touchable>
        <Label>{error}</Label>
      </FlexView>
    </FlexView>
  );
}
function getLocaleDate(ms: Date) {
  return ms.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  });
}
