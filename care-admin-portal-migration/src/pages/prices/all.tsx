import {
  Box,
  Button,
  Container,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { showNotification } from "@mantine/notifications";
import { IconTrash, IconAlertTriangle, IconBan } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { ArrowAutofitRight, Search } from "tabler-icons-react";
import { deletePrice } from "../../helper/api";
import usePrices from "../../helper/hooks/usePrices";
import { IGetPriceResponse } from "../../helper/utils/types";
import sortBy from "lodash/sortBy";
import { PathsContext } from "../../components/path";

const useStyles = createStyles((theme, _params, _styles) => ({
  modalContent: {
    border: "2px solid black",
    maxWidth: "90vw", // Adjust width for responsiveness
    width: "auto",
    [theme.breakpoints.md]: {
      maxWidth: "70vw",
    },
    [theme.breakpoints.lg]: {
      maxWidth: "50vw",
    },
  },
}));

export default function Prices() {
  const paths = useContext(PathsContext);
  const router = useRouter();
  const { prices, loadingPrices } = usePrices();
  const { classes } = useStyles();
  const [records, setRecords] = useState(prices);
  const PAGE_SIZE = 15;
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const [opened, setOpened] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<IGetPriceResponse | null>(
    null
  );
  const queryClient = useQueryClient();
  const [total, setTotal] = useState(prices);
  const [filteredRecords, setFilteredRecords] = useState<
    IGetPriceResponse[] | undefined
  >([]);
  const [columnAccessor, setColumnAccessor] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const { colorScheme } = useMantineColorScheme();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: columnAccessor,
    direction: direction === "desc" ? "desc" : "asc",
  });

  const onDeleteClick = (price: IGetPriceResponse) => {
    setSelectedPrice(price);
    setOpened(true);
  };

  const handleDelete = async () => {
    try {
      if (selectedPrice?.name) {
        await deletePrice(selectedPrice?.name);
        queryClient.invalidateQueries({ queryKey: ["getPrices"] });
        queryClient.invalidateQueries({ queryKey: ["getPrice"] });
        showNotification({
          title: `Price: ${selectedPrice?.name} Deleted`,
          message: `Price: ${
            selectedPrice?.name
          }, deleted at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
          icon: <IconTrash />,
        });
        router.push(paths.rootDirectory + paths.managePrice);
        setOpened(false);
        setSelectedPrice(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setSortStatus({
      columnAccessor: columnAccessor,
      direction: direction === "desc" ? "desc" : "asc",
    });
  }, [direction, columnAccessor, page, searchValue]);

  useEffect(() => {
    searchValue !== "" ? setTotal(filteredRecords) : setTotal(prices);
    if (searchValue !== "" && filteredRecords !== undefined) {
      const data = sortBy(filteredRecords, sortStatus.columnAccessor);
      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    } else {
      const data = sortBy(prices, sortStatus.columnAccessor);

      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    }
  }, [
    prices,
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
      prices?.filter(({ name, prices }) => {
        if (
          searchValue !== "" &&
          !`${name} ${prices.price} ${prices.vat} ${prices.commission} `
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase())
        ) {
          return false;
        }
        return true;
      })
    );
  }, [searchValue, prices]);

  const HandleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction);
    setSortStatus(sorting);
    setPage(1);
  };

  return (
    <Container mb={20}>
      <Title mt={40}>Prices</Title>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
        classNames={{
          content: classes.modalContent,
        }}
        radius="md"
      >
        <Text ta={"center"} fw={600}>
          Are you sure you want to <Text component="span">delete </Text>
          the price for{" "}
          <Text fw={700}>
            {selectedPrice?.name.trim().substring(0, 1).toUpperCase()}
            {selectedPrice?.name.trim().substring(1)} ?
          </Text>
        </Text>
        <Group position="center" mb={30} mt={30}>
          <Button
            variant="outline"
            color={"#e44c3f"}
            type="submit"
            className="btn btn-primary"
            onClick={() => {
              handleDelete();
            }}
            leftSection={<IconAlertTriangle />}
          >
            Yes
          </Button>

          <Button
            variant="outline"
            color={"#05a98b"}
            type="button"
            onClick={() => {
              setSelectedPrice(null);
              setOpened(false);
            }}
            className="btn btn-warning float-right"
            leftSection={<IconBan />}
          >
            No
          </Button>
        </Group>
      </Modal>

      <Box mb={40} mt={40} display="flex">
        <TextInput
          size="md"
          placeholder="Search Prices..."
          leftSection={<Search size={16} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
        />

        <Button
          size="md"
          variant="outline"
          color="#09ac8c"
          ml={20}
          type="button"
          onClick={() => {
            router.push(paths.rootDirectory + paths.createPrice);
          }}
          className="btn btn-create"
        >
          Add Price
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
          fetching={loadingPrices}
          withTableBorder
          withRowBorders={true}
          totalRecords={total?.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          sortStatus={sortStatus}
          onSortStatusChange={HandleSortStatusChange}
          idAccessor="name"
          columns={[
            {
              accessor: "name",
              width: "20%",
              sortable: true,
              render: (record) =>
                `${record?.name
                  .trim()
                  .substring(0, 1)
                  .toUpperCase()}${record?.name.trim().substring(1)}`,
            },
            {
              accessor: "prices.price",
              width: "20%",
              title: "Price",
              sortable: true,
            },
            {
              accessor: "prices.vat",
              width: "20%",
              title: "VAT",
              sortable: true,
            },
            {
              accessor: "prices.commission",
              width: "20%",
              title: "Commission",
              sortable: true,
            },
            {
              accessor: "prices.duration",
              width: "20%",
              title: "Duration",
              sortable: true,
            },
            {
              accessor: "edit",
              width: "20%",
              render: (initialRecord: IGetPriceResponse) => (
                <Group spacing={10} position="right" nowrap="true">
                  <Button
                    variant="outline"
                    color={"#05a98b"}
                    onClick={(event) => {
                      router.replace({
                        pathname: paths.rootDirectory + paths.updatePrice,
                        query: { id: initialRecord.name },
                      });
                    }}
                  >
                    Update
                  </Button>

                  <Button
                    variant="outline"
                    color={"#e44c3f"}
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
          records={records}
        />
      </Box>
    </Container>
  );
}
