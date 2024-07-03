import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import { Search } from "tabler-icons-react";
import {
  Title,
  Box,
  TextInput,
  Container,
  Stack,
  Group,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import useLabRequests from "../../helper/hooks/useLabRequests";
import { createStyles } from "@mantine/styles";
import { IGetLabRequestsResponse } from "../../helper/utils/types";
const useStyles = createStyles((theme) => ({
  details: {
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
  label: { width: "auto", wordWrap: "break-word", wordBreak: "break-word" },
}));

export default function LabRequests() {
  const { classes } = useStyles();

  const { labRequests, loadingLabRequests } = useLabRequests();
  const PAGE_SIZE = 15;
  const [records, setRecords] = useState(labRequests);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const { colorScheme } = useMantineColorScheme();
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const [total, setTotal] = useState(labRequests);
  const [filteredRecords, setFilteredRecords] = useState<
    IGetLabRequestsResponse[] | undefined
  >([]);
  const [columnAccessor, setColumnAccessor] = useState<string>("");
  const [direction, setDirection] = useState<string>("");

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
    searchValue !== "" ? setTotal(filteredRecords) : setTotal(labRequests);
    if (searchValue !== "" && filteredRecords !== undefined) {
      const data = sortBy(filteredRecords, sortStatus.columnAccessor);
      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    } else {
      const data = sortBy(labRequests, sortStatus.columnAccessor);

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
    labRequests,
  ]);
  useEffect(() => {
    setPage(1);
    setFilteredRecords(
      labRequests?.filter(({ id, doctorName, patientName, reason }) => {
        if (
          searchValue !== "" &&
          !`${id} ${doctorName} ${patientName} ${patientName} 
				${reason}`
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase())
        ) {
          return false;
        }
        return true;
      })
    );
  }, [searchValue, labRequests]);

  const HandleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction);
    setSortStatus(sorting);
    setPage(1);
  };

  return (
    <Container mb={20} maw={1250}>
      <Title mt={50}>Lab Requests</Title>

      <Box mb="md" mt={40}>
        <TextInput
          size="md"
          mb="md"
          placeholder="Search labrequests ..."
          leftSection={<Search size={16} />}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
        />
      </Box>
      <Box>
        <DataTable
          minHeight={500}
          borderRadius="sm"
          withColumnBorders
          highlightOnHover
          rowBorderColor={
            colorScheme === "light" ? "#b4ece5" : "rgba(180,236,228,.3)"
          }
          fetching={loadingLabRequests}
          shadow="md"
          totalRecords={total?.length}
          records={records}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
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
                    Reason:
                  </Text>
                  <Text>{record?.reason}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Test:
                  </Text>
                  <Text>{record?.test}</Text>
                </Group>
              </Stack>
            ),
          }}
          idAccessor="id"
          columns={[
            { accessor: "id", title: "Id", sortable: true },
            { accessor: "doctorName", title: "Doctor", sortable: true },
            { accessor: "patientName", title: "Patient", sortable: true },
            {
              accessor: "createdAt",
              title: "Created at",

              sortable: true,
              render: (record) => (
                <Text>{`${new Date(record?.createdAt)
                  ?.toISOString()
                  .replace("T", " ")
                  .substring(0, 16)}`}</Text>
              ),
            },
            {
              accessor: "updatedAt",
              title: "Updated at",

              sortable: true,
              render: (record) => (
                <Text>{`${new Date(record?.updatedAt)
                  ?.toISOString()
                  .replace("T", " ")
                  .substring(0, 16)}`}</Text>
              ),
            },
          ]}
        />
      </Box>
    </Container>
  );
}
