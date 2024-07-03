import { useRouter } from "next/router";
import { createDoctor } from "../../helper/api/index";
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
  Select,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState, useContext } from "react";
import { PathsContext } from "../../components/path";
import {
  IconReportMedical,
  IconAt,
  IconUser,
  IconBuildingHospital,
  IconFileCertificate,
  IconCalendar,
} from "@tabler/icons-react";
import { validateValues } from "../../helper/utils/validateValues";
import { ICreateDoctorRequest } from "../../helper/utils/types";
import * as yup from "yup";
import { AnyObject } from "yup";
import PhoneInput from "../../components/phoneInput/PhoneInput";
import { DatePickerInput } from "@mantine/dates";
import { getResponseErrorMessages } from "../../helper/utils/getResponseErrorMessages";
import {
  useDoctorValues,
  setDoctorValueActions,
} from "../../components/hooks/useDoctorValues";
import {
  useDoctorErrors,
  setDoctorErrorActions,
} from "../../components/hooks/useDoctorErrors";
import useProviders from "../../helper/hooks/useProviders";
import validationSchema from "../../components/utils/doctorValidationSchema";
import "@mantine/dates/styles.css";
import path from "path";

const CreateDoctor = () => {
  const router = useRouter();
  const paths = useContext(PathsContext);
  const [isLoading, setIsLoading] = useState(false);
  const { providers } = useProviders();

  const { doctorValues, setDoctorValues } = useDoctorValues();
  const { doctorErrors, setDoctorErrors } = useDoctorErrors();
  const [isPhoneInputValid, setIsPhoneInputValid] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const data =
    value.trim().length > 0 && !value.includes("@")
      ? ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"].map(
          (provider) => `${value}@${provider}`
        )
      : [];
  useEffect(() => {
    setDoctorValues(setDoctorValueActions.SET_IS_MOBILE_VALID, {
      isMobileValid: isPhoneInputValid,
    });
  }, [isPhoneInputValid, setDoctorValues]);

  const setPhoneInputValue = (mobile: string) => {
    setDoctorValues(setDoctorValueActions.SET_MOBILE, { mobile: mobile });
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation(createDoctor, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
      showNotification({
        title: `Doctor: ${doctorValues?.firstName} ${doctorValues?.lastName} Created`,
        message: `Doctor: Doctor: ${doctorValues?.firstName} ${
          doctorValues?.lastName
        }, created at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
        icon: <IconReportMedical />,
      });
      navigate("/doctors", { state: { columnAccessor: "createdAt" } });
    },
    onError: (errs: AnyObject) => {
      setIsLoading(false);

      const responseErrorMessages = getResponseErrorMessages(
        errs.response.data.errors,
        [
          "email",
          "mobile",
          "firstName",
          "lastName",
          "medicalCertificate.certificateNumber",
          "medicalCertificate.issuedDate",
          "medicalCertificate.expirationDate",
          "hospital",
          "nationalIdNumber",
          "providerId",
        ]
      );

      setDoctorErrors(setDoctorErrorActions.SET_RESPONSE_ERROR_MESSAGES, {
        responseErrorMessages: responseErrorMessages,
      });
    },
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    validateValues(doctorValues, validationSchema)
      .then(() => {
        if (
          doctorValues.mdcIssuedDate !== undefined &&
          doctorValues.mdcExpirationDate !== undefined
        ) {
          const timezoneOffset: number = new Date().getTimezoneOffset() * 60000;
          const data: ICreateDoctorRequest = {
            email: doctorValues.email,
            mobile: doctorValues.mobile,
            firstName: doctorValues.firstName,
            lastName: doctorValues.lastName,
            mdcnCertificateNumber: doctorValues.mdcn,
            mdcnIssuedDate: new Date(
              doctorValues.mdcIssuedDate.getTime() - timezoneOffset
            ),
            mdcnExpirationDate: new Date(
              doctorValues.mdcExpirationDate.getTime() - timezoneOffset
            ),
            hospital: doctorValues.hospital,
            nationalIdNumber: +doctorValues.nationalIdNumber,
            providerId: doctorValues.providerId,
          };

          setDoctorErrors(setDoctorErrorActions.RESET);

          setIsLoading(true);
          mutate(data);
        }
      })
      .catch((errors) => {
        setDoctorErrors(setDoctorErrorActions.SET_VALIDATION_ERROR_MESSAGES, {
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
          <Title mt={40}>Create Doctor</Title>
          <Box mb="md" mt={40}>
            <form
              onSubmit={(e) => {
                onSubmit(e);
              }}
              style={{ width: "100%" }}
            >
              <div className="invalid-feedback">
                {doctorErrors?.backend?.map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>

              <Autocomplete
                label="Email"
                leftSection={<IconAt size={15} />}
                placeholder="example@carelyo.com"
                defaultValue={doctorValues.email}
                required
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setDoctorValues(setDoctorValueActions.SET_EMAIL, {
                        email: event.currentTarget.value,
                      })
                    : null
                }
                onChange={setValue}
                value={value}
                data={data}
                onBlur={(event) =>
                  setDoctorValues(setDoctorValueActions.SET_EMAIL, {
                    email: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback" style={{ marginBottom: 3 }}>
                {doctorErrors?.email !== undefined ? doctorErrors?.email : null}
              </div>

              <Input.Wrapper label="Mobile" required>
                <PhoneInput
                  value={doctorValues.mobile}
                  setIsPhoneInputValid={setIsPhoneInputValid}
                  setPhoneInputValue={setPhoneInputValue}
                />
              </Input.Wrapper>
              <div className="invalid-feedback">
                {doctorErrors?.mobile !== undefined
                  ? doctorErrors?.mobile
                  : null}
              </div>

              <TextInput
                label="First Name"
                leftSection={<IconUser size={15} />}
                required
                placeholder="John"
                defaultValue={doctorValues.firstName}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setDoctorValues(setDoctorValueActions.SET_FIRST_NAME, {
                        firstName: event.currentTarget.value,
                      })
                    : null
                }
                onBlur={(event) =>
                  setDoctorValues(setDoctorValueActions.SET_FIRST_NAME, {
                    firstName: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback">
                {doctorErrors?.firstName !== undefined
                  ? doctorErrors?.firstName
                  : null}
              </div>

              <TextInput
                label="Last name"
                leftSection={<IconUser size={15} />}
                required
                placeholder="Doe"
                defaultValue={doctorValues.lastName}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setDoctorValues(setDoctorValueActions.SET_LAST_NAME, {
                        lastName: event.currentTarget.value,
                      })
                    : null
                }
                onBlur={(event) =>
                  setDoctorValues(setDoctorValueActions.SET_LAST_NAME, {
                    lastName: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback">
                {doctorErrors?.lastName !== undefined
                  ? doctorErrors?.lastName
                  : null}
              </div>

              <Select
                label="Provider"
                leftSection={<IconBuildingHospital size={15} />}
                placeholder="Select provider"
                required
                data={
                  providers?.map((item) => {
                    return {
                      label: item.providerName,
                      value: item.providerName,
                    };
                  }) ?? ["No providers"]
                }
                defaultValue={doctorValues.hospital}
                onChange={(event) => {
                  setDoctorValues(setDoctorValueActions.SET_HOSPITAL, {
                    hospital: event,
                  });
                  setDoctorValues(setDoctorValueActions.SET_PROVIDER_ID, {
                    providerId: providers?.find(
                      (item) => item.providerName === event
                    )?.id,
                  });
                }}
              />
              <div className="invalid-feedback">
                {doctorErrors?.providerId !== undefined
                  ? doctorErrors?.providerId
                  : null}
              </div>
              <div className="invalid-feedback">
                {doctorErrors?.hospital !== undefined
                  ? doctorErrors?.hospital
                  : null}
              </div>

              <TextInput
                label="MDCN"
                leftSection={<IconFileCertificate size={15} />}
                required
                placeholder="The last 5 digits, ie 12345"
                defaultValue={doctorValues.mdcn}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setDoctorValues(setDoctorValueActions.SET_MDCN, {
                        mdcn: event.currentTarget.value,
                      })
                    : null
                }
                onBlur={(event) =>
                  setDoctorValues(setDoctorValueActions.SET_MDCN, {
                    mdcn: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback">
                {doctorErrors?.mdcn !== undefined ? doctorErrors?.mdcn : null}
              </div>

              <DatePickerInput
                label="MDC issued date"
                leftSection={<IconCalendar size={15} />}
                required
                placeholder="Pick an issued date ..."
                value={doctorValues.mdcIssuedDate}
                onChange={(event) =>
                  setDoctorValues(setDoctorValueActions.SET_MDC_ISSUED_DATE, {
                    mdcIssuedDate: event?.getTime(),
                  })
                }
              />
              <div className="invalid-feedback">
                {doctorErrors?.mdcIssuedDate !== undefined
                  ? doctorErrors?.mdcIssuedDate
                  : null}
              </div>

              <DatePickerInput
                label="MDC expiration date"
                leftSection={<IconCalendar size={15} />}
                required
                placeholder="Pick an expiration date ..."
                value={doctorValues.mdcExpirationDate}
                onChange={(event) =>
                  setDoctorValues(
                    setDoctorValueActions.SET_MDC_EXPIRATION_DATE,
                    {
                      mdcExpirationDate: event?.getTime(),
                    }
                  )
                }
              />
              <div className="invalid-feedback">
                {doctorErrors?.mdcExpirationDate !== undefined
                  ? doctorErrors?.mdcExpirationDate
                  : null}
              </div>

              <TextInput
                label="National id Number"
                leftSection={<IconFileCertificate size={15} />}
                placeholder="Enter a 11 digit number, ie 12345678910 ..."
                required
                defaultValue={doctorValues.nationalIdNumber}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setDoctorValues(
                        setDoctorValueActions.SET_NATIONAL_ID_NUMBER,
                        {
                          nationalIdNumber: event.currentTarget.value,
                        }
                      )
                    : null
                }
                onBlur={(event) =>
                  setDoctorValues(
                    setDoctorValueActions.SET_NATIONAL_ID_NUMBER,
                    {
                      nationalIdNumber: event.currentTarget.value,
                    }
                  )
                }
              />
              <div className="invalid-feedback">
                {doctorErrors?.nationalIdNumber !== undefined
                  ? doctorErrors?.nationalIdNumber
                  : null}
              </div>

              <Button
                type="submit"
                mt={20}
                size="md"
                variant="outline"
                color="#09ac8c"
                className="btn btn-primary"
              >
                Create
              </Button>

              <Button
                mt={20}
                size="md"
                variant="outline"
                color="#e44c3f"
                type="button"
                className="btn btn-primary"
                ml={20}
                onClick={() => {
                  router.push(paths.rootDirectory + paths.manageDoctor);
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

export default CreateDoctor;
