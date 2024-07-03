import { useRouter } from "next/router";
import useInquiriesByUserId from "../../helper/hooks/useInquiriesByUserId";
import { useEffect, useState } from "react";
import {
  IGetAllInquiriesContent,
  IGetAllInquiriesResponse,
} from "../../helper/utils/types";
import { DataTable } from "mantine-datatable";
import {
  Container,
  Title,
  Box,
  Grid,
  useMantineColorScheme,
  Button,
} from "@mantine/core";
import InquiryPreview from "../../components/inquiry/InquiryPreview";
import { IconArrowAutofitRight } from "@tabler/icons-react";
import StatusBadge from "../../components/inquiry/StatusBadge";

const InquiriesByUser = () => {
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();
  const { userId } = router.query;
  const [selectedId, setSelectedId] = useState<number>();
  const [records, setRecords] = useState<IGetAllInquiriesContent[]>();
  const [total, setTotal] = useState<IGetAllInquiriesResponse>();
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const { inquiries, loading } = useInquiriesByUserId(
    Number(userId),
    page - 1,
    PAGE_SIZE
  );

  useEffect(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
  }, [page, loading]);

  useEffect(() => {
    setRecords(inquiries?.content);
    setTotal(inquiries);
  }, [inquiries]);

  return (
    <Container mb={20} mt={50} maw={1250}>
      <Title align="center" mb={50}>
        Inquiries By UserID: {userId}
      </Title>
      <Grid>
        <Grid.Col span={6}>
          <Box display="flex">
            <DataTable
              sx={(theme) => ({
                width: 625,
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
              fetching={loading}
              totalRecords={inquiries?.totalElements}
              recordsPerPage={PAGE_SIZE}
              page={page}
              onPageChange={(p) => setPage(p)}
              shadow="md"
              loadervariant="bars"
              loaderSize="lg"
              records={records}
              idAccessor="subject"
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
                      size="xs"
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
          <Box>
            {selectedId ? <InquiryPreview id={selectedId} /> : undefined}
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default InquiriesByUser;
