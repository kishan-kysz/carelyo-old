import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import {
  Box,
  Modal,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  Button,
  useMantineColorScheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/styles";
import { IconTrash, IconAlertTriangle, IconBan } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { ArrowAutofitRight, Search } from "tabler-icons-react";
import useProviders from "../../helper/hooks/useProviders";
import { useRouter } from "next/router";
import { IGetProviderResponse } from "../../helper/utils/types";
import { deleteProvider } from "../../helper/api";
import { useQueryClient } from "@tanstack/react-query";

export default function Providers() {
  const { providers, loadingProviders } = useProviders();
  const router = useRouter();

  const PAGE_SIZE = 15;
  const [records, setRecords] = useState<IGetProviderResponse[]>();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const { colorScheme } = useMantineColorScheme();
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const [total, setTotal] = useState(providers);
  const [filteredRecords, setFilteredRecords] = useState<
    IGetProviderResponse[] | undefined
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
    searchValue !== "" ? setTotal(filteredRecords) : setTotal(providers);
    if (searchValue !== "" && filteredRecords !== undefined) {
      const data = sortBy(filteredRecords, sortStatus.columnAccessor);
      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    } else {
      const data = sortBy(providers, sortStatus.columnAccessor);

      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    }
  }, [
    providers,
    filteredRecords,
    searchValue,
    sortStatus,
    endIndex,
    startIndex,
  ]);

  const [opened, setOpened] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<IGetProviderResponse | null>(null);
  const queryClient = useQueryClient();
  const onDeleteClick = (provider: IGetProviderResponse) => {
    setSelectedProvider(provider);
    setOpened(true);
  };
  const handleDelete = async () => {
    try {
      if (selectedProvider?.id) {
        await deleteProvider(selectedProvider?.id);
        queryClient.invalidateQueries({ queryKey: ["getProviders"] });
        queryClient.invalidateQueries({ queryKey: ["getProvider"] });
        showNotification({
          title: `Provider: ${selectedProvider?.providerName} Deleted`,
          message: `Provider: ${
            selectedProvider?.providerName
          }, deleted at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
          icon: <IconTrash />,
        });
        router.push("/provider/all");
        setOpened(false);
        setSelectedProvider(null);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setPage(1);
    setFilteredRecords(
      providers?.filter(
        ({ id, providerName, email, phoneNumber, createdAt, updatedAt }) => {
          if (
            searchValue !== "" &&
            !`${id} ${providerName} ${email} ${phoneNumber} ${createdAt
              ?.replace("T", " ")
              .substring(0, 16)} 
				${updatedAt?.replace("T", " ").substring(0, 16)}`
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase())
          ) {
            return false;
          }
          return true;
        }
      )
    );
  }, [searchValue, providers]);

  const useStyles = createStyles((theme) => ({
    details: {
      background:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
    label: { width: "auto" },
    modal: {
      border: "2px solid black",
    },
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
      <Title mt={40}>Providers</Title>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        overlayblur={3}
        transition="fade"
        transitionduration={600}
        transitiontimingfunction="ease"
        classNames={{
          modal: classes.modal,
        }}
        radius="md"
      >
        <Text ta={"center"} fw={600}>
          Are you sure you want to delete this provider:{" "}
          <Text fw={700}>{selectedProvider?.providerName} ?</Text>
        </Text>
        <Group position="center" mb={30} mt={30}>
          <Button
            type="submit"
            size="md"
            variant="outline"
            color="#e44c3f"
            onClick={() => {
              handleDelete();
            }}
            leftSection={<IconAlertTriangle />}
          >
            Yes
          </Button>

          <Button
            type="button"
            size="md"
            variant="outline"
            color="#09ac8c"
            onClick={() => {
              setSelectedProvider(null);
              setOpened(false);
            }}
            className="btn btn-warning float-right"
            leftSection={<IconBan />}
          >
            No
          </Button>
        </Group>
      </Modal>
      <Box mb="md" mt={40} display="flex">
        <TextInput
          mb="md"
          size="md"
          placeholder="Search Consultation..."
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
            router.push("/provider/create");
          }}
          className="btn btn-create"
        >
          Add Provider
        </Button>
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
          shadow="md"
          fetching={loadingProviders}
          totalRecords={total?.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          records={records}
          sortStatus={sortStatus}
          onSortStatusChange={HandleSortStatusChange}
          rowExpansion={{
            collapseProps: {
              transitionduration: 250,
              animateOpacity: false,
              transitiontimingfunction: "ease-out",
            },
            content: ({ record }) => (
              <Stack className={classes.details} p="xs" spacing={6}>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Address:
                  </Text>
                  <Text>{record.address}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Practice number:
                  </Text>
                  <Text>{record.practiceNumber}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Website:
                  </Text>
                  <Text></Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Secondary email:
                  </Text>
                  <Text>{record.secondaryEmail}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Created at:
                  </Text>
                  <Text>{record.createdAt}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Updated at:
                  </Text>
                  <Text>{record.updatedAt}</Text>
                </Group>
              </Stack>
            ),
          }}
          columns={[
            { accessor: "id", title: "Id", sortable: true },
            { accessor: "providerName", title: "Name", sortable: true },
            { accessor: "email", title: "Email", sortable: true },
            { accessor: "phoneNumber", title: "Phone", sortable: true },
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
              width: 240,
              render: (initialRecord: IGetProviderResponse) => (
                <Group spacing={10} position="right" nowrap="true">
                  <Button
                    size="md"
                    variant="outline"
                    color="#09ac8c"
                    onClick={() => {
                      router.push({
                        pathname: "/provider/update",
                        query: { id: initialRecord.id },
                      });
                    }}
                    leftSection={<ArrowAutofitRight size={16} />}
                  >
                    Update
                  </Button>
                  <Button
                    size="md"
                    variant="outline"
                    color="#e44c3f"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteClick(initialRecord);
                    }}
                    leftSection={<IconTrash size={16} />}
                  >
                    Delete
                  </Button>
                </Group>
              ),
            },
          ]}
        />
      </Box>
    </Container>
  );
}
