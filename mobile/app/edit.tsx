import { useRouter, useSearchParams } from "expo-router";
import { z } from "zod";
import { FlexView } from "../components/themed/flex-view";
import { StatusBar } from "expo-status-bar";
import { Label } from "../components/themed/label";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { TextBox } from "../components/themed/text-box";
import { Touchable } from "../components/themed/touchable";
import api from "../api/client";
import { Platform } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const paramsSchema = z.object({
  id: z.string(),
});

export default function EditPage() {
  const queryClient = useQueryClient();

  const params = useSearchParams() as z.infer<typeof paramsSchema>;
  const { back } = useRouter();
  const [desc, setDesc] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [saveError, setSaveError] = useState("");
  const [removeError, setRemoveError] = useState("");
  const [showEndDate, setShowEndDate] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);

  useQuery({
    queryKey: ["event"],
    queryFn: () => api.getEvent(params.id),
    onError: (err: any) => {
      console.log("EditPage fetch err", err);
    },
    onSuccess: (data) => {
      setStartDate(data?.starts ?? new Date());
      setEndDate(data?.ends ?? new Date());
      setDesc(data?.desc ?? "");
    },
  });

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
    setSaveError("");
    if (startDate > endDate) {
      setSaveError("Başlangıç tarihi bitiş tarihinden sonra olamaz");
      return;
    }

    const res = await api.updateEvent({
      desc,
      starts: startDate,
      ends: endDate,
      id: params.id,
    });
    if (res) {
      queryClient.invalidateQueries(["events"]);
      back();
    }
    setSaveError("biseyler ters gitti");
  }

  async function onRemove() {
    setRemoveError("");
    if (startDate > endDate) {
      setRemoveError("Başlangıç tarihi bitiş tarihinden sonra olamaz");
      return;
    }

    const res = await api.deleteEvent(params.id);
    if (res) {
      queryClient.invalidateQueries(["events"]);
      back();
    }
    setRemoveError("biseyler ters gitti");
  }

  return (
    <FlexView
      paddingVertical="25%"
      paddingHorizontal="5%"
    >
      <StatusBar style="light" />
      <FlexView>
        <Label textAlign="left">Aciklama</Label>
        <TextBox
          textAlign="left"
          paddingLeft={5}
          onChangeText={setDesc}
        >
          {desc}
        </TextBox>
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
        <Touchable
          onPress={onSave}
          backgroundColor="#537188"
        >
          Güncelle
        </Touchable>
        <Label>{saveError}</Label>
      </FlexView>
      <FlexView>
        <Touchable
          onPress={onRemove}
          backgroundColor={"tomato"}
        >
          Sil
        </Touchable>
        <Label>{removeError}</Label>
      </FlexView>
    </FlexView>
  );
}
function getLocaleDate(ms: Date) {
  return ms.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
