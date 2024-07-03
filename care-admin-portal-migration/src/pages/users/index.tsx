import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import { createStyles } from "@mantine/styles";
import { ArrowAutofitRight, Search } from "tabler-icons-react";
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
  Badge,
  Modal,
  SegmentedControl,
  Divider,
  useMantineColorScheme,
} from "@mantine/core";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  IGetUsersResponse,
  IUpdateUserRequest,
} from "../../helper/utils/types";
import useUsers from "../../helper/hooks/useUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../../helper/api/index";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconBan, IconUsers } from "@tabler/icons-react";
const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[1],
    boxShadow: theme.shadows.lg,
    border: `2px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    }`,
  },
  details: {
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  modal: {
    border: "2px solid black",
  },
}));

export default function Users() {
  const paths = useContext(PathsContext);
  const router = useRouter();
  const { classes } = useStyles();
  const { users, loadingUsers } = useUsers();
  const PAGE_SIZE = 15;
  const [records, setRecords] = useState<IGetUsersResponse[]>();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const [selectedUser, setSelectedUser] = useState<IGetUsersResponse | null>(
    null
  );
  const [columnAccessor, setColumnAccessor] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [userid, setuserId] = useState<number>(0);
  const [roleSelect, setRoleSelect] = useState<string>("DISABLED");
  const [opened, setOpened] = useState(false);
  const [total, setTotal] = useState(users);
  const [filteredRecords, setFilteredRecords] = useState<
    IGetUsersResponse[] | undefined
  >([]);
  const { colorScheme } = useMantineColorScheme();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: columnAccessor,
    direction: direction === "desc" ? "desc" : "asc",
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(updateUserRole, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      showNotification({
        title: "User Role Updated Successfully",
        message: `User: ${selectedUser?.email} role updated successfully to ${roleSelect}`,
        color: "green",
        icon: <IconUsers />,
      });
      setOpened(false);
    },
    onError: () => {
      showNotification({
        title: "Error Updating User Role",
        message: `Error Updating ${selectedUser?.email} Role Updated to ${roleSelect}`,
        color: "red",
      });
    },
  });

  const handleRoleChange = () => {
    const data: IUpdateUserRequest = {
      id: userid,
      role: roleSelect,
    };

    mutate(data);
  };

  useEffect(() => {
    setSortStatus({
      columnAccessor: columnAccessor,
      direction: direction === "desc" ? "desc" : "asc",
    });
  }, [direction, columnAccessor, page, searchValue]);

  useEffect(() => {
    searchValue !== "" ? setTotal(filteredRecords) : setTotal(users);
    if (searchValue !== "" && filteredRecords !== undefined) {
      const data = sortBy(filteredRecords, sortStatus.columnAccessor);
      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    } else {
      const data = sortBy(users, sortStatus.columnAccessor);

      setRecords(
        sortStatus.direction === "desc"
          ? data.reverse().slice(startIndex, endIndex)
          : data.slice(startIndex, endIndex)
      );
    }
  }, [users, filteredRecords, searchValue, sortStatus, endIndex, startIndex]);

  useEffect(() => {
    setPage(1);
    setFilteredRecords(
      users?.filter(({ id, email, mobile, role }) => {
        if (
          searchValue !== "" &&
          !`${id} ${email} ${mobile} ${role}`
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase())
        ) {
          return false;
        }
        return true;
      })
    );
  }, [searchValue, users]);

  const onDeleteClick = (user: IGetUsersResponse) => {
    setSelectedUser(user);
    setOpened(true);
  };
  const HandleSortStatusChange = (sorting: DataTableSortStatus) => {
    setColumnAccessor(sorting.columnAccessor);
    setDirection(sorting.direction);
    setSortStatus(sorting);
    setPage(1);
  };

  return (
    <Container mb={20} maw={1250}>
      <Modal
        opened={opened}
        size="55%"
        title="Danger Zone - Change User Role"
        onClose={() => setOpened(false)}
        overlayblur={3}
        transition="fade"
        transitionduration={600}
        transitiontimingfunction="ease"
        radius="md"
      >
        <Stack>
          <Text fw={600}>
            Are you sure you want to{" "}
            <Text component="span" color="red">
              change
            </Text>{" "}
            <Text component="span">
              the role of{" "}
              <span style={{ fontWeight: "bold" }}>{selectedUser?.email}</span>
            </Text>
          </Text>
          <Text fw={600}>
            <Text>
              from {selectedUser?.role} to {roleSelect}
            </Text>
          </Text>
          <SegmentedControl
            mt={5}
            color="limegreen"
            size="sm"
            data={["DISABLED", "PATIENT", "DOCTOR", "SYSTEMADMIN"]}
            onChange={(value) => setRoleSelect(value)}
            p="10"
          />
        </Stack>

        <Group position="right" mb={30} mt={30}>
          <Button
            variant="outline"
            type="submit"
            className="btn btn-primary"
            color="red"
            onClick={handleRoleChange}
            leftSection={<IconAlertTriangle />}
          >
            Yes
          </Button>

          <Button
            variant="outline"
            color={"#05a98b"}
            type="button"
            onClick={() => {
              setSelectedUser(null);
              setOpened(false);
            }}
            className="btn btn-warning float-right"
            leftSection={<IconBan />}
          >
            No
          </Button>
        </Group>
      </Modal>
      <Title pr="20" mt={40}>
        Manage Users
      </Title>
      <Box mb="md" mt={40} display="flex">
        <TextInput
          size="md"
          placeholder="Search users ..."
          leftSection={<Search size={16} />}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
        />
        <Button
          ml="md"
          size="md"
          variant="outline"
          color="#09ac8c"
          type="button"
          onClick={() => {
            router.push(paths.rootDirectory + paths.createAdmin);
          }}
          className="btn btn-create"
        >
          Add Admin
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
          fetching={loadingUsers}
          withTableBorder
          withRowBorders={true}
          totalRecords={total?.length}
          records={records}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          sortStatus={sortStatus}
          onSortStatusChange={HandleSortStatusChange}
          idAccessor="id"
          columns={[
            { accessor: "id", title: "Id", sortable: true },
            { accessor: "email", title: "Email", sortable: true },
            { accessor: "mobile", title: "Mobile", sortable: true },
            {
              accessor: "role",
              title: "Role",
              sortable: true,
              render: (record) =>
                record.role === "SYSTEMADMIN" ? (
                  <Badge color="violet" fullWidth variant="outline">
                    {record.role}
                  </Badge>
                ) : record.role === "DOCTOR" ? (
                  <Badge variant="outline" color="blue" fullWidth>
                    {record.role}
                  </Badge>
                ) : record.role === "DISABLED" ? (
                  <Badge variant="outline" color="red" fullWidth>
                    {record.role}
                  </Badge>
                ) : (
                  <Badge variant="outline" fullWidth color="Lime">
                    {record.role}
                  </Badge>
                ),
            },
            {
              accessor: "edit",
              title: "Manage",
              width: 120,
              render: (record) => (
                <Button
                  variant="outline"
                  color={"#09ac8c"}
                  leftSection={<ArrowAutofitRight size={16} />}
                  onClick={() => {
                    setuserId(record.id);
                    onDeleteClick(record);
                  }}
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
