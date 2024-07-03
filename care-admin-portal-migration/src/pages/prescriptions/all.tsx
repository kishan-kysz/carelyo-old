import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import { ArrowAutofitRight, Search } from "tabler-icons-react";
import { createStyles } from "@mantine/styles";
import { PathsContext } from "../../components/path";
import {
  Title,
  Box,
  TextInput,
  Container,
  Stack,
  Group,
  Text,
  Button,
  useMantineColorScheme,
} from "@mantine/core";
import { useEffect, useState, useContext } from "react";
import { usePrescriptions } from "../../helper/hooks/usePrescriptions";
import { useRouter } from "next/router";
import { IGetPrescriptionsResponse } from "../../helper/utils/types";

const useStyles = createStyles((theme) => ({
  details: {
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
  label: { width: "auto" },
}));

export default function Prescriptions() {
  const paths = useContext(PathsContext);
  const router = useRouter();
  const { classes } = useStyles();
  const { prescriptions, loadingPrescriptions } = usePrescriptions();
  const PAGE_SIZE = 15;
  const [records, setRecords] = useState<IGetPrescriptionsResponse[]>();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const [total, setTotal] = useState(prescriptions);
  const [filteredRecords, setFilteredRecords] = useState<
    IGetPrescriptionsResponse[] | undefined
  >([]);
  const [columnAccessor, setColumnAccessor] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const { colorScheme } = useMantineColorScheme();

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
    searchValue !== "" ? setTotal(filteredRecords) : setTotal(prescriptions);
    if (searchValue !== "" && filteredRecords !== undefined) {
      const data = sortBy(filteredRecords, sortStatus.columnAccessor);
      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    } else {
      const data = sortBy(prescriptions, sortStatus.columnAccessor);

      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    }
  }, [
    prescriptions,
    filteredRecords,
    searchValue,
    sortStatus,
    endIndex,
    startIndex,
    page,
  ]);

  useEffect(() => {
    setPage(1);
    setFilteredRecords(
      prescriptions?.filter(
        ({ id, issuerName, illness, status, issueDate }) => {
          if (
            searchValue !== "" &&
            !`${id} ${issuerName} ${illness} ${issueDate} 
				${status}`
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase())
          ) {
            return false;
          }
          return true;
        }
      )
    );
  }, [searchValue, prescriptions]);

  const HandleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction);
    setSortStatus(sorting);
    setPage(1);
  };

  return (
    <Container mb={20} maw={1250}>
      <Title mt={50}>Prescriptions</Title>

      <Box mb="md" mt={40}>
        <TextInput
          size="md"
          br="md"
          placeholder="Search prescriptions ..."
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
          fetching={loadingPrescriptions}
          withTableBorder
          withRowBorders={true}
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
                    Withdrawals:
                  </Text>
                  <Text>{record?.withdrawals}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Amount per withdrawal:
                  </Text>
                  <Text>{record?.amountPerWithdrawal}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Dosage:
                  </Text>
                  <Text>{record?.dosage}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Frequency:
                  </Text>
                  <Text>{record?.frequency}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Medication strength:
                  </Text>
                  <Text>{record?.medicationStrength}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Medication type:
                  </Text>
                  <Text>{record?.medicationType}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Quantity:
                  </Text>
                  <Text>{record?.quantity}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Treatment duration:
                  </Text>
                  <Text>{record?.treatmentDuration}</Text>
                </Group>
              </Stack>
            ),
          }}
          idAccessor="id"
          columns={[
            { accessor: "id", title: "Id", sortable: true },
            { accessor: "issuerName", title: "Doctor", sortable: true },
            { accessor: "medicationName", title: "Medication", sortable: true },
            { accessor: "illness", title: "Illness", sortable: true },
            {
              accessor: "status",
              sortable: true,

              title: "Status",
              render: (record) => (
                <Text>
                  {record?.status.charAt(0).toUpperCase() +
                    record?.status.slice(1)}
                </Text>
              ),
            },
            {
              accessor: "issueDate",
              title: "Issued at",

              sortable: true,
              render: (record) => (
                <Text>{`${new Date(record?.issueDate)
                  ?.toISOString()
                  .replace("T", " ")
                  .substring(0, 16)}`}</Text>
              ),
            },
            {
              accessor: "edit",
              title: "Full info",
              width: 105,
              render: (record) => (
                <Button
                  variant="outline"
                  color="#09ac8c"
                  leftSection={<ArrowAutofitRight size={16} />}
                  onClick={() => {
                    router.push({
                      pathname: paths.rootDirectory + paths.browsePrescription,
                      query: { id: record.id },
                    });
                  }}
                >
                  View
                </Button>
              ),
            },
          ]}
        />
      </Box>
    </Container>
  );
}
