import { useRouter } from "next/router";
import {
  updatePatient,
  createPatientFullProfile,
  completePatientProfile,
} from "../../helper/api/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Container,
  Title,
  TextInput,
  Loader,
  Modal,
  Input,
  SimpleGrid,
  Text,
  Group,
  Box,
  useMantineColorScheme,
} from "@mantine/core";
import { PathsContext } from "../../components/path";
import { IconAt } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect, useContext } from "react";
import "@mantine/dates/styles.css";
import { validateValues } from "../../helper/utils/validateValues";
import { AnyObject } from "yup";
import usePerson from "../../helper/hooks/usePerson";
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

import { ICompletePatientProfileRequest } from "../../helper/utils/types";
import useProviders from "../../helper/hooks/useProviders";
import usePeople from "../../helper/hooks/usePeople";

import { DatePickerInput } from "@mantine/dates";
import { pickBy } from "lodash";
import { updatePatientForm } from "../../components/patients/updatePatientForm";
import PhoneInput from "../../components/phoneInput/PhoneInput";

const UpdatePatient = () => {
  const router = useRouter();
  const paths = useContext(PathsContext);
  const patientId: number = Number(router.query.id);
  const [providerName, setProviderName] = useState<string>("");
  const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>();
  const { patient, loadingPatient } = usePerson(patientId);
  const [isLoading, setIsLoading] = useState(loadingPatient);
  const { providers } = useProviders();
  const { patientValues, setPatientValues } = usePatientValues();
  const { patientErrors, setPatientErrors } = usePatientErrors();
  const [isPhoneInputValid, setIsPhoneInputValid] = useState<boolean>(false);
  const { completedPatientProfile } = usePerson(patientId);
  const { colorScheme } = useMantineColorScheme();
  const { fullPatientProfile } = usePeople() as unknown as {
    fullPatientProfile: ICompletePatientProfileRequest[];
  };
  const [nationalIdNumber, setNationalIdNumber] = useState<string | undefined>(
    undefined
  );
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [patientProfile, setPatientProfile] = useState(
    fullPatientProfile?.find(
      (profile: { userId: number }) => profile.userId === patientId
    )
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    completedPatientProfile?.location?.country
      ? completedPatientProfile?.location?.country
      : ""
  );
  const [selectedState, setSelectedState] = useState<string>(
    completedPatientProfile?.location?.state
      ? completedPatientProfile?.location?.state
      : ""
  );

  const [selectedCity, setSelectedCity] = useState<Array<{
    value: string;
    label: string;
  }> | null>([
    completedPatientProfile?.location.city
      ? {
          value: completedPatientProfile?.location.city,
          label: completedPatientProfile?.location.city,
        }
      : { value: "", label: "" },
  ]);
  useEffect(() => {
    if (
      completedPatientProfile?.location?.country &&
      completedPatientProfile.location.country !== selectedCountry
    ) {
      setSelectedCountry(completedPatientProfile.location.country);
    }
    if (
      completedPatientProfile?.location?.state &&
      completedPatientProfile.location.state !== selectedState
    ) {
      setSelectedState(completedPatientProfile.location.state);
    }
    if (
      completedPatientProfile?.location?.city &&
      completedPatientProfile.location.city !== selectedCity[0]?.value
    ) {
      setSelectedCity([
        {
          value: completedPatientProfile.location.city,
          label: completedPatientProfile.location.city,
        },
      ]);
    }
  }, [completedPatientProfile, selectedCountry, selectedState, selectedCity]);

  const handleNationalIdNumberChange = (value: string) => {
    setNationalIdNumber(value);
  };
  const handleBirthDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().substring(0, 19);
      setBirthDate(formattedDate as unknown as Date);
    } else {
      setBirthDate(undefined);
    }
  };

  const [open, setOpen] = useState(true);
  useEffect(() => {
    setPatientValues(setPatientValueActions.SET_IS_MOBILE_VALID, {
      isMobileValid: isPhoneInputValid,
    });
  }, [isPhoneInputValid, patient, setPatientValues]);

  useEffect(() => {
    if (fullPatientProfile && providers) {
      if (patientProfile) {
        if (patientProfile.profileComplete) {
          setIsProfileCompleted(true);
          setOpen(false);
        } else {
          setIsProfileCompleted(false);
        }
        const providerId = patientProfile.providerId;
        const provider = providers.find((p) => p.id === providerId);
        if (provider) {
          setProviderName(provider.providerName);
        }
      }
    }
  }, [fullPatientProfile, providers, patientId, patientProfile]);

  const setPhoneInputValue = (mobile: string) => {
    setPatientValues(setPatientValueActions.SET_MOBILE, { mobile: mobile });
  };

  useEffect(() => {
    if (!loadingPatient) {
      setIsLoading(loadingPatient);
    }
  }, [loadingPatient]);

  useEffect(() => {
    if (completedPatientProfile !== undefined) {
      setPatientValues(setPatientValueActions.INIT, {
        patient: completedPatientProfile,
      });
    }
  }, [completedPatientProfile]);

  const queryClient = useQueryClient();

  const { mutate } = useMutation(createPatientFullProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPatients"] });
      queryClient.invalidateQueries({ queryKey: ["getPatient"] });
      showNotification({
        title: `Patient: ${patient?.email} Updated`,
        message: `Patient: ${
          patient?.email
        }, updated at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
      });
      router.push({
        pathname: paths.rootDirectory + paths.managePatient,
        query: { columnAccessor: "updatedAt" },
      });
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
  const updateInitialProfile = async () => {
    const initialProfileData: Partial<ICompletePatientProfileRequest> = {
      userId: patientId,
      profileComplete: true,
      dateOfBirth: birthDate,
      nationalIdNumber: nationalIdNumber as string,
    };

    try {
      await completePatientProfile(
        initialProfileData as ICompletePatientProfileRequest
      );
      showNotification({
        title: `Patient: ${patient?.email} Updated`,
        message: `Patient: ${
          patient?.email
        }, updated at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
      });

      setIsProfileCompleted(true);
      setOpen(false);
      const updatedProfile = { ...patientProfile, profileComplete: true };
      setPatientProfile(updatedProfile as ICompletePatientProfileRequest);
      router.push({
        pathname: paths.rootDirectory + paths.managePatient,
        query: { id: patientId },
      });
    } catch (error) {}
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    validateValues(patientValues, validationSchema)
      .then(() => {
        const data: ICompletePatientProfileRequest = {
          userId: patientId,
          patientId: patientId,
          title: patientValues.title,
          nationalIdNumber: patientValues.nationalIdNumber,
          firstName: patientValues.firstName,
          surName: patientValues.surName,
          dateOfBirth: patientValues.dateOfBirth,
          maritalStatus: patientValues.maritalStatus,
          hasChildren: patientValues.hasChildren,
          numOfChildren: patientValues.numOfChildren,
          polygenic: patientValues.polygenic,
          allergies: patientValues.allergies,
          medicalProblems: patientValues.medicalProblems,
          disabilities: patientValues.disabilities,
          location: patientValues.location,
          locale: patientValues.locale,
          referralCode: patientValues.referralCode,
          referralCount: patientValues.referralCount,
          providerId: patientValues.providerId,
          profileComplete: patientValues.profileComplete,
        };

        const updateMobileAndEmail = {
          id: patientId,
          mobile: patientValues.mobile,
          email: patientValues.email,
        };

        updatePatient(updateMobileAndEmail);

        const sanitizedData = pickBy(data, (value) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          } else {
            return value !== "" && value !== null && value !== undefined;
          }
        });

        setPatientErrors(setPatientErrorActions.RESET);

        setIsLoading(true);

        mutate(sanitizedData as ICompletePatientProfileRequest);
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
        <Container mb={20} maw={1250}>
          {patientProfile?.profileComplete !== true ? (
            <>
              {isProfileCompleted === false && (
                <Modal
                  opened={open}
                  onClose={() => setOpen(false)}
                  closeOnClickOutside={false}
                  withCloseButton={false}
                >
                  <Group position="center">
                    <Text weight={600} mb={10}>
                      Complete the profile by updating the required fields.
                    </Text>
                  </Group>
                  <Group position="center">
                    <DatePickerInput
                      w={400}
                      placeholder="Select date of birth"
                      label="Date of birth"
                      inputFormat="MM/DD/YYYY"
                      labelFormat="MM/YYYY"
                      onChange={(e) => handleBirthDateChange(e)}
                      required
                      mb={10}
                    />
                  </Group>
                  <Group position="center">
                    <TextInput
                      w={400}
                      placeholder="National ID number"
                      label="National ID number"
                      required
                      onChange={(e) =>
                        handleNationalIdNumberChange(e.target.value)
                      }
                    />
                  </Group>
                  <Group position="center" mt={20}>
                    <Button
                      variant={colorScheme === "dark" ? "outline" : "filled"}
                      onClick={() => {
                        updateInitialProfile();
                      }}
                    >
                      Update Initial Profile
                    </Button>
                  </Group>
                </Modal>
              )}
            </>
          ) : (
            <>
              <Title mt={50}>Update Patient</Title>
              <div className="invalid-feedback">
                {patientErrors?.backend?.map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>

              <SimpleGrid cols={2}>
                <TextInput
                  mt="md"
                  label="Email"
                  leftSection={<IconAt size="15" />}
                  placeholder="example@carelyo.com"
                  defaultValue={patient?.email}
                  onChange={(event) =>
                    setPatientValues(setPatientValueActions.SET_EMAIL, {
                      email: event.currentTarget.value,
                    })
                  }
                />

                <Box style={{ marginTop: "40px" }}>
                  <PhoneInput
                    value={patient?.mobile || ""}
                    setPhoneInputValue={setPhoneInputValue}
                  />
                </Box>
              </SimpleGrid>
              {updatePatientForm(
                onSubmit,
                setPatientValues,
                providerName,
                providers,
                patientValues,
                setPatientErrors,
                colorScheme,
                selectedCountry,
                setSelectedCountry,
                selectedState,
                setSelectedState,
                selectedCity,
                setSelectedCity
              )}
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default UpdatePatient;
