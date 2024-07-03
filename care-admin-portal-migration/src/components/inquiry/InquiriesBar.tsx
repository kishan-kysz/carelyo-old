import {
  Box,
  Button,
  useMantineColorScheme,
  ActionIcon,
  TextInput,
  Text,
  Menu,
  NumberInput,
  Select,
  useMantineTheme,
  Image,
} from "@mantine/core";
import { Search, ListNumbers, X } from "tabler-icons-react";
import {
  Fragment,
  useState,
  KeyboardEvent,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useInquiriesByQuery } from "../../helper/hooks/useInquiriesByQuery";
import { useDebouncedValue } from "@mantine/hooks";
import { PathsContext } from "../../components/path";

import { useMediaQuery } from "@mantine/hooks";

import { useRouter } from "next/router";
import StatusBadge from "./StatusBadge";
import { IGetAllInquiriesContent } from "../../helper/utils/types";
import { createStyles } from "@mantine/styles";
import Link from "next/link";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
const InquieriesBar = () => {
  const isDesktop = useMediaQuery("(min-width: 597px)");

  const paths = useContext(PathsContext);
  const router = useRouter();
  const { classes } = useStyles();
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedValue] = useDebouncedValue(searchValue, 200);
  const [id, setId] = useState<number>();
  const [debouncedId] = useDebouncedValue(id, 400);
  const [focus, setFocus] = useState<boolean>(false);
  const [goTo, setGoTo] = useState<string | null>("inquiries");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isTarget, setIsTarget] = useState<boolean>(false);
  const { inquiries, loading } = useInquiriesByQuery(debouncedValue);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [invertColors, setInvertColors] = useState(() => {
    const saved = localStorage.getItem("invertColors");
    return saved ? JSON.parse(saved) : false;
  });
  // Save the state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("invertColors", JSON.stringify(invertColors));
  }, [invertColors]);
  const [isVisible, setIsVisible] = useState(false);
  const theme = useMantineTheme();
  useEffect(() => {
    setShowResults(searchValue !== "");
    setFocus(searchValue !== "");
  }, [searchValue]);

  useEffect(() => {
    if (debouncedId) {
      router.replace(paths.rootDirectory + paths.previewInquiry + debouncedId);
    }
  }, [debouncedId, goTo]);

  const reset = () => {
    setShowResults(false);
    setSearchValue("");
    setFocus(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      reset();
    }
  };

  const onFocus = () => {
    setShowResults(searchValue !== "");
    setFocus(true);
  };

  const outsideClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if ((!isTarget && target?.tagName !== "INPUT") || e.y > 50) {
        setShowResults(false);
        setFocus(false);
      }
    },
    [isTarget]
  );

  useEffect(() => {
    window.addEventListener("click", outsideClick);
    return () => window.removeEventListener("click", outsideClick);
  }, [outsideClick]);

  const handleIdChange = (value: string | number) => {
    if (typeof value === "string") {
      const parsed = parseInt(value);
      setId(isNaN(parsed) ? undefined : parsed);
    } else {
      setId(value);
    }
  };
  return (
    <Fragment>
      {invertColors && (
        <style jsx global>{`
          :root {
            filter: invert(1) hue-rotate(180deg);
          }
        `}</style>
      )}
      <Box className={classes.bar}>
        {/* 		<Box 	style={{position:"absolute", left:  "10px"}}>
								<Image
						
									alt='profile-user'
							
									height='45px'
									src={'../../logoUrl.png'}

								/>
							</Box> */}

        <Button variant="transparent" onClick={() => setIsVisible(!isVisible)}>
          <ActionIcon variant="transparent" size="lg" color="dark">
            {isVisible ? <X /> : <Search />}
          </ActionIcon>
        </Button>
        <Button
          variant="transparent"
          onClick={() => setInvertColors(!invertColors)}
        >
          <ActionIcon variant="transparent" size="lg" color="dark">
            {colorScheme === "dark" ? <IconSun /> : <IconMoonStars />}
          </ActionIcon>
        </Button>
      </Box>
      {isVisible && (
        <Box className={isDesktop ? classes.toolbar : classes.mobileToolbar}>
          <TextInput
            radius="md"
            size="md"
            placeholder="Search Inquieries..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            className={classes.input}
            onClick={() => setFocus(true)}
            leftSection={<Search size={16} />}
          />

          <Select
            data={[
              { value: "inquiries", label: "Inquiry" },
              { value: "tickets/handleticket", label: "Ticket" },
            ]}
            radius="md"
            size="md"
            value={goTo}
            onChange={setGoTo}
          />

          <NumberInput
            allowNegative={false}
            radius="md"
            size="md"
            leftSection={<ListNumbers size={16} />}
            placeholder="ID"
            min={1}
            value={id}
            onChange={handleIdChange}
            hideControls
          />
        </Box>
      )}
      {showResults ? (
        <Menu shadow="md" closeOnClickOutside>
          <Menu.Label className={classes.menu}>
            {loading ? (
              "Searching..."
            ) : (
              <Fragment>
                <Text>
                  {inquiries?.content.length
                    ? `Inquieries by: "${debouncedValue}"`
                    : "No results..."}
                </Text>
                {inquiries?.content?.map((item: IGetAllInquiriesContent) => (
                  <Menu.Item key={item.id} className={classes.menuItem}>
                    <Link
                      href={`${paths.previewInquiry}${item.id}`}
                      className={classes.link}
                      onClick={reset}
                    >
                      <Text className={classes.subject}>
                        {item.subject.length > 13
                          ? `${item.subject.slice(0, 30)}...`
                          : item.subject}
                      </Text>
                      <Text className={classes.message}>
                        {item.message.length > 13
                          ? `${item.message.slice(0, 30)}...`
                          : item.message}
                      </Text>
                      <Box className={classes.menuStatus}>
                        <StatusBadge size="sm" status={item.status} />
                      </Box>
                      <Text className={classes.issuer}>
                        {item.issuer.email}
                      </Text>
                    </Link>
                  </Menu.Item>
                ))}
              </Fragment>
            )}
          </Menu.Label>
        </Menu>
      ) : undefined}
    </Fragment>
  );
};

export default InquieriesBar;

const useStyles = createStyles((theme) => ({
  bar: {
    position: "relative",
    top: 0,
    left: 80,

    height: 80,
    width: "calc(100% - 80px)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    alignContent: "center",
    padding: "0 1rem",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[2],
    backgroundColor: "#FFFFFF",
  },
  toolbar: {
    position: "relative",
    top: 0,
    left: 80,
    right: 0,
    height: 80,
    width: "calc(100% - 80px)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    padding: 10,
    gap: 10,

    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[2],
    backgroundColor: "#eeee",
  },
  mobileToolbar: {
    position: "relative",
    top: 0,
    left: 80,
    right: 0,
    height: 160,
    gap: 10,
    width: "calc(100% - 80px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",

    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#eee",
    backgroundColor: "#eeee",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "calc(100% - 80px)",
    marginLeft: 80,
    position: "absolute",
    zIndex: 999,
    textDecoration: "none",
    listStyle: "none",
    boxShadow: theme.shadows.xl,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
  link: {
    display: "flex",
    flexDirection: "column",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[4]
        : theme.colors.gray[8],
    textDecoration: "none",
    "&:hover": {
      /* 	color: theme.colors.brand[4] */
    },
  },
  menuItem: {
    minWidth: 500,
    borderRadius: 0,
    padding: ".2rem 0",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
    marginBottom: 2,
    position: "relative",
    "&:hover": {
      boxShadow:
        theme.colorScheme === "dark"
          ? "inset 0px 0px 1px 1px rgba(255,255,255,.2)"
          : "inset 0px 0px 1px 1px rgba(0,0,0,.1)",
    },
  },
  menuStatus: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  issuer: {
    position: "absolute",
    bottom: 4,
    right: 4,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray[6],
  },
  subject: {
    paddingLeft: ".6rem",
  },
  message: {
    fontSize: theme.fontSizes.sm,
    paddingLeft: ".6rem",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[4]
        : theme.colors.gray[6],
  },
  results: {
    position: "absolute",
    top: "100%",
    left: "1rem",
    width: "calc(100% - 2rem)",
  },
}));
