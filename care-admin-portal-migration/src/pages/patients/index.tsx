import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import usePeople from "../../helper/hooks/usePeople";
import { useRouter } from "next/router";
import { ArrowAutofitRight, Search } from "tabler-icons-react";
import {
  Button,
  Title,
  Box,
  TextInput,
  Container,
  Stack,
  Group,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { useEffect, useState, useContext } from "react";
import { IGetPatientsResponse } from "../../helper/utils/types";
import { PathsContext } from "../../components/path";
const useStyles = createStyles((theme) => ({
  details: {
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
  label: { width: "auto" },
}));
export default function Patients() {
  const paths = useContext(PathsContext);
  const { patients, loadingPatients } = usePeople();
  const router = useRouter();
  const { classes } = useStyles();
  const PAGE_SIZE = 15;
  const [records, setRecords] = useState<IGetPatientsResponse[]>();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(patients);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const { colorScheme } = useMantineColorScheme();
  const [columnAccessor, setColumnAccessor] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [filteredRecords, setFilteredRecords] = useState<
    IGetPatientsResponse[] | undefined
  >([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: columnAccessor,
    direction: direction === "desc" ? "desc" : "asc",
  });

  useEffect(() => {
    searchValue !== "" ? setTotal(filteredRecords) : setTotal(patients);
    if (searchValue !== "" && filteredRecords !== undefined) {
      const data = sortBy(filteredRecords, sortStatus.columnAccessor);
      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    } else {
      const data = sortBy(patients, sortStatus.columnAccessor);

      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    }
  }, [
    patients,
    filteredRecords,
    searchValue,
    sortStatus,
    endIndex,
    startIndex,
  ]);

  useEffect(() => {
    setSortStatus({
      columnAccessor: columnAccessor,
      direction: direction === "desc" ? "desc" : "asc",
    });
  }, [direction, columnAccessor, page, searchValue]);

  useEffect(() => {
    setPage(1);
    setFilteredRecords(
      patients?.filter(({ userId, email, mobile, createdAt, updatedAt }) => {
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
  }, [searchValue, patients]);

  const HandleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction);
    setSortStatus(sorting);
    setPage(1);
  };

  return (
    <Container mb={20} maw={1250}>
      <Title mt={40}>Patients</Title>

      <Box mb="md" mt={40} display="flex">
        <TextInput
          size="md"
          placeholder="Search patients ..."
          leftSection={<Search size={16} />}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
        />
        <Button
          variant="outline"
          color="#09ac8c"
          size="md"
          ml={20}
          type="button"
          onClick={() => {
            router.push("/patients/create");
          }}
          className="btn btn-create"
        >
          Add Patient
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
          fetching={loadingPatients}
          shadow="md"
          totalRecords={total?.length}
          records={records}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          idAccessor="userId"
          sortStatus={sortStatus}
          onSortStatusChange={HandleSortStatusChange}
          columns={[
            { accessor: "userId", title: "User Id", sortable: true },
            { accessor: "email", sortable: true },
            { accessor: "mobile", sortable: true },
            {
              accessor: "createdAt",
              title: "Created At",
              sortable: true,
              render: (record) => (
                <Text>
                  {record?.createdAt?.replace("T", " ").substr(0, 16)}
                </Text>
              ),
            },
            {
              accessor: "updatedAt",
              title: "Updated At",
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
              render: (initialRecord: IGetPatientsResponse) => (
                <Button
                  variant="outline"
                  color={"#09ac8c"}
                  size="md"
                  onClick={() => {
                    router.push({
                      pathname: paths.rootDirectory + paths.updatePatients,
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
