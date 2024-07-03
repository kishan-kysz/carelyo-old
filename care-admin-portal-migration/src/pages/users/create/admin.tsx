import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Title,
  TextInput,
  Loader,
  Input,
  Autocomplete,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState, useContext } from "react";
import { IconReportMedical, IconAt, IconAbc } from "@tabler/icons-react";
import { validateValues } from "../../../helper/utils/validateValues";
import { ICreateUserRequest } from "../../../helper/utils/types";
import { AnyObject } from "yup";
import PhoneInput from "../../../components/phoneInput/PhoneInput";
import { getResponseErrorMessages } from "../../../helper/utils/getResponseErrorMessages";
import validationSchema from "../../../components/utils/usersValidationSchema";
import { createAdminUser } from "../../../helper/api/index";
import { PasswordStrength } from "../../../components/passwordInput/passwordInputComponent";
import {
  useAdminUserValues,
  setAdminValueActions,
} from "../../../components/hooks/useAdminUserValues";
import {
  useAdminUserErrors,
  setAdminUserErrorActions,
} from "../../../components/hooks/useAdminUserErrors";
import { PathsContext } from "../../../components/path";

const CreateUserAdmin = () => {
  const paths = useContext(PathsContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { adminUserValues, setAdminUserValues } = useAdminUserValues();
  const { adminUserErrors, setAdminUserErrors } = useAdminUserErrors();

  const [isPhoneInputValid, setIsPhoneInputValid] = useState<boolean>(true);
  const [value, setValue] = useState("");
  const data =
    value.trim().length > 0 && !value.includes("@")
      ? ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"].map(
          (provider) => `${value}@${provider}`
        )
      : [];
  useEffect(() => {
    setAdminUserValues(setAdminValueActions.SET_IS_MOBILE_VALID, {
      isMobileValid: isPhoneInputValid,
    });
  }, [isPhoneInputValid, setAdminUserValues]);

  const setPhoneInputValue = (mobile: string) => {
    setAdminUserValues(setAdminValueActions.SET_MOBILE, { mobile: mobile });
  };
  const setPasswordInputValue = (password: string) => {
    setAdminUserValues(setAdminValueActions.SET_PASSWORD, {
      password: password,
    });
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation(createAdminUser, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      showNotification({
        title: `Admin: ${adminUserValues?.email} created`,
        message: `Admin: ${
          adminUserValues?.email
        }, created at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
        icon: <IconReportMedical />,
      });
      router.push({
        pathname: paths.rootDirectory + paths.manageUser,
        query: { columnAccessor: "createdAt" },
      });
    },
    onError: (errs: AnyObject) => {
      setIsLoading(false);

      const responseErrorMessages = getResponseErrorMessages(
        errs.response.data.errors,
        ["email", "mobile"]
      );

      setAdminUserErrors(setAdminUserErrorActions.SET_RESPONSE_ERROR_MESSAGES, {
        responseErrorMessages: responseErrorMessages,
      });
    },
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    validateValues(adminUserValues, validationSchema)
      .then(() => {
        const data: ICreateUserRequest = {
          email: adminUserValues.email,
          mobile: adminUserValues.mobile,
          password: adminUserValues.password,
          firstName: adminUserValues.firstName,
          lastName: adminUserValues.lastName,
        };

        setAdminUserErrors(setAdminUserErrorActions.RESET);

        setIsLoading(true);
        mutate(data, {
          onSuccess: () => {
            router.push(paths.rootDirectory + paths.manageUser);
          },
        });
      })
      .catch((errors) => {
        setAdminUserErrors(
          setAdminUserErrorActions.SET_VALIDATION_ERROR_MESSAGES,
          { validationErrors: errors }
        );
        console.log(errors);
      });
  };

  return (
    <>
      {isLoading ? (
        <Container
          mb={20}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader size="xl" color="teal" />
        </Container>
      ) : (
        <Container mb={20}>
          <Title mt={50}>Create Admin</Title>
          <Box mb="md" mt={40}>
            <form
              onSubmit={(e) => {
                onSubmit(e);
              }}
              style={{ width: "100%" }}
            >
              <div className="invalid-feedback">
                {adminUserErrors?.backend?.map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>

              <Autocomplete
                label="Email"
                leftSection={<IconAt size={15} />}
                placeholder="example@carelyo.com..."
                defaultValue={adminUserValues.email}
                required
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setAdminUserValues(setAdminValueActions.SET_EMAIL, {
                        email: event.currentTarget.value,
                      })
                    : null
                }
                onChange={setValue}
                value={value}
                data={data}
                onBlur={(event) =>
                  setAdminUserValues(setAdminValueActions.SET_EMAIL, {
                    email: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback" style={{ marginBottom: 3 }}>
                {adminUserErrors?.email !== undefined
                  ? adminUserErrors?.email
                  : null}
              </div>
              <PasswordStrength
                passwordValue={adminUserValues.password}
                setPasswordInputValue={setPasswordInputValue}
              />

              <Input.Wrapper required>
                <PhoneInput
                  value={adminUserValues.mobile}
                  setPhoneInputValue={setPhoneInputValue}
                />
              </Input.Wrapper>
              <div className="invalid-feedback">
                {adminUserErrors?.mobile !== undefined
                  ? adminUserErrors?.mobile
                  : null}
              </div>
              <TextInput
                size="md"
                mb="md"
                label="First name"
                leftSection={<IconAbc size={18} />}
                required
                placeholder="John..."
                defaultValue={adminUserValues.firstName}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setAdminUserValues(setAdminValueActions.SET_FIRST_NAME, {
                        firstName: event.currentTarget.value,
                      })
                    : null
                }
                onBlur={(event) =>
                  setAdminUserValues(setAdminValueActions.SET_FIRST_NAME, {
                    firstName: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback" style={{ marginBottom: 3 }}>
                {adminUserErrors?.firstName !== undefined
                  ? adminUserErrors?.firstName
                  : null}
              </div>
              <TextInput
                size="md"
                mb="md"
                label="Last name"
                leftSection={<IconAbc size={18} />}
                required
                placeholder="Doe..."
                defaultValue={adminUserValues.lastName}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setAdminUserValues(setAdminValueActions.SET_LAST_NAME, {
                        lastName: event.currentTarget.value,
                      })
                    : null
                }
                onBlur={(event) =>
                  setAdminUserValues(setAdminValueActions.SET_LAST_NAME, {
                    lastName: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback" style={{ marginBottom: 3 }}>
                {adminUserErrors?.lastName !== undefined
                  ? adminUserErrors?.lastName
                  : null}
              </div>

              <Button
                type="submit"
                size="md"
                variant="outline"
                color="#09ac8c"
                className="btn btn-primary"
              >
                Create
              </Button>

              <Button
                ml="sm"
                size="md"
                variant="outline"
                color="#e44c3f"
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  window.location.pathname =
                    paths.rootDirectory + paths?.manageUser;
                }}
              >
                Cancel
              </Button>
            </form>
          </Box>
        </Container>
      )}
    </>
  );
};

export default CreateUserAdmin;
