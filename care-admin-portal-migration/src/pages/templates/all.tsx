import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { ArrowAutofitRight } from "tabler-icons-react";
import { useGetAllTemplates } from "../../helper/hooks/useTemplates";
import { IGetTemplateResponse } from "../../helper/utils/types";
import { createStyles } from "@mantine/styles";
import { PathsContext } from "../../components/path";
export default function Templates() {
  const paths = useContext(PathsContext);
  const router = useRouter();
  const { templates, loadingTemplates } = useGetAllTemplates();
  const initialRecords = templates;
  const [records, setRecords] = useState(initialRecords);
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const { colorScheme } = useMantineColorScheme();
  useEffect(() => {
    setRecords(initialRecords?.slice(startIndex, endIndex));
  }, [page, templates, initialRecords, startIndex, endIndex]);

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

  return (
    <Container mb={20} maw={1250}>
      <Title mt={20} mb={20}>
        Templates
      </Title>

      <Box>
        <DataTable
          minHeight={500}
          borderRadius="sm"
          /* withColumnBorders */
          highlightOnHover
          rowBorderColor={
            colorScheme === "light" ? "#b4ece5" : "rgba(180,236,228,.3)"
          }
          fetching={loadingTemplates}
          /* 	withTableBorder */
          withRowBorders={false}
          totalRecords={initialRecords?.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          idAccessor="id"
          columns={[
            {
              accessor: "id",
            },
            {
              accessor: "templateType",
              title: "Type",
            },
            {
              accessor: "edit",
              width: 135,
              render: (initialRecord: IGetTemplateResponse) => (
                <Group spacing={10} position="center" nowrap="true">
                  <Button
                    variant="outline"
                    color={"#f39c12"}
                    onClick={() => {
                      router.push(
                        `${paths.rootDirectory}${paths.updateTemplate}?id=${initialRecord.templateType}`
                      );
                    }}
                    leftSection={<ArrowAutofitRight size={16} />}
                  >
                    Update
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
