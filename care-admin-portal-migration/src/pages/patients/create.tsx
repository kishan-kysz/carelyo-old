import { useRouter } from "next/router";
import { createPatient } from "../../helper/api/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Title,
  Loader,
  Input,
  Autocomplete,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IconReportMedical, IconAt } from "@tabler/icons-react";
import { validateValues } from "../../helper/utils/validateValues";
import { ICreatePatientRequest } from "../../helper/utils/types";
import { AnyObject } from "yup";
import PhoneInput from "../../components/phoneInput/PhoneInput";
import { getResponseErrorMessages } from "../../helper/utils/getResponseErrorMessages";
import {
  usePatientValues,
  setPatientValueActions,
} from "../../components/hooks/usePatientValues";
import {
  usePatientErrors,
  setPatientErrorActions,
} from "../../components/hooks/usePatientErrors";
import validationSchema from "../../components/utils/patientValidationSchema";
import { useContext } from "react";
import { PathsContext } from "../../components/path";
const CreatePatient = () => {
  const router = useRouter();
  const paths = useContext(PathsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const { patientValues, setPatientValues } = usePatientValues();
  const { patientErrors, setPatientErrors } = usePatientErrors();
  const [isPhoneInputValid, setIsPhoneInputValid] = useState<boolean>(false);
  const data =
    value.trim().length > 0 && !value.includes("@")
      ? ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"].map(
          (provider) => `${value}@${provider}`
        )
      : [];

  useEffect(() => {
    setPatientValues(setPatientValueActions.SET_IS_MOBILE_VALID, {
      isMobileValid: isPhoneInputValid,
    });
  }, [isPhoneInputValid, setPatientValues]);

  const setPhoneInputValue = (mobile: string) => {
    setPatientValues(setPatientValueActions.SET_MOBILE, { mobile: mobile });
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation(createPatient, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPatients"] });
      showNotification({
        title: `Patient: ${patientValues?.email} created`,
        message: `Patient: ${
          patientValues?.email
        }, created at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
        icon: <IconReportMedical />,
      });
      router.push(paths.rootDirectory + paths.managePatient);
    },
    onError: (errs: AnyObject) => {
      setIsLoading(false);

      const responseErrorMessages = getResponseErrorMessages(
        errs.response.data.errors,
        ["email", "mobile"]
      );

      setPatientErrors(setPatientErrorActions.SET_RESPONSE_ERROR_MESSAGES, {
        responseErrorMessages: responseErrorMessages,
      });
    },
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    validateValues(patientValues, validationSchema)
      .then(() => {
        const data: ICreatePatientRequest = {
          email: patientValues.email,
          mobile: patientValues.mobile,
        };

        setPatientErrors(setPatientErrorActions.RESET);

        setIsLoading(true);
        mutate(data);
      })
      .catch((errors) => {
        setPatientErrors(setPatientErrorActions.SET_VALIDATION_ERROR_MESSAGES, {
          validationErrors: errors,
        });
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
          <Title mt={40}>Create Patient</Title>
          <Box mb="md" mt={40}>
            <form
              onSubmit={(e) => {
                onSubmit(e);
              }}
              style={{ width: "100%" }}
            >
              <div className="invalid-feedback">
                {patientErrors?.backend?.map((message) => (
                  <p>{message}</p>
                ))}
              </div>

              <Autocomplete
                label="Email"
                leftSection={<IconAt size={15} />}
                placeholder="example@carelyo.com"
                defaultValue={patientValues.email}
                required
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setPatientValues(setPatientValueActions.SET_EMAIL, {
                        email: event.currentTarget.value,
                      })
                    : null
                }
                onChange={setValue}
                value={value}
                data={data}
                onBlur={(event) =>
                  setPatientValues(setPatientValueActions.SET_EMAIL, {
                    email: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback" style={{ marginBottom: 3 }}>
                {patientErrors?.email !== undefined
                  ? patientErrors?.email
                  : null}
              </div>

              <Input.Wrapper label="Mobile" required>
                <PhoneInput
                  value={patientValues.mobile}
                  setIsPhoneInputValid={setIsPhoneInputValid}
                  setPhoneInputValue={setPhoneInputValue}
                />
              </Input.Wrapper>
              <div className="invalid-feedback">
                {patientErrors?.mobile !== undefined
                  ? patientErrors?.mobile
                  : null}
              </div>

              <Button
                mt={20}
                size="md"
                variant="outline"
                color="#09ac8c"
                type="submit"
                className="btn btn-primary"
              >
                Create
              </Button>

              <Button
                mt={20}
                size="md"
                variant="outline"
                color="#e44c3f"
                ml={20}
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  router.push(paths.rootDirectory + paths.managePatient);
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

export default CreatePatient;
