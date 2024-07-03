import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Button, Text, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect, useCallback, useRef } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidgetPortal } from "../WidgetPortal/WidgetPortal";
import StatsCard from "../StatsCard/StatsCard";
import StatsCardRating from "../StatsCard/statsCardRating";
import { useConsultations } from "../../helper/hooks/useConsultations";
import usePeople from "../../helper/hooks/usePeople";
import LineChartComponent from "../LineChart";
import PieChartComponent from "../PieChart/PieChart";
import BarChart from "../barChart/BarChart";
import {
  useMetricsStartDateEndDate,
  useMetrics,
  useMetricsStartDateEndDatePeriod,
  useMetricsAges,
} from "../../helper/hooks/useMetrics";
import AcceptedPerDoctorTable from "../AcceptedPerDoctorTable";
import { useLocalStorage } from "@mantine/hooks";
import { IconAlertTriangle } from "@tabler/icons-react";
import { initialLayouts } from "../../Initialdashboard/initialLayouts";
import { initialItems } from "../../Initialdashboard/initialItems";
import updateComponentData from "../../pages/home/dashGrid/updateComponentData";
import { addComponent } from "./AddComponent";
import { useUpdateComponent } from "./useUpdateComponent";
import AreaChartComponent from "../areachart/areachart";
import { createStyles } from "@mantine/styles";

const ResponsiveGridLayout = WidthProvider(Responsive);
const useStyles = createStyles((theme) => ({
  item: {
    borderBottom: "1px solid rgba(0,191,166,.7)",
    borderLeft: "1px solid rgba(0,191,166,.7)",
    borderTop: "1px solid rgba(0,191,166,.7)",
    paddingBottom: "10px",
    transition: "box-shadow 0.2s linear",
  },
  layout: {
    border:
      theme.colorScheme === "light" ? null : "1px solid rgba(0,191,166,0.3)",
    ".react-resizable-handle": {
      borderRight: "1px solid #686a6b !important",
      borderBottom: "1px solid #686a6b !important",
    },
  },
  layoutButton: {
    marginBottom: 10,
    marginTop: 10,

    color: "white",
    boxShadow: "-4px 8px 12px -7px grey",
    border: "1px solid rgba(0,191,166,.7)",
  },
}));
export const DashGrid = () => {
  const { classes } = useStyles();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowsHeight, setWindowHeight] = useState(window.innerHeight);
  const dateToday = new Date();
  const { patients, doctors, loadingPatients } = usePeople();
  const { consultations } = useConsultations();
  const {
    acceptingDoctorsResponseMetrics,
    consultationsGenderDistributionMetrics,
    totalCompletedConsultationTimePerDoctorMetrics,
    numberOfOngoingConsultationsMetrics,
    numberOfAcceptedConsultationsMetrics,
    numberOfBookedConsultationsMetrics,
    numberOfFinishedConsultationsMetrics,
    numberOfIncomingConsultationsMetrics,
    relationshipBetweenIllnessAndGenderMetrics,
    relationshipBetweenIllnessAndAgeMetrics,
    relationshipBetweenIllnessAndTimeMetrics,
    finishedConsultationsRatingDistributionMetrics,
  } = useMetrics();

  const startMonth =
    dateToday.getMonth() + 1 < 10
      ? `0${dateToday.getMonth() + 1}`
      : `${dateToday.getMonth() + 1}`;
  const [MonthlyRevenue, setMonthlyRevenue] = useState();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const startDate = new Date(
    `${dateToday.getFullYear()}-01-01T00:00:00.000+00:00`
  );
  const endDate = new Date(
    `${dateToday.getFullYear()}-12-31T00:00:00.000+00:00`
  );
  const [opened, { open, close }] = useDisclosure(false);

  const closeModal = () => {
    close();
  };

  const [layout, setLayout] = useLocalStorage({
    key: "layouts",
    defaultValue:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("layouts")) || initialLayouts
        : initialLayouts,
  });

  const { numberOfConsultationsByAgeSpansMetrics } = useMetricsAges([
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
  ]);

  const [period, setPeriod] = useState("Month");
  const [selected, setSelected] = useState();
  const [stats, setStats] = useState();
  const [type, setType] = useState();
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [date1, setDate1] = useState(
    new Date(`${dateToday.getFullYear()}-01-01T00:00:00.000+00:00`)
  );
  const [date2, setDate2] = useState(
    new Date(`${dateToday.getFullYear()}-12-31T00:00:00.000+00:00`)
  );
  const { consultationsMetrics } = useMetricsStartDateEndDate(date1, date2);
  const { amountPaidForConsultationsOverTimeMetrics } =
    useMetricsStartDateEndDatePeriod(startDate, endDate, period);
  useEffect(() => {
    const newMonthlyRevenue = amountPaidForConsultationsOverTimeMetrics?.reduce(
      (acc, item) => {
        if (item.period.substring(5, 7) === startMonth) {
          return item.amountPaid;
        }
        return acc;
      },
      0
    );
    setMonthlyRevenue(newMonthlyRevenue);
  }, [amountPaidForConsultationsOverTimeMetrics, period, startMonth]);
  const [items, setItems] = useLocalStorage({
    key: "items",
    defaultValue:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("items")) || []
        : [],
  });
  const ObjectToUpdate = updateComponentData(
    doctors,
    consultations,
    patients,
    numberOfOngoingConsultationsMetrics,
    consultationsGenderDistributionMetrics,
    totalCompletedConsultationTimePerDoctorMetrics,
    acceptingDoctorsResponseMetrics,
    MonthlyRevenue,
    numberOfAcceptedConsultationsMetrics,
    numberOfBookedConsultationsMetrics,
    numberOfFinishedConsultationsMetrics,
    numberOfIncomingConsultationsMetrics,
    amountPaidForConsultationsOverTimeMetrics,
    numberOfConsultationsByAgeSpansMetrics,
    relationshipBetweenIllnessAndGenderMetrics,
    relationshipBetweenIllnessAndAgeMetrics,
    relationshipBetweenIllnessAndTimeMetrics,
    finishedConsultationsRatingDistributionMetrics
  );

  const data = {
    "Registered Doctors": doctors?.length,
    "Total Consultations": consultations?.length,
    "Total Patients": patients?.length,
    "Ongoing Consultations": numberOfOngoingConsultationsMetrics,
    "Consultations Gender Distribution": consultationsGenderDistributionMetrics,
    "Consultations Total Time Spent Per Doctor":
      totalCompletedConsultationTimePerDoctorMetrics,
    "Current Accepted Consultations Per Doctor":
      acceptingDoctorsResponseMetrics,
    "Monthly Revenue": MonthlyRevenue,
    "Accepted Consultations": numberOfAcceptedConsultationsMetrics,
    "Booked Consultations": numberOfBookedConsultationsMetrics,
    "Finished Consultations": numberOfFinishedConsultationsMetrics,
    "Incoming Consultations": numberOfIncomingConsultationsMetrics,
    "Consultations Age Distribution": numberOfConsultationsByAgeSpansMetrics,
    "Illness And Gender": relationshipBetweenIllnessAndGenderMetrics,
    "Amount paid for consultations": amountPaidForConsultationsOverTimeMetrics,
    "Illness And Age": relationshipBetweenIllnessAndAgeMetrics,
    "Illness And Time": relationshipBetweenIllnessAndTimeMetrics,
    "Consultations Rating Distribution":
      finishedConsultationsRatingDistributionMetrics,
  };
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("Default") === null &&
      loadingPatients === false &&
      consultations !== undefined &&
      layout.length === 0
    ) {
      localStorage.setItem("Default", "true");
      setLayout(initialLayouts);

      setItems((prevItems) => {
        const newItems = [...initialItems].map((item) => {
          const object = ObjectToUpdate.find((obj) => obj.key === item.title);

          if (object) {
            let updatedValue = object.value;

            return { ...item, value: updatedValue };
          }

          return item;
        });
        return newItems;
      });
    }
  }, [ObjectToUpdate, loadingPatients, consultations, setLayout, layout]);

  const onLayoutChange = useCallback(
    (newLayout) => {
      if (isMounted.current) {
        setLayout(newLayout);
      }
    },
    [setLayout]
  );

  useUpdateComponent(setItems, ObjectToUpdate);

  const handleDateRangeChange = (dateRange) => {
    if (dateRange[0] && dateRange[1]) {
      setDate1(dateRange[0]);
      setDate2(dateRange[1]);
    }
  };

  const handleselection = (selected) => {
    if (Array.isArray(selected)) {
      let multipleValues = selected.map((title) => {
        return { value: data[title], title: title };
      });
      setStats(multipleValues);
    } else if (!Array.isArray(selected)) {
      setStats(data[selected]);
    }
  };

  const handleAddItem = addComponent(
    type,
    items,
    stats,
    selected,
    monthlyGoal,
    setItems,
    setMonthlyGoal
  );

  const handleChange = (newValue) => {
    setSelected(newValue);
    handleselection(newValue);
  };
  const handleType = (value) => {
    setType(value);
  };
  const handleMonthlyGoal = (goalSelect) => {
    setMonthlyGoal(goalSelect);
  };
  const handleRemoveItem = (itemId) => {
    setItems(items.filter((i) => i.i !== itemId));
  };
  const handleDefault = () => {
    setPopoverOpen(false);
    localStorage.removeItem("layouts");
    localStorage.removeItem("items");
    setItems(initialItems);
    setLayout(initialLayouts);

    localStorage.removeItem("Default");

    closeModal();
  };

  return (
    <>
      <WidgetPortal
        handleAddItem={handleAddItem}
        onChange={handleChange}
        handleType={(typeSelect) => handleType(typeSelect)}
        handleMonthlyGoal={(goalSelect) => handleMonthlyGoal(goalSelect)}
      />
      <Button
        mt="xl"
        variant="outline"
        color="#e74c3c"
        br="md"
        mb="md"
        ml="md"
        leftSection={<IconAlertTriangle />}
        onClick={open}
      >
        Reset Widgets
      </Button>
      <Modal
        size="sm"
        opened={opened}
        onClose={close}
        title="Reset widgets and layout"
        centered
      >
        <Text weight={600}>
          Are you sure? This will reset the widget layout to default and remove
          any widgets placed on the dashboard.
        </Text>

        <Button
          mt="md"
          mr="md"
          onClick={handleDefault}
          radius="sm"
          bg="#e74c3c"
        >
          Reset
        </Button>
        <Button
          leftSection={<IconAlertTriangle />}
          mt="md"
          onClick={closeModal}
          radius="sm"
          bg="#05a98b"
        >
          Close
        </Button>
      </Modal>

      <ResponsiveGridLayout
        layouts={layout}
        breakpoints={{ lg: 1200, md: 992, sm: 768, xs: 576, xxs: 0 }}
        cols={{ lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 }}
        rowHeight={150}
        width={windowWidth}
        height={windowsHeight}
        isBounded={false}
        className={classes.layout}
        isResizable={true}
        onLayoutChange={onLayoutChange}
      >
        {items?.map((item) => (
          <div
            key={item.i}
            data-grid={{
              x: item.x,
              y: item.y,
              w: item.w,
              h: item.h,
              minH: item.minH,
              minW: item.minW,
              maxW: item.maxW,
            }}
          >
            <Paper bg="#f2f5f8" h={"inherit"} className={classes.item}>
              {item.i.includes("Consultations Rating Distribution") ? (
                <StatsCardRating
                  onRemove={() => handleRemoveItem(item.i)}
                  consultationsRatings={
                    finishedConsultationsRatingDistributionMetrics
                  }
                  title={item.title}
                />
              ) : item.i.includes("stats card") ? (
                <StatsCard
                  onRemove={() => handleRemoveItem(item.i)}
                  title={item.title}
                  stats={item.value}
                  monthlyGoal={item.monthlyGoal}
                />
              ) : item.i.includes("linechart") ? (
                <LineChartComponent
                  onRemove={() => handleRemoveItem(item.i)}
                  data={amountPaidForConsultationsOverTimeMetrics}
                  setPeriod={setPeriod}
                />
              ) : item.i.includes("piechart") ? (
                <PieChartComponent
                  onRemove={() => handleRemoveItem(item.i)}
                  data={item}
                />
              ) : item.i.includes("barchart") ? (
                <BarChart
                  onRemove={() => handleRemoveItem(item.i)}
                  consultationsMetrics={consultationsMetrics}
                  ageMetrics={numberOfConsultationsByAgeSpansMetrics}
                  illnessAndAgeMetrics={relationshipBetweenIllnessAndAgeMetrics}
                  illnessAndTimeMetrics={
                    relationshipBetweenIllnessAndTimeMetrics
                  }
                  illnessAndGenderMetrics={
                    relationshipBetweenIllnessAndGenderMetrics
                  }
                  title={item.title}
                  onDateRangeChange={handleDateRangeChange}
                />
              ) : item.i.includes("table") ? (
                <AcceptedPerDoctorTable
                  onRemove={() => handleRemoveItem(item.i)}
                  acceptingDoctorsResponseMetrics={
                    acceptingDoctorsResponseMetrics
                  }
                  totalCompletedConsultationTimePerDoctorMetrics={
                    totalCompletedConsultationTimePerDoctorMetrics
                  }
                  title={item.title}
                />
              ) : item.i.includes("areachart") ? (
                <AreaChartComponent
                  onRemove={() => handleRemoveItem(item.i)}
                  consultationsMetrics={consultationsMetrics}
                  ageMetrics={numberOfConsultationsByAgeSpansMetrics}
                  title={item.title}
                  onDateRangeChange={handleDateRangeChange}
                />
              ) : null}
            </Paper>
          </div>
        ))}
      </ResponsiveGridLayout>
    </>
  );
};
