import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import usePeople from "../../helper/hooks/usePeople";
import {
  Button,
  Title,
  Box,
  TextInput,
  Container,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { useRouter } from "next/router";
import { ArrowAutofitRight, Search } from "tabler-icons-react";
import { useEffect, useState, useContext } from "react";
import { PathsContext } from "../../components/path";
import { IGetDoctorsResponse } from "../../helper/utils/types";

export default function Doctors() {
  const paths = useContext(PathsContext);
  const { doctors, loadingDoctors } = usePeople();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const PAGE_SIZE = 15;
  const [records, setRecords] = useState<IGetDoctorsResponse[]>();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(doctors);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const [columnAccessor, setColumnAccessor] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [filteredRecords, setFilteredRecords] = useState<
    IGetDoctorsResponse[] | undefined
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
    searchValue !== "" ? setTotal(filteredRecords) : setTotal(doctors);
    if (searchValue !== "" && filteredRecords !== undefined) {
      const data = sortBy(filteredRecords, sortStatus.columnAccessor);
      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    } else {
      const data = sortBy(doctors, sortStatus.columnAccessor);

      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    }
  }, [doctors, filteredRecords, searchValue, sortStatus, endIndex, startIndex]);

  useEffect(() => {
    setPage(1);
    setFilteredRecords(
      doctors?.filter(({ userId, email, mobile, createdAt, updatedAt }) => {
        if (
          searchValue !== "" &&
          !`${userId} ${mobile} ${email} ${createdAt
            ?.replace("T", " ")
            .substr(0, 16)} 
				${updatedAt?.replace("T", " ").substring(0, 16)}`
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase())
        ) {
          return false;
        }
        return true;
      })
    );
  }, [searchValue, doctors]);

  const useStyles = createStyles((theme) => ({
    details: {
      background:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
    label: { width: "auto" },
  }));
  const { classes } = useStyles();
  const HandleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction);
    setSortStatus(sorting);
    setPage(1);
  };
  return (
    <Container mb={20} maw={1250}>
      <Title mt={40}>Doctors</Title>

      <Box mb="md" mt={40} display="flex">
        <TextInput
          size="md"
          placeholder="Search Doctors..."
          leftSection={<Search size={16} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
        />
        <Button
          variant="outline"
          color="#09ac8c"
          size="md"
          ml={20}
          type="button"
          onClick={() => {
            router.replace(paths.rootDirectory + paths.createDoctors);
          }}
          className="btn btn-create"
        >
          Add Doctor
        </Button>
      </Box>

      <Box>
        <DataTable
          borderRadius="sm"
          withColumnBorders
          highlightOnHover
          rowBorderColor={
            colorScheme === "light" ? "#b4ece5" : "rgba(180,236,228,.3)"
          }
          fetching={loadingDoctors}
          totalRecords={total?.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          withTableBorder
          withRowBorders={true}
          records={records}
          sortStatus={sortStatus}
          onSortStatusChange={HandleSortStatusChange}
          rowExpansion={{
            collapseProps: {
              transitionDuration: 250,
              animateOpacity: false,
              transitiontimingfunction: "ease-out",
            },
            content: ({ record }) => (
              <Stack className={classes.details} p="xs">
                <Group>
                  <Text fw={700} className={classes.label}>
                    First name:
                  </Text>
                  <Text>{record.firstName}</Text>
                </Group>
                <Group>
                  <Text fw={700} className={classes.label}>
                    Last name:
                  </Text>
                  <Text>{record.lastName}</Text>
                </Group>
                <Group>
                  <Text fw={700} className={classes.label}>
                    MDCN:
                  </Text>
                  <Text>{record.medicalCertificate?.certificateNumber}</Text>
                </Group>
                <Group>
                  <Text fw={700} className={classes.label}>
                    MDCN issued date:
                  </Text>
                  <Text>
                    {record.medicalCertificate?.issuedDate
                      ?.toString()
                      .substring(0, 10)}
                  </Text>
                </Group>
                <Group>
                  <Text fw={700} className={classes.label}>
                    MDCN expiration date:
                  </Text>
                  <Text>
                    {record.medicalCertificate?.expirationDate
                      ?.toString()
                      .substring(0, 10)}
                  </Text>
                </Group>
                <Group>
                  <Text fw={700} className={classes.label}>
                    Hospital:
                  </Text>
                  <Text>{record.hospital}</Text>
                </Group>
                <Group>
                  <Text fw={700} className={classes.label}>
                    National id Number:
                  </Text>
                  <Text>{record.nationalIdNumber}</Text>
                </Group>
              </Stack>
            ),
          }}
          idAccessor="userId"
          columns={[
            {
              accessor: "userId",
              title: "User Id",
              sortable: true,
              textAlign: "left",
            },
            { accessor: "email", sortable: true },
            { accessor: "mobile", sortable: true },
            {
              accessor: "createdAt",
              title: "Created Date",
              sortable: true,
              render: (record) => (
                <Text>
                  {record?.createdAt?.replace("T", " ").substr(0, 16)}
                </Text>
              ),
            },
            {
              accessor: "updatedAt",
              title: "Updated Date",
              sortable: true,
              render: (record) => (
                <Text>
                  {record?.updatedAt?.replace("T", " ").substr(0, 16)}
                </Text>
              ),
            },
            {
              accessor: "edit",
              width: 135,
              render: (initialRecord: IGetDoctorsResponse) => (
                <Button
                  size="md"
                  variant="outline"
                  color={"#09ac8c"}
                  onClick={() => {
                    router.push({
                      pathname: paths.rootDirectory + paths.updateDoctors,
                      query: { id: initialRecord.userId },
                    });
                  }}
                  leftSection={<ArrowAutofitRight size={16} />}
                >
                  Update
                </Button>
              ),
            },
          ]}
        />
      </Box>
    </Container>
  );
}
