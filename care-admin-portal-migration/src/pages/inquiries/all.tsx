import sortBy from "lodash/sortBy";
import { useEffect, useState } from "react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import {
  Box,
  Button,
  Container,
  Grid,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import InquiryPreview from "../../components/inquiry/InquiryPreview";
import useInquiries from "../../helper/hooks/useInquiries";
import {
  IGetAllInquiriesContent,
  IGetAllInquiriesResponse,
} from "../../helper/utils/types";
import StatusBadge from "../../components/inquiry/StatusBadge";
import { IconArrowAutofitRight } from "@tabler/icons-react";

export default function Inquiries() {
  const PAGE_SIZE = 15;
  const [selectedId, setSelectedId] = useState<number>();
  const [page, setPage] = useState(1);
  const [columnAccessor, setColumnAccessor] = useState<string>("");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction,
  });
  const [records, setRecords] = useState<IGetAllInquiriesContent[]>([]);
  const [total, setTotal] = useState<IGetAllInquiriesResponse>();

  const { inquiries, loading } = useInquiries(page - 1, PAGE_SIZE);
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    setSortStatus({ columnAccessor, direction });
  }, [columnAccessor, direction]);

  useEffect(() => {
    const data = sortBy(inquiries?.content, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
    setTotal(inquiries);
  }, [inquiries, sortStatus]);

  const handleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction === "desc" ? "desc" : "asc");
  };

  return (
    <Container mb={20} mt={50} maw={1450}>
      <Title mt={50} mb={40}>
        Inquiries
      </Title>
      <Grid>
        <Grid.Col span={selectedId ? 6 : 12}>
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
              recordsPerPage={PAGE_SIZE}
              page={page}
              onPageChange={(p) => setPage(p)}
              shadow="md"
              loadervariant="oval"
              loaderBackgroundBlur={1}
              records={records}
              sortStatus={sortStatus}
              onSortStatusChange={handleSortStatusChange}
              columns={[
                {
                  accessor: "id",
                  title: "ID",
                  sortable: true,
                  textAlignment: "left",
                },
                {
                  accessor: "subject",
                  title: "Subject",
                  sortable: true,
                  textAlignment: "left",
                  render: (content) =>
                    content.subject.length > 30
                      ? `${content.subject.slice(0, 30)}...`
                      : content.subject,
                },
                {
                  accessor: "createdAt",
                  title: "Submitted",
                  textAlignment: "left",
                  render: (content) => `${content.createdAt.substring(0, 10)}`,
                },
                {
                  accessor: "status",
                  title: "Status",
                  width: 130,
                  textAlignment: "center",
                  sortable: false,
                  render: (content) => <StatusBadge status={content.status} />,
                },
                {
                  accessor: "view",
                  title: "View",

                  textAlignment: "center",
                  sortable: false,
                  render: (content) => (
                    <Button
                      onClick={() => setSelectedId(content?.id)}
                      variant="outline"
                      color={"#09ac8c"}
                      rightleftSection={<IconArrowAutofitRight size={16} />}
                    >
                      View
                    </Button>
                  ),
                },
              ]}
            />
          </Box>
        </Grid.Col>
        <Grid.Col span={6}>
          {selectedId ? (
            <Box>
              <InquiryPreview id={selectedId} />
            </Box>
          ) : undefined}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
