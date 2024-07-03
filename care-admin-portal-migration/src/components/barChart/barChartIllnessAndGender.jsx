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
import { CloseButton, Select, Text, Loader } from "@mantine/core";
import { CustomTooltip } from "../areachart/CustomTooltip";
import { IconPoint } from "@tabler/icons-react";

const BarchartIllnessAndGender = ({
  onRemove,
  CustomizedLabel,
  COLORS,
  illnessAndGenderMetrics,
  classes,
  colorScheme,
}) => {
  const [illnessDisplayGender, setIllnessDisplayGender] = useState();
  const formatIllnessAndGender =
    illnessDisplayGender?.genders !== undefined
      ? Object.entries(illnessDisplayGender?.genders).map(
          ([gender, count]) => ({ gender, count })
        )
      : [];
  const handleSelectedIllnessGender = (value) => {
    setIllnessDisplayGender(
      illnessAndGenderMetrics?.find((illness) => illness.illness === value)
    );
  };

  return (
    <>
      <Text align="center" mt={5} weight={700}>
        Illness And Gender Distribution
      </Text>
      {illnessAndGenderMetrics && (
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
          data={illnessAndGenderMetrics?.map((illness) => {
            return { label: illness.illness, value: illness.illness };
          })}
          searchable
          maxDropdownHeight={180}
          onChange={handleSelectedIllnessGender}
        />
      )}
      {!illnessAndGenderMetrics && (
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
      {illnessAndGenderMetrics && (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            width={500}
            height={300}
            data={formatIllnessAndGender.sort((a, b) => b.count - a.count)}
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
              dataKey="gender"
              label={{ value: "Gender", position: "insideBottom", offset: -4 }}
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
              name="Illness And Gender Distribution"
              barSize={30}
              label={<CustomizedLabel />}
              isAnimationActive={false}
            >
              {illnessAndGenderMetrics?.map((entry, index) => {
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

export default BarchartIllnessAndGender;
