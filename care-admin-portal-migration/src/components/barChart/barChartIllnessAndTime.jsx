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

const BarchartIllnessAndTime = ({
  onRemove,
  CustomizedLabel,
  COLORS,
  illnessAndTimeMetrics,
  classes,
  colorScheme,
}) => {
  const [illnessDisplayTime, setIllnessDisplayTime] = useState();
  const formatIllnessAndTime =
    illnessDisplayTime?.times !== undefined
      ? Object.entries(illnessDisplayTime?.times).map(([time, count]) => ({
          time,
          count,
        }))
      : [];
  const handleSelectedIllnessTime = (value) => {
    setIllnessDisplayTime(
      illnessAndTimeMetrics?.find((illness) => illness.illness === value)
    );
  };

  return (
    <>
      <Text align="center" mt={5} weight={700}>
        Illness And Time Distribution
      </Text>
      {illnessAndTimeMetrics && (
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
          data={illnessAndTimeMetrics?.map((illness) => {
            return { label: illness.illness, value: illness.illness };
          })}
          searchable
          maxDropdownHeight={180}
          onChange={handleSelectedIllnessTime}
        />
      )}

      {!illnessAndTimeMetrics && (
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
      {illnessAndTimeMetrics && (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            width={500}
            height={300}
            data={formatIllnessAndTime.sort((a, b) => {
              const [aStart, aEnd] = a.time.split("-");
              const [bStart, bEnd] = b.time.split("-");
              return parseInt(aStart, 10) - parseInt(bStart, 10);
            })}
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
              dataKey="time"
              label={{ value: "Time", position: "insideBottom", offset: -4 }}
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
              name="Illness And Time Distribution"
              barSize={30}
              label={<CustomizedLabel />}
              isAnimationActive={false}
            >
              {illnessAndTimeMetrics?.map((entry, index) => {
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

export default BarchartIllnessAndTime;
