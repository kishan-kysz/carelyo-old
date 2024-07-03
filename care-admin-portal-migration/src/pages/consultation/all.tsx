import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useConsultations } from "../../helper/hooks/useConsultations";
import { Search, CircleCheck } from "tabler-icons-react";
import {
  Title,
  Box,
  TextInput,
  Container,
  Stack,
  Group,
  Text,
  Badge,
  useMantineColorScheme,
  Tooltip,
} from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { useEffect, useState } from "react";
import { IConsultationResponse } from "../../helper/utils/types";
const useStyles = createStyles((theme) => ({
  details: {
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
  label: { width: "auto" },
}));

export default function Consultations() {
  const { consultations, loadingConsultations } = useConsultations();
  const { classes } = useStyles();
  const PAGE_SIZE = 15;
  const [records, setRecords] = useState(consultations);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const { colorScheme } = useMantineColorScheme();
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const [columnAccessor, setColumnAccessor] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [total, setTotal] = useState(consultations);
  const [filteredRecords, setFilteredRecords] = useState<
    IConsultationResponse[] | undefined
  >([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: columnAccessor,
    direction: direction === "desc" ? "desc" : "asc",
  });

  useEffect(() => {
    setSortStatus({
      columnAccessor: columnAccessor,
      direction: direction === "desc" ? "desc" : "asc",
    });
  }, [direction, columnAccessor, page, searchValue]);
  useEffect(() => {
    searchValue !== "" ? setTotal(filteredRecords) : setTotal(consultations);
    if (searchValue !== "" && filteredRecords !== undefined) {
      const data = sortBy(filteredRecords, sortStatus.columnAccessor);
      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    } else {
      const data = sortBy(consultations, sortStatus.columnAccessor);

      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    }
  }, [
    filteredRecords,
    searchValue,
    sortStatus,
    endIndex,
    startIndex,
    consultations,
  ]);

  useEffect(() => {
    setPage(1);
    setFilteredRecords(
      consultations?.filter(
        ({
          consultationId,
          doctorFullName,
          patientFullName,
          timeBooked,
          timeAccepted,
          timeStarted,
          timeFinished,
          status,
        }) => {
          if (
            searchValue !== "" &&
            !`${consultationId} ${doctorFullName} ${patientFullName} ${status} 
				${new Date(timeBooked)?.toISOString().replace("T", " ").substring(0, 16)} 
				${new Date(timeAccepted)?.toISOString().replace("T", " ").substring(0, 16)} 
				${new Date(timeStarted)?.toISOString().replace("T", " ").substring(0, 16)} 
				${new Date(timeFinished)?.toISOString().replace("T", " ").substring(0, 16)}`
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase())
          ) {
            return false;
          }

          return true;
        }
      )
    );
  }, [searchValue, consultations]);

  const HandleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction);
    setSortStatus(sorting);
    setPage(1);
  };
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const reoccurance = (array: IConsultationResponse[], value: number) => {
    return array.filter((v) => v.patientId === value).length;
  };

  return (
    <Container mb={20} maw={1250}>
      <Title mt={40}>Consultations</Title>

      <Box mb="md" mt={40}>
        <TextInput
          sx={{
            flex: "1",
            border: "1px solid #b4ece5",
            borderRadius: 6,
            "& .mantine-1uz502g": {
              fontSize: 20,
            },
          }}
          placeholder="Search consultations ..."
          leftSection={<Search size={16} />}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
        />
      </Box>
      <Box display="flex">
        <DataTable
          sx={(theme) => ({
            width: 0,
            flex: 1,
            border:
              theme.colorScheme === "light"
                ? "1px solid #b4ece5"
                : "1px solid rgba(180,236,228,.3)",
            borderRadius: 6,
          })}
          borderRadius="sm"
          withColumnBorders
          highlightOnHover
          rowBorderColor={
            colorScheme === "light" ? "#b4ece5" : "rgba(180,236,228,.3)"
          }
          fetching={loadingConsultations}
          shadow="md"
          totalRecords={total?.length}
          records={records}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => handlePageChange(p)}
          sortStatus={sortStatus}
          onSortStatusChange={HandleSortStatusChange}
          rowExpansion={{
            allowMultiple: true,
            collapseProps: {
              transitionduration: 250,
              animateOpacity: false,
              transitiontimingfunction: "ease-out",
            },

            content: ({ record }) => (
              <Stack className={classes.details} p="xs" spacing={6}>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Price name:
                  </Text>
                  <Text>
                    {record?.priceListName.charAt(0).toUpperCase() +
                      record?.priceListName.slice(1)}
                  </Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Paid amount:
                  </Text>
                  <Text>{record?.amountPaid}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Times patient has booked a consultation:
                  </Text>
                  <Text>
                    {consultations &&
                      reoccurance(consultations, record.patientId)}
                  </Text>
                </Group>
              </Stack>
            ),
          }}
          idAccessor="consultationId"
          columns={[
            { accessor: "consultationId", title: "Id", sortable: true },
            { accessor: "patientFullName", title: "Patient", sortable: true },
            { accessor: "doctorFullName", title: "Doctor", sortable: true },
            {
              accessor: "timeBooked",
              title: "Booked",
              sortable: true,
              render: (record) => (
                <Text>{`${new Date(record?.timeBooked)
                  ?.toISOString()
                  .replace("T", " ")
                  .substr(0, 16)}`}</Text>
              ),
            },
            {
              accessor: "timeAccepted",
              title: "Accepted",
              sortable: true,
              render: (record) => (
                <Text>{`${new Date(record?.timeAccepted)
                  ?.toISOString()
                  .replace("T", " ")
                  .substr(0, 16)}`}</Text>
              ),
            },
            {
              accessor: "timeStarted",
              title: "Started",
              sortable: true,
              render: (record) => (
                <Text>{`${new Date(record?.timeStarted)
                  ?.toISOString()
                  .replace("T", " ")
                  .substr(0, 16)}`}</Text>
              ),
            },
            {
              accessor: "timeFinished",
              title: "Finished",
              sortable: true,
              render: (record) => (
                <Text>{`${new Date(record?.timeFinished)
                  ?.toISOString()
                  .replace("T", " ")
                  .substr(0, 16)}`}</Text>
              ),
            },
            {
              accessor: "status",
              title: "Status",
              sortable: true,
              render: (record) =>
                record?.status === "booked" ? (
                  <Badge color="blue" variant="outline" fullWidth>
                    {record?.status.charAt(0).toUpperCase() +
                      record?.status.slice(1)}
                  </Badge>
                ) : record?.status === "accepted" ? (
                  <Badge color="green" variant="outline" fullWidth>
                    {record?.status.charAt(0).toUpperCase() +
                      record?.status.slice(1)}
                  </Badge>
                ) : record?.status === "started" ? (
                  <Badge color="yellow" variant="outline" fullWidth>
                    {record?.status.charAt(0).toUpperCase() +
                      record?.status.slice(1)}
                  </Badge>
                ) : record?.status === "finished" ? (
                  <Badge color="limegreen" variant="outline" fullWidth>
                    {record?.status.charAt(0).toUpperCase() +
                      record?.status.slice(1)}
                  </Badge>
                ) : record?.status === "abandoned" ? (
                  <Badge color="red" variant="outline" fullWidth>
                    {record?.status.charAt(0).toUpperCase() +
                      record?.status.slice(1)}
                  </Badge>
                ) : record?.status === "booking" ? (
                  <Badge color="cyan" variant="outline" fullWidth>
                    {record?.status.charAt(0).toUpperCase() +
                      record?.status.slice(1)}
                  </Badge>
                ) : (
                  <Badge color="gray" variant="outline" fullWidth>
                    {record?.status.charAt(0).toUpperCase() +
                      record?.status.slice(1)}
                  </Badge>
                ),
            },
            {
              accessor: "rating",
              title: "Rating",
              width: 90,
              sortable: true,
              render: (record) => <Text align="center">{record?.rating}</Text>,
            },
            {
              accessor: "Reoccuring Patient",
              title: "Reoccuring",

              render: (record) => (
                <Text align="center">
                  {consultations &&
                  reoccurance(consultations, record.patientId) > 1 ? (
                    <Tooltip
                      multiline
                      width={220}
                      withArrow
                      transition="fade"
                      transitionduration={200}
                      label="This patient has booked more than one consultation"
                    >
                      <Box>
                        <CircleCheck
                          color={
                            colorScheme === "light" ? "green" : "limegreen"
                          }
                        />
                      </Box>
                    </Tooltip>
                  ) : null}
                </Text>
              ),
            },
          ]}
        />
      </Box>
    </Container>
  );
}
