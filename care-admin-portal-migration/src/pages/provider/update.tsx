import { useRouter } from "next/router";
import { updateProvider } from "../../helper/api/index";
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
  IconFileCertificate,
  IconWorld,
  IconCoin,
  IconPhotoPlus,
  IconBuildingHospital,
} from "@tabler/icons-react";
import { validateValues } from "../../helper/utils/validateValues";
import { IUpdateProviderRequest } from "../../helper/utils/types";
import { AnyObject } from "yup";
import * as Yup from "yup";
import PhoneInput from "../../components/phoneInput/PhoneInput";

import { getResponseErrorMessages } from "../../helper/utils/getResponseErrorMessages";
import {
  useProviderValues,
  setProviderValueActions,
} from "../../components/hooks/useProviderValues";
import {
  useProviderErrors,
  setProviderErrorActions,
} from "../../components/hooks/useProviderErrors";
import validationSchema from "../../components/provider/getValidationSchema";
import useProvider from "../../helper/hooks/useProvider";

const UpdateProvider = () => {
  const router = useRouter();

  const Id = Number(router.query.id);
  const paths = useContext(PathsContext);
  const { provider, loadingProvider } = useProvider(Id);
  const [isLoading, setIsLoading] = useState(loadingProvider);

  const { providerValues, setProviderValues } = useProviderValues();
  const { providerErrors, setProviderErrors } = useProviderErrors();
  const [isPhoneInputValid, setIsPhoneInputValid] = useState<boolean>(false);

  useEffect(() => {
    setProviderValues(setProviderValueActions.SET_IS_PHONE_VALID, {
      isMobileValid: isPhoneInputValid,
    });
  }, [isPhoneInputValid, setProviderValues]);

  const setPhoneInputValue = (phoneNumber: string) => {
    setProviderValues(setProviderValueActions.SET_PHONE_NUMBER, {
      phoneNumber: phoneNumber,
    });
  };

  useEffect(() => {
    if (!loadingProvider) {
      setIsLoading(loadingProvider);
    }
  }, [loadingProvider]);

  // useEffect(() => {
  // 	if (provider !== undefined) {
  // 		setProviderValues(setProviderValueActions.INIT, { provider: provider });
  // 	}
  // }, [provider, setProviderValues]);

  useEffect(() => {
    if (provider) {
      setProviderValues(setProviderValueActions.INIT, { provider: provider });
    }
  }, []);
  const queryClient = useQueryClient();

  const { mutate } = useMutation(updateProvider, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProvider"] });
      showNotification({
        title: `Provider: ${providerValues?.providerName} Updated`,
        message: `Provider: ${
          providerValues?.providerName
        }, updated at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
        icon: <IconReportMedical />,
      });
      router.push(paths.rootDirectory + paths.manageProvider);
    },
    onError: (errs: AnyObject) => {
      setIsLoading(false);

      const responseErrorMessages = getResponseErrorMessages(
        errs.response.data.errors,
        [
          "email",
          "providerName",
          "phoneNumber",
          "address",
          "practiceNumber",
          "secondaryEmail",
          "webPageUrl",
          "country",
          "currency",
          "logoURL",
          "providerType",
        ]
      );

      setProviderErrors(setProviderErrorActions.SET_RESPONSE_ERROR_MESSAGES, {
        responseErrorMessages: responseErrorMessages,
      });
    },
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    validateValues(providerValues, validationSchema)
      .then(() => {
        const data: IUpdateProviderRequest = {
          id: Id,
          email: providerValues.email,
          providerName: providerValues.providerName,
          phoneNumber: providerValues.phoneNumber,
          address: providerValues.address,
          practiceNumber: providerValues.practiceNumber,
          secondaryEmail: providerValues.secondaryEmail,
          webPageUrl: providerValues.webPageUrl,
          country: providerValues.country,
          currency: providerValues.currency,
          logoURL: providerValues.logoURL,
          providerType: providerValues.providerType,
        };

        setProviderErrors(setProviderErrorActions.RESET);
        setIsLoading(true);
        mutate(data);
      })
      .catch((errors) => {
        setProviderErrors(
          setProviderErrorActions.SET_VALIDATION_ERROR_MESSAGES,
          { validationErrors: errors }
        );
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
          <Title mt={50}>Update Provider</Title>
          <Box mb="md" mt={40}>
            <form
              onSubmit={(e) => {
                onSubmit(e);
              }}
              style={{ width: "100%" }}
            >
              <div className="invalid-feedback">
                {providerErrors?.backend?.map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>
              <TextInput
                mb="md"
                size="md"
                label="Provider name"
                leftSection={<IconUser size={15} />}
                placeholder="Provider name"
                defaultValue={providerValues.providerName}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setProviderValues(
                        setProviderValueActions.SET_PROVIDER_NAME,
                        {
                          providerName: event.currentTarget.value,
                        }
                      )
                    : null
                }
                onBlur={(event) =>
                  setProviderValues(setProviderValueActions.SET_PROVIDER_NAME, {
                    providerName: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback">
                {providerErrors?.providerName !== undefined
                  ? providerErrors?.providerName
                  : null}
              </div>

              <TextInput
                mb="md"
                size="md"
                label="Email"
                leftSection={<IconAt size={15} />}
                placeholder="example@carelyo.com"
                defaultValue={providerValues.email}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setProviderValues(
                        setProviderValueActions.SET_PROVIDER_EMAIL,
                        {
                          email: event.currentTarget.value,
                        }
                      )
                    : null
                }
                onBlur={(event) =>
                  setProviderValues(
                    setProviderValueActions.SET_PROVIDER_EMAIL,
                    { email: event.currentTarget.value }
                  )
                }
              />
              <div className="invalid-feedback" style={{ marginBottom: 3 }}>
                {providerErrors?.email !== undefined
                  ? providerErrors?.email
                  : null}
              </div>
              <TextInput
                mb="md"
                size="md"
                label="Alternative email"
                leftSection={<IconAt size={15} />}
                placeholder="example@carelyo.com"
                defaultValue={providerValues.secondaryEmail}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setProviderValues(
                        setProviderValueActions.SET_SECONDARY_EMAIL,
                        {
                          secondaryEmail: event.currentTarget.value,
                        }
                      )
                    : null
                }
                onBlur={(event) =>
                  setProviderValues(
                    setProviderValueActions.SET_SECONDARY_EMAIL,
                    {
                      secondaryEmail: event.currentTarget.value,
                    }
                  )
                }
              />
              <div className="invalid-feedback" style={{ marginBottom: 3 }}>
                {providerErrors?.secondaryEmail !== undefined
                  ? providerErrors?.secondaryEmail
                  : null}
              </div>

              <Input.Wrapper>
                <PhoneInput
                  mb="md"
                  size="md"
                  value={providerValues.phoneNumber}
                  setIsPhoneInputValid={setIsPhoneInputValid}
                  setPhoneInputValue={setPhoneInputValue}
                />
              </Input.Wrapper>
              <div className="invalid-feedback">
                {providerErrors?.phoneNumber !== undefined
                  ? providerErrors?.phoneNumber
                  : null}
              </div>

              <TextInput
                mb="md"
                size="md"
                label="Address"
                leftSection={<IconUser size={15} />}
                placeholder="Baker street 221b"
                defaultValue={providerValues.address}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setProviderValues(setProviderValueActions.SET_ADDRESS, {
                        address: event.currentTarget.value,
                      })
                    : null
                }
                onBlur={(event) =>
                  setProviderValues(setProviderValueActions.SET_ADDRESS, {
                    address: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback">
                {providerErrors?.address !== undefined
                  ? providerErrors?.address
                  : null}
              </div>

              <TextInput
                mb="md"
                size="md"
                label="Website"
                leftSection={<IconFileCertificate size={15} />}
                placeholder="https://www.example.com"
                defaultValue={providerValues.webPageUrl}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setProviderValues(
                        setProviderValueActions.SET_WEB_PAGE_URL,
                        {
                          webPageUrl: event.currentTarget.value,
                        }
                      )
                    : null
                }
                onBlur={(event) =>
                  setProviderValues(setProviderValueActions.SET_WEB_PAGE_URL, {
                    webPageUrl: event.currentTarget.value,
                  })
                }
              />
              <div className="invalid-feedback">
                {providerErrors?.webPageUrl !== undefined
                  ? providerErrors?.webPageUrl
                  : null}
              </div>

              <TextInput
                mb="md"
                size="md"
                label="Logo URL"
                leftSection={<IconPhotoPlus size={15} />}
                placeholder="https://www.example.com/image.png"
                required
                defaultValue={providerValues.logoURL}
                onChange={(event) =>
                  setProviderValues(setProviderValueActions.SET_LOGOURL, {
                    logoURL: event.currentTarget.value,
                  })
                }
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setProviderValues(setProviderValueActions.SET_LOGOURL, {
                        logoURL: event.currentTarget.value,
                      })
                    : null
                }
              />
              <div className="invalid-feedback">
                {providerErrors?.logoURL !== undefined
                  ? providerErrors?.logoURL
                  : null}
              </div>

              <TextInput
                mb="md"
                size="md"
                label="Practice number"
                leftSection={<IconFileCertificate size={15} />}
                placeholder="123456789"
                defaultValue={providerValues.practiceNumber}
                onKeyDown={(event) =>
                  event.key === "Enter"
                    ? setProviderValues(
                        setProviderValueActions.SET_PRACTICE_NUMBER,
                        {
                          practiceNumber: event.currentTarget.value,
                        }
                      )
                    : null
                }
                onBlur={(event) =>
                  setProviderValues(
                    setProviderValueActions.SET_PRACTICE_NUMBER,
                    {
                      practiceNumber: event.currentTarget.value,
                    }
                  )
                }
              />
              <div className="invalid-feedback">
                {providerErrors?.practiceNumber !== undefined
                  ? providerErrors?.practiceNumber
                  : null}
              </div>

              <Select
                mb="md"
                size="md"
                label="Country"
                leftSection={<IconWorld size={15} />}
                placeholder="Pick a country"
                value={providerValues.country}
                data={[
                  {
                    value: "Ghana",
                    label: "Ghana",
                  },
                  {
                    value: "Nigeria",
                    label: "Nigeria",
                  },
                ]}
                onChange={(event) =>
                  setProviderValues(setProviderValueActions.SET_COUNTRY, {
                    country: event,
                  })
                }
              />
              <div className="invalid-feedback">
                {providerErrors?.country !== undefined
                  ? providerErrors?.country
                  : null}
              </div>

              <Select
                mb="md"
                size="md"
                label="Currency"
                leftSection={<IconCoin size={15} />}
                placeholder="Pick a currency"
                value={providerValues.currency ? providerValues.currency : ""}
                onChange={(event) =>
                  setProviderValues(setProviderValueActions.SET_CURRENCY, {
                    currency: event,
                  })
                }
                data={
                  providerValues.country === "Ghana"
                    ? [{ value: "GHS", label: "GHS" }]
                    : [
                        { value: "NGN", label: "NGN" },
                        { value: "USD", label: "USD" },
                      ]
                }
              />
              <div className="invalid-feedback">
                {providerErrors?.currency !== undefined
                  ? providerErrors?.currency
                  : null}
              </div>

              <Select
                mb="md"
                size="md"
                label="Provider type"
                leftSection={<IconBuildingHospital size={15} />}
                placeholder="Pick a provider type"
                value={providerValues.providerType}
                data={[
                  {
                    value: "Independent Doctor",
                    label: "Independent Doctor",
                  },
                  {
                    value: "Clinic",
                    label: "Clinic",
                  },
                  {
                    value: "Hospital",
                    label: "Hospital",
                  },
                  {
                    value: "Health Organization",
                    label: "Health Organization",
                  },
                ]}
                onChange={(event) =>
                  setProviderValues(setProviderValueActions.SET_PROVIDER_TYPE, {
                    providerType: event,
                  })
                }
              />
              <div className="invalid-feedback">
                {providerErrors?.providerType !== undefined
                  ? providerErrors?.providerType
                  : null}
              </div>
              <Button
                size="md"
                variant="outline"
                color="#09ac8c"
                type="submit"
                className="btn btn-primary"
              >
                Update
              </Button>

              <Button
                size="md"
                variant="outline"
                color="
								 #f39c12"
                ml="md"
                type="reset"
                className="btn btn-primary"
                onClick={() => {
                  setProviderValues(setProviderValueActions.RESET);
                  setProviderValues(setProviderValueActions.RESET);
                }}
              >
                Reset
              </Button>

              <Button
                size="md"
                variant="outline"
                color="#e44c3f"
                ml="md"
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  router.push(paths.rootDirectory + paths.manageProvider);
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

export default UpdateProvider;
