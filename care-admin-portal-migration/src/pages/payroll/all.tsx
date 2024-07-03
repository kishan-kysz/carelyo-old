import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { createStyles } from "@mantine/styles";
import {
  Button,
  Modal,
  Title,
  Box,
  TextInput,
  Container,
  Stack,
  Group,
  Text,
  useMantineColorScheme,
  Badge,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { usePayroll } from "../../helper/hooks/usePayroll";
import { IGetPayrollResponse } from "../../helper/utils/types";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { setPayoutAsPaid } from "../../helper/api/index";

import { AnyObject } from "yup";
import { showNotification } from "@mantine/notifications";
import {
  IconSearch,
  IconReportMedical,
  IconNotes,
  IconAlertCircle,
  IconBan,
  IconCheck,
} from "@tabler/icons-react";
import { getResponseErrorMessages } from "../../helper/utils/getResponseErrorMessages";

export default function Payroll() {
  const [isSetAsPaidModalOpened, setIsSetAsPaidModalOpened] = useState(false);
  let { payroll, payrollCurrent, payrollHistory, loading } = usePayroll();
  const [isLoading, setIsLoading] = useState(loading);
  const queryClient = new QueryClient();
  const { colorScheme } = useMantineColorScheme();
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<IGetPayrollResponse[]>();
  const [searchValue, setSearchValue] = useState("");
  const [total, setTotal] = useState(payroll);
  const [filteredRecords, setFilteredRecords] = useState<
    IGetPayrollResponse[] | undefined
  >([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [reference, setReference] = useState<string>("");

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

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
    searchValue !== "" ? setTotal(filteredRecords) : setTotal(payroll);
    if (searchValue !== "" && filteredRecords !== undefined) {
      const data = sortBy(filteredRecords, sortStatus.columnAccessor);
      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    } else {
      const data = sortBy(payroll, sortStatus.columnAccessor);

      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    }
  }, [payroll, filteredRecords, searchValue, sortStatus, endIndex, startIndex]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setPage(1);
    setFilteredRecords(
      payroll?.filter(
        ({ id, priceListName, serviceId, toBePaidOut, updatedAt }) => {
          if (
            searchValue === "" ||
            `${id} ${priceListName} ${serviceId} ${toBePaidOut} ${updatedAt
              ?.replace("T", " ")
              .substr(0, 16)}`
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase()) ||
            ("ispaid"
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase()) && payrollHistory
              ? payrollHistory.filter((e) => e.id === id).length > 0
              : false) ||
            ("unpaid"
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase()) && payrollCurrent
              ? payrollCurrent.filter((e) => e.id === id).length > 0
              : false)
          ) {
            return true;
          }
        }
      )
    );
  }, [searchValue, payroll, payrollCurrent, payrollHistory]);

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

  const setPaymentAsPaid = () => {
    if (serviceId !== undefined && reference !== undefined) {
      const data = { serviceId, reference };
      setIsLoading(true);
      mutate(data);
    }
  };
  const { mutate } = useMutation(setPayoutAsPaid, {
    onSuccess: () => {
      setIsLoading(false);
      setServiceId("");
      setReference("");
      queryClient.resetQueries({ queryKey: ["getPayrollCurrent"] });
      queryClient.resetQueries({ queryKey: ["getPayrollHistory"] });

      showNotification({
        title: "Payment set as paid",
        message: `Payment set as paid at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
        icon: <IconReportMedical />,
      });

      setColumnAccessor("updatedAt");
    },
    onError: (errs: AnyObject) => {
      setIsLoading(false);
      const responseErrorMessages = getResponseErrorMessages(
        errs.response.data.errors,
        []
      );

      showNotification({
        title: "Error",
        message: `${responseErrorMessages["backend"].toString()}`,
        icon: <IconAlertCircle />,
        autoClose: false,
        color: "red",
      });
    },
  });
  const HandleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction);
    setSortStatus(sorting);
    setPage(1);
  };

  return (
    <Container mb={20} maw={1250}>
      <Modal
        opened={isSetAsPaidModalOpened}
        onClose={() => setIsSetAsPaidModalOpened(false)}
        classNames={{
          modal: classes.modal,
        }}
        radius="md"
        overlayblur={3}
        transition="fade"
        transitionduration={600}
        transitiontimingfunction="ease"
      >
        <Title order={5}>
          Are you sure you want to set the payment as paid?
        </Title>
        <TextInput
          mt={20}
          label="Reference"
          placeholder="Add a reference ..."
          leftSection={<IconNotes size={16} />}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setReference(event.currentTarget.value);
              setPaymentAsPaid();
              setIsSetAsPaidModalOpened(false);
            }
          }}
          onBlur={(event) => setReference(event.currentTarget.value)}
        />
        <Group position="center" mb={30} mt={30}>
          <Button
            type="submit"
            className="btn btn-primary"
            color="Green"
            onClick={() => {
              setPaymentAsPaid();
              setIsSetAsPaidModalOpened(false);
            }}
            leftSection={<IconCheck />}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => {
              setIsSetAsPaidModalOpened(false);
            }}
            className="btn btn-warning float-right"
            color="red"
            leftSection={<IconBan />}
          >
            No
          </Button>
        </Group>
      </Modal>

      <Box mb="md" mt={20}>
        <Title pr="20">Payroll</Title>
        <TextInput
          mt="20"
          placeholder="Search Patients..."
          leftSection={<IconSearch size={16} />}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
        />
      </Box>
      <Box>
        <DataTable
          shadow="md"
          minHeight={500}
          borderRadius="sm"
          withColumnBorders
          highlightOnHover
          rowBorderColor={
            colorScheme === "light" ? "#b4ece5" : "rgba(180,236,228,.3)"
          }
          fetching={isLoading}
          withTableBorder
          withRowBorders={true}
          records={records}
          totalRecords={total?.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          sortStatus={sortStatus}
          onSortStatusChange={HandleSortStatusChange}
          rowExpansion={{
            content: ({ record }) => (
              <Stack className={classes.details} p="xs" spacing={6}>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Paystack Reference:
                  </Text>
                  <Text>{record.payStackRef}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Date On Payroll:
                  </Text>
                  <Text>{record.dateOnPayroll}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Date On Payslip:
                  </Text>
                  <Text>{record.dateOnPayslip}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Date Paid Out:
                  </Text>
                  <Text>{record.datePaidOut}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Paid By UserId:
                  </Text>
                  <Text>{record.paidByUserId}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Price:
                  </Text>
                  <Text>{record.price}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    VAT:
                  </Text>
                  <Text>{record.vat}</Text>
                </Group>
                <Group spacing={6}>
                  <Text fw={700} className={classes.label}>
                    Commission:
                  </Text>
                  <Text>{record.commission}</Text>
                </Group>
              </Stack>
            ),
          }}
          columns={[
            { accessor: "id", title: "Payment Id", sortable: true },
            {
              accessor: "priceListName",
              title: "Price Name",
              sortable: true,
              render: (record) => (
                <Text>
                  {record?.priceListName.charAt(0).toUpperCase() +
                    record?.priceListName.slice(1)}{" "}
                </Text>
              ),
            },
            { accessor: "serviceId", title: "Service Id", sortable: true },
            {
              accessor: "toBePaidOut",
              width: 150,
              title: "To Be Paid Out",
              sortable: true,
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
              accessor: "Set As Paid",
              title: "Set As Paid",
              width: 160,
              textAlignment: "left",
              sortable: true,
              render: (record) =>
                payrollCurrent !== undefined &&
                payrollCurrent.filter((e) => e.id === record.id).length > 0 ? (
                  <Button
                    variant="outline"
                    color={"#fa5252"}
                    onClick={(event) => {
                      event.stopPropagation();
                      setServiceId(record.serviceId.toString());
                      setIsSetAsPaidModalOpened(true);
                    }}
                    leftSection={<IconCheck size={16} />}
                  >
                    Set As Paid
                  </Button>
                ) : (
                  <Badge w="98%" variant="outline">
                    Paid
                  </Badge>
                ),
            },
          ]}
        />
      </Box>
    </Container>
  );
}
