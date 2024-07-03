import { useRouter } from "next/router";
import { updateDoctor } from "../../helper/api/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Title,
  TextInput,
  Loader,
  Input,
  Select,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect, useContext } from "react";

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
import { IUpdateDoctorRequest } from "../../helper/utils/types";
import { AnyObject } from "yup";
import PhoneInput from "../../components/phoneInput/PhoneInput";
import usePerson from "../../helper/hooks/usePerson";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
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

const UpdateDoctor = () => {
  const paths = useContext(PathsContext);
  const router = useRouter();
  const doctorId: number = Number(router.query.id);
  const { providers } = useProviders();
  const { doctor, loadingDoctor } = usePerson(doctorId);
  const [isLoading, setIsLoading] = useState(loadingDoctor);

  const { doctorValues, setDoctorValues } = useDoctorValues();

  const { doctorErrors, setDoctorErrors } = useDoctorErrors();
  const [isPhoneInputValid, setIsPhoneInputValid] = useState<boolean>(false);
  const [issuedDate, setIssuedDate] = useState(doctorValues.mdcIssuedDate);
  const [expirationDate, setExpirationDate] = useState(
    doctorValues.mdcExpirationDate
  );

  useEffect(
    () => {
      setDoctorValues(setDoctorValueActions.SET_IS_MOBILE_VALID, {
        isMobileValid: isPhoneInputValid,
      });
    },
    [
      /* isPhoneInputValid, setDoctorValues */
    ]
  );

  const setPhoneInputValue = (mobile: string) => {
    setDoctorValues(setDoctorValueActions.SET_MOBILE, { mobile: mobile });
  };

  useEffect(() => {
    if (!loadingDoctor && doctor !== undefined) {
      setIsLoading(loadingDoctor);
    }
  }, [loadingDoctor, setIsLoading]);

  const [runCount, setRunCount] = useState(0);

  useEffect(() => {
    if (
      runCount < 2 &&
      doctor !== undefined &&
      JSON.stringify(doctor) !== JSON.stringify(doctorValues)
    ) {
      setDoctorValues(setDoctorValueActions.INIT, { doctor: doctor });
      setRunCount(runCount + 1);
    }
  }, [doctor, setDoctorValues, doctorValues, runCount, setRunCount]);

  const queryClient = useQueryClient();

  const { mutate } = useMutation(updateDoctor, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
      queryClient.invalidateQueries({ queryKey: ["getDoctor"] });
      showNotification({
        title: `Doctor: ${doctorValues?.firstName} ${doctorValues?.lastName} Updated`,
        message: `Doctor: ${doctorValues?.firstName} ${
          doctorValues?.lastName
        }, updated at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
        icon: <IconReportMedical />,
      });
      router.push(paths.rootDirectory + paths.updateDoctors);
    },
    onError: (errs: AnyObject): void => {
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
          const data: IUpdateDoctorRequest = {
            id: doctorId,
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
          };

          setDoctorErrors(setDoctorErrorActions.RESET);

          setIsLoading(true);
          mutate(data, {
            onSuccess: () => {
              router.push(paths.rootDirectory + paths.manageDoctor);
            },
          });
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
          <Title mt={40}>Update Doctor</Title>
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

              <TextInput
                label="Email"
                leftSection={<IconAt size={15} />}
                placeholder="example@carelyo.com"
                defaultValue={doctorValues.email}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setDoctorValues(setDoctorValueActions.SET_EMAIL, {
                        email: event.currentTarget.value,
                      })
                    : null
                }
                onBlur={(event) =>
                  setDoctorValues(setDoctorValueActions.SET_EMAIL, {
                    email: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback" style={{ marginBottom: 3 }}>
                {doctorErrors?.email !== undefined ? doctorErrors?.email : null}
              </div>

              <Input.Wrapper label="Mobile">
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

              {doctorValues?.hospital && (
                <Select
                  label="Provider"
                  leftSection={<IconBuildingHospital size={15} />}
                  placeholder={doctorValues?.hospital}
                  required
                  defaultValue={doctorValues?.hospital}
                  data={
                    providers?.map((item) => {
                      return {
                        label: item.providerName,
                        value: item.providerName,
                      };
                    }) ?? ["No providers"]
                  }
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
              )}
              <div className="invalid-feedback">
                {doctorErrors?.hospital !== undefined
                  ? doctorErrors?.hospital
                  : null}
              </div>

              <TextInput
                label="MDCN"
                leftSection={<IconFileCertificate size={15} />}
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
                defaultValue={doctorValues.mdcIssuedDate}
                label="MDC issued date"
                leftSection={<IconCalendar size={15} />}
                placeholder="Pick an issued date ..."
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
                defaultValue={doctorValues.mdcExpirationDate}
                label="MDC expiration date"
                leftSection={<IconCalendar size={15} />}
                placeholder="Pick an expiration date ..."
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
                label="National id number"
                leftSection={<IconFileCertificate size={15} />}
                placeholder="Enter a 11 digit number, ie 12345678910 ..."
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
                mt="20"
                size="md"
                variant="outline"
                color="#09ac8c"
                className="btn btn-primary"
              >
                Update
              </Button>

              <Button
                type="reset"
                className="btn btn-primary"
                mt="20"
                size="md"
                variant="outline"
                color="#f39c12"
                ml="20"
                onClick={() => {
                  setDoctorValues(setDoctorValueActions.RESET);
                  setDoctorErrors(setDoctorErrorActions.RESET);
                }}
              >
                Reset
              </Button>

              <Button
                mt="20"
                size="md"
                variant="outline"
                color="#e44c3f"
                ml="20"
                type="button"
                className="btn btn-primary"
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

export default UpdateDoctor;
