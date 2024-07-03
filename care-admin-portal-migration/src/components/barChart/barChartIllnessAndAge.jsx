import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CloseButton, Loader, Select, Text } from "@mantine/core";
import { CustomTooltip } from "../areachart/CustomTooltip";
import { IconPoint } from "@tabler/icons-react";

const BarchartIllnessAndAge = ({
  onRemove,
  CustomizedLabel,
  COLORS,
  illnessAndAgeMetrics,
  classes,
  colorScheme,
}) => {
  const [illnessDisplayAge, setIllnessDisplayTime] = useState();
  const formatIllnessAndAge =
    illnessDisplayAge?.ages !== undefined
      ? Object.entries(illnessDisplayAge?.ages).map(([age, count]) => ({
          age,
          count,
        }))
      : [];
  const handleSelectedIllnessTime = (value) => {
    setIllnessDisplayTime(
      illnessAndAgeMetrics?.find((illness) => illness.illness === value)
    );
  };

  return (
    <>
      <Text align="center" mt={5} weight={700}>
        Illness And Age Distribution
      </Text>
      {illnessAndAgeMetrics && (
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
          data={illnessAndAgeMetrics?.map((illness) => {
            return { label: illness.illness, value: illness.illness };
          })}
          searchable
          maxDropdownHeight={180}
          onChange={handleSelectedIllnessTime}
        />
      )}
      {!illnessAndAgeMetrics && (
        <Loader
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          size="xl"
        />
      )}

      <CloseButton
        aria-label="Close modal"
        onClick={onRemove}
        style={{ position: "absolute", top: 2, left: 2 }}
      />
      {illnessAndAgeMetrics && (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            width={500}
            height={300}
            data={formatIllnessAndAge.sort((a, b) => a.age - b.age)}
            barGap={-30}
            margin={{
              top: 30,
              right: 30,
              left: 4,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray={colorScheme === "light" ? "3 3" : "0.5 3"}
            />
            <XAxis
              dataKey="age"
              label={{ value: "Ages", position: "insideBottom", offset: -4 }}
            />
            <YAxis
              dataKey="count"
              axisLine={false}
              tickLine={false}
              tickCount={3}
              label={{ value: "Amount", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              position={{ y: 10 }}
              cursor={{ fillOpacity: 0.1, fill: "rgba(3,186,98,1)" }}
            />

            <Bar
              dataKey="count"
              name="Illness And Age Distribution"
              barSize={30}
              label={<CustomizedLabel />}
              isAnimationActive={false}
            >
              {illnessAndAgeMetrics?.map((entry, index) => {
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default BarchartIllnessAndAge;
