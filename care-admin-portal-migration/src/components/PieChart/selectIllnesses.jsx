import React from "react";
import { Select, Group } from "@mantine/core";
import { IconPoint } from "@tabler/icons-react";

export function selectIllnesses(
  chartData,
  classes,
  handleSelectedIllnessGender,
  handleSelectedIllnessAge,
  handleSelectedIllnessTime
) {
  return (
    <Group pos="absolute" w="100%">
      {chartData?.value
        ? chartData?.title === "Illness And Gender" && (
            <Select
              rightSection={<IconPoint color="transparent" />}
              classNames={{
                input: classes.input,
                rightSection: classes.rightSection,
              }}
              w="100%"
              leftSection={<IconPoint />}
              radius="xs"
              placeholder="Select or Search for illness"
              data={chartData?.value?.map((illness) => {
                return { label: illness.illness, value: illness.illness };
              })}
              searchable
              maxDropdownHeight={180}
              onChange={handleSelectedIllnessGender}
            />
          )
        : null}
      {chartData?.value
        ? chartData?.title === "Illness And Age" && (
            <Select
              rightSection={<IconPoint color="transparent" />}
              classNames={{
                input: classes.input,
                rightSection: classes.rightSection,
              }}
              w="100%"
              leftSection={<IconPoint />}
              radius="xs"
              placeholder="Select or Search for illness"
              data={chartData?.value?.map((illness) => {
                return { label: illness.illness, value: illness.illness };
              })}
              searchable
              maxDropdownHeight={180}
              onChange={handleSelectedIllnessAge}
            />
          )
        : null}
      {chartData?.value
        ? chartData?.title === "Illness And Time" && (
            <Select
              rightSection={<IconPoint color="transparent" />}
              classNames={{
                input: classes.input,
                rightSection: classes.rightSection,
              }}
              w="100%"
              leftSection={<IconPoint />}
              radius="xs"
              placeholder="Select or Search for illness"
              data={chartData?.value?.map((illness) => {
                return { label: illness.illness, value: illness.illness };
              })}
              searchable
              maxDropdownHeight={180}
              onChange={handleSelectedIllnessTime}
            />
          )
        : null}
    </Group>
  );
}
