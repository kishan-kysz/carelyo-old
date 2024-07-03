import React from "react";
import { NumberInput } from "@mantine/core";
import { IconBusinessplan, IconMedal } from "@tabler/icons-react";
const SelectMonthtlyGoal = ({ handleSelectMonthlyGoal, selectedData }) => {
  return (
    <NumberInput
      label="Choose Monthly Goal"
      style={{ marginTop: 5, zIndex: 2 }}
      onChange={handleSelectMonthlyGoal}
      hideControls
      leftSection={
        selectedData === "Monthly Revenue" ? (
          <IconBusinessplan size={18} />
        ) : (
          <IconMedal size={18} />
        )
      }
      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
      formatter={(value) =>
        !Number.isNaN(parseFloat(value))
          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : ""
      }
    />
  );
};

export default SelectMonthtlyGoal;
