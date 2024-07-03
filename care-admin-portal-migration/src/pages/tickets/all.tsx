import sortBy from "lodash/sortBy";
import useTickets from "../../helper/hooks/useTickets";
import useMyTickets from "../../helper/hooks/useMyTickets";
import { useState, useEffect } from "react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import {
  IGetAllSupportTickets,
  ISupportTicketContent,
} from "../../helper/utils/types";
import { useRouter } from "next/router";
import {
  Container,
  Box,
  Title,
  Button,
  Select,
  useMantineColorScheme,
} from "@mantine/core";
import paths from "@/components/path";

const PAGE_SIZES = [10, 15, 20, 30, 40, 50];

const Tickets = () => {
  const { colorScheme } = useMantineColorScheme();
  const [total, setTotal] = useState<IGetAllSupportTickets>();
  const [records, setRecords] = useState<ISupportTicketContent[]>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const { tickets, loading } = useTickets(page - 1, pageSize);
  const { myTickets, loadingMyTickets } = useMyTickets(page - 1, pageSize);
  const [sortTickets, setSortTickets] = useState<string | null>("All tickets");

  const [columnAccessor, setColumnAccessor] = useState<string>("");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction,
  });

  const router = useRouter();

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    setSortStatus({ columnAccessor, direction });
  }, [columnAccessor, direction]);

  useEffect(() => {
    if (sortTickets === "My tickets") {
      const data = sortBy(myTickets?.content, sortStatus.columnAccessor);
      setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
      setTotal(myTickets);
    } else {
      const data = sortBy(tickets?.content, sortStatus.columnAccessor);
      setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
      setTotal(tickets);
    }
  }, [
    tickets,
    loading,
    sortStatus,
    sortTickets,
    loadingMyTickets,
    myTickets,
    page,
    pageSize,
  ]);

  const handleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction === "desc" ? "desc" : "asc");
  };

  return (
    <Container mb={20} mt={0} maw={1600}>
      <Title mt={40} mb={20}>
        Support tickets
      </Title>
      <Box>
        <Select
          placeholder="Select sort method"
          mb={25}
          label="Sort tickets"
          data={["All tickets", "My tickets"]}
          value={sortTickets}
          onChange={setSortTickets}
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
          fetching={loading}
          totalRecords={total?.totalElements}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          /*    shadow="md" */
          withTableBorder
          withRowBorders={true}
          loadervariant="oval"
          loaderBackgroundBlur={1}
          records={records}
          sortStatus={sortStatus}
          onSortStatusChange={handleSortStatusChange}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          columns={[
            {
              accessor: "id",
              title: "Ticket ID",
              sortable: true,
              textAlignment: "left",
            },
            {
              accessor: "inquiryId",
              title: "Inquiry ID",
              sortable: true,
              textAlignment: "left",
            },
            {
              accessor: "priority",
              title: "Priority",
              sortable: true,
              textAlignment: "left",
            },
            {
              accessor: "type",
              title: "Type",
              sortable: true,
              textAlignment: "left",
            },
            {
              accessor: "status",
              title: "Status",
              textAlignment: "center",
              sortable: true,
            },
            {
              accessor: "category",
              title: "Category",
              textAlignment: "center",
              sortable: true,
            },
            {
              accessor: "handle",
              title: "Handle ticket",
              textAlignment: "center",
              sortable: false,
              render: (content) => (
                <Button
                  w={"50%"}
                  onClick={() => {
                    router.push(
                      paths.rootDirectory +
                        "/" +
                        paths.updateTicket +
                        content.id
                    );
                  }}
                >
                  Open
                </Button>
              ),
            },
          ]}
        />
      </Box>
    </Container>
  );
};

export default Tickets;
