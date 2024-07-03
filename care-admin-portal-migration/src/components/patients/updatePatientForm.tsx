import {
  Box,
  Button,
  TextInput,
  Select,
  Grid,
  Group,
  MultiSelect,
} from "@mantine/core";
/* import { IconAt, IconBuildingHospital } from "@tabler/react-icons"; */
import { AnyObject } from "yup";
import { setPatientValueActions , IPatientValues } from "../hooks/usePatientValues";
import { setPatientErrorActions } from "../hooks/usePatientErrors";
import { PathsContext } from '../path';
import { IGetProviderResponse } from "../../helper/utils/types";
import { City } from 'country-state-city';
import {
  TITLE_DATA,
  MARITAL_STATUS_DATA,
  GENDER,
  BLOOD_TYPES_DATA,
  PATIENT_CHILDREN_ALLERGIES,
  PATIENT_MEDICAL_PROBLEMS,
  PATIENT_CHILDREN_DISABILITIES,
  COUNTRY,
  STATE_GHANA,
  STATE_NIGERIA,
  STATE_RWANDA,
  STATE_TANZANIA,
  LANGUAGES_GHANA,
  LANGUAGES_NIGERIA,
  LANGUAGES_RWANDA,
  LANGUAGES_TANZANIA,
  LANGUAGES_NAMIBIA,
  PREFERRED_LANGUAGE,
} from "../../helper/utils/constants";
import { useContext } from "react";
import router from "next/router";
import countryRegionData from 'country-region-data/dist/data-umd';

export function updatePatientForm(
  onSubmit: (event: React.FormEvent) => Promise<void>,

  setPatientValues: (
    action: setPatientValueActions,
    payload?: AnyObject | undefined
  ) => void,
  providerName: string,
  providers: IGetProviderResponse[] | undefined,
  patientValues: IPatientValues,

  setPatientErrors: (
    action: setPatientErrorActions,
    payload?: AnyObject | undefined
  ) => void,
  colorScheme: string,
  selectedCountry: string,
  setSelectedCountry: (country: string) => void,
  selectedState: string,
  setSelectedState: (state: string) => void,
  selectedCity: string,
  setSelectedCity: (city: string) => void
) {
  const paths = useContext(PathsContext);
  const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY;
  const countryOptions = countryRegionData
  .filter((countryData) => countryData.countryName === defaultCountry)
  .map((countryData) => ({
    value: countryData.countryName,
    label: countryData.countryName,
  }));
  function getRegionOptionsForCountry(countryName: string) {
    const countryData = countryRegionData.find(
      (data) => data.countryName === countryName
    );
    if (!countryData) return [];
    return countryData.regions.map((region) => ({
      value: region.name,
      label: region.name,
    }));
  }

  function getCityOptionsForRegion(countryName: string, stateName: string) {
    const countryData = countryRegionData.find(
      (data) => data.countryName === countryName
    );

    if (!countryData) return [];

    const regionData = countryData.regions.find(
      (region) => region.name === stateName
    );

    if (!regionData) return [];
    const cities = City.getCitiesOfState(countryData.countryShortCode, regionData.shortCode);
    return cities.map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }
  return (
    <Box mb="md" mt={40}>
      <form
        onSubmit={(e) => {
          onSubmit(e);
        }}
        style={{ width: "100%" }}
      >
        <Grid grow gutter="xl">
          <Grid.Col span={4}>
            <Select
              label="Title"
              placeholder="Title"
              data={TITLE_DATA}
              value={patientValues.title}
              onChange={(value) => {
                setPatientValues(setPatientValueActions.SET_TITLE, {
                  title: value,
                });
              }}
          
            />

            <TextInput
              label="First Name"
    
              placeholder="John"
              defaultValue={patientValues.firstName}
              onKeyDown={(event) =>
                event.key === "Enter"
                  ? setPatientValues(setPatientValueActions.SET_FIRST_NAME, {
                      firstName: event.currentTarget.value,
                    })
                  : null
              }
              onBlur={(event) =>
                setPatientValues(setPatientValueActions.SET_FIRST_NAME, {
                  firstName: event.currentTarget.value,
                })
              }
            />
            <TextInput
              label="Last Name"
       
              placeholder="Doe"
              defaultValue={patientValues.surName}
              onKeyDown={(event) =>
                event.key === "Enter"
                  ? setPatientValues(setPatientValueActions.SET_SUR_NAME, {
                      surName: event.currentTarget.value,
                    })
                  : null
              }
              onBlur={(event) =>
                setPatientValues(setPatientValueActions.SET_SUR_NAME, {
                  surName: event.currentTarget.value,
                })
              }
            />
            <Select
              label="Marital Status"
              placeholder="Marital Status"
              data={MARITAL_STATUS_DATA}
              value={patientValues.maritalStatus}
              onChange={(value) => {
                setPatientValues(setPatientValueActions.SET_MARITAL_STATUS, {
                  maritalStatus: value,
                });
              }}
         
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              label="Height in Cm"
       
              placeholder="170..."
              defaultValue={
                patientValues?.polygenic?.heightCm
                  ? patientValues?.polygenic?.heightCm
                  : ""
              }
              onKeyDown={(event) =>
                event.key === "Enter"
                  ? setPatientValues(setPatientValueActions.SET_HEIGHT_CM, {
                      heightCm: event.currentTarget.value,
                    })
                  : null
              }
              onBlur={(event) =>
                setPatientValues(setPatientValueActions.SET_HEIGHT_CM, {
                  heightCm: event.currentTarget.value,
                })
              }
            />

            <TextInput
              label="Weight in Kg"
     
              placeholder="70..."
              defaultValue={
                patientValues?.polygenic?.weightKg
                  ? patientValues?.polygenic?.weightKg
                  : ""
              }
              onKeyDown={(event) =>
                event.key === "Enter"
                  ? setPatientValues(setPatientValueActions.SET_WEIGHT_KG, {
                      weightKg: event.currentTarget.value,
                    })
                  : null
              }
              onBlur={(event) =>
                setPatientValues(setPatientValueActions.SET_WEIGHT_KG, {
                  weightKg: event.currentTarget.value,
                })
              }
            />
            <Select
              label="Gender"
              placeholder="Gender"
              data={GENDER}
              value={patientValues?.polygenic?.gender}
              onChange={(value) => {
                setPatientValues(setPatientValueActions.SET_GENDER, {
                  gender: value,
                });
              }}
            />
            <Select
              label="Blood Type"
              placeholder="Blood Type"
              data={BLOOD_TYPES_DATA}
              value={patientValues?.polygenic?.bloodType}
              onChange={(value) => {
                setPatientValues(setPatientValueActions.SET_BLOOD_TYPE, {
                  bloodType: value,
                });
              }}
        
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <MultiSelect
              label="Languages"
        
              placeholder="Languages..."
              value={patientValues?.locale?.languages}
              data={
                selectedCountry === "Ghana"
                  ? LANGUAGES_GHANA
                  : selectedCountry === "Nigeria"
                  ? LANGUAGES_NIGERIA
                  : selectedCountry === "Rwanda"
                  ? LANGUAGES_RWANDA
                  : selectedCountry === "Namibia"
                  ? LANGUAGES_NAMIBIA
                  : LANGUAGES_TANZANIA
              }
              onChange={(value) => {
                setPatientValues(setPatientValueActions.SET_LANGUAGES, {
                  languages: value,
                });
              }}
            />
            <MultiSelect
              label="Allergies"
         
              placeholder="Allergies..."
              value={patientValues.allergies}
              data={PATIENT_CHILDREN_ALLERGIES}
              onChange={(value) => {
                setPatientValues(setPatientValueActions.SET_ALLERGIES, {
                  allergies: value,
                });
              }}
            />
            <MultiSelect
              label="Medical Problems"
          
              placeholder="Medical Problems..."
              value={patientValues.medicalProblems}
              data={PATIENT_MEDICAL_PROBLEMS}
              onChange={(value) => {
                setPatientValues(setPatientValueActions.SET_MEDICAL_PROBLEMS, {
                  medicalProblems: value,
                });
              }}
            />
            <MultiSelect
              label="Disabilities"
           
              placeholder="Disabilities..."
              value={patientValues.disabilities}
              data={PATIENT_CHILDREN_DISABILITIES}
              onChange={(value) => {
                setPatientValues(setPatientValueActions.SET_DISABILITIES, {
                  disabilities: value,
                });
              }}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              label="Address"
     
              placeholder="Address..."
              defaultValue={patientValues?.location?.address}
              onKeyDown={(event) =>
                event.key === "Enter"
                  ? setPatientValues(setPatientValueActions.SET_ADDRESS, {
                      address: event.currentTarget.value,
                    })
                  : null
              }
              onBlur={(event) =>
                setPatientValues(setPatientValueActions.SET_ADDRESS, {
                  address: event.currentTarget.value,
                })
              }
            />

            <TextInput
              label="ZipCode"
           
              placeholder="ZipCode..."
              defaultValue={
                patientValues?.location?.zipCode
                  ? patientValues?.location?.zipCode
                  : ""
              }
              onKeyDown={(event) =>
                event.key === "Enter"
                  ? setPatientValues(setPatientValueActions.SET_ZIP_CODE, {
                      zipCode: event.currentTarget.value,
                    })
                  : null
              }
              onBlur={(event) =>
                setPatientValues(setPatientValueActions.SET_ZIP_CODE, {
                  zipCode: event.currentTarget.value,
                })
              }
            />

            <TextInput
              label="Community"
          
              placeholder="Community..."
              defaultValue={patientValues?.location?.community}
              onKeyDown={(event) =>
                event.key === "Enter"
                  ? setPatientValues(setPatientValueActions.SET_COMMUNITY, {
                      community: event.currentTarget.value,
                    })
                  : null
              }
              onBlur={(event) =>
                setPatientValues(setPatientValueActions.SET_COMMUNITY, {
                  community: event.currentTarget.value,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={4}>
          <Select
  label="Country"
  data={countryOptions}
  value={patientValues?.location?.country}
  onChange={(value) => {
    setPatientValues(setPatientValueActions.SET_COUNTRY, {
      country: value,
    });


    setSelectedCountry(value);
  }}
/>
<Select
    label="State/Region"
  data={getRegionOptionsForCountry(patientValues?.location?.country)}
  value={patientValues?.location?.state}
  onChange={(value) => {
    setPatientValues(setPatientValueActions.SET_STATE, {
      state: value,
    });
    setSelectedState(value);

  }}
/>

<Select
  label="City"
  data={getCityOptionsForRegion(patientValues?.location?.country, patientValues?.location?.state)}
  value={patientValues?.location?.city}
  onChange={(value) => {
    setPatientValues(setPatientValueActions.SET_CITY, {
      city: value,
    });
  }}
/>
          </Grid.Col>
          <Grid.Col span={4}>
            {providerName && (
              <Select
                label="Provider"
      
                placeholder={providerName}
                required
                data={
                  providers?.map((item) => {
                    return {
                      label: item.providerName,
                      value: item.providerName,
                    };
                  }) ?? ["No providers"]
                }
                defaultValue={providerName}
                onChange={(event) => {
                  setPatientValues(setPatientValueActions.SET_PROVIDER_ID, {
                    providerId: providers?.find(
                      (item) => item.providerName === event
                    )?.id,
                  });
                }}
              />
            )}
            {!providerName && (
              <Select
                label="Provider"

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
                defaultValue={providerName}
                onChange={(event) => {
                  setPatientValues(setPatientValueActions.SET_PROVIDER_ID, {
                    providerId: providers?.find(
                      (item) => item.providerName === event
                    )?.id,
                  });
                }}
              />
            )}
            <Select
              label="Preferred Language"
           
              placeholder="Preferred Language..."
              value={patientValues?.locale?.preferredLanguage}
              data={PREFERRED_LANGUAGE}
              onChange={(value) => {
                setPatientValues(
                  setPatientValueActions.SET_PREFERRED_LANGUAGE,
                  {
                    preferredLanguage: value,
                  }
                );
              }}
            />

            <TextInput
              label="Closest Hospital"
            
              placeholder="Closest Hospital..."
              defaultValue={patientValues?.locale?.closestHospital}
              onKeyDown={(event) =>
                event.key === "Enter"
                  ? setPatientValues(
                      setPatientValueActions.SET_CLOSEST_HOSPITAL,
                      {
                        closestHospital: event.currentTarget.value,
                      }
                    )
                  : null
              }
              onBlur={(event) =>
                setPatientValues(setPatientValueActions.SET_CLOSEST_HOSPITAL, {
                  closestHospital: event.currentTarget.value,
                })
              }
            />
          </Grid.Col>
        </Grid>
        <Group position="center" mt={20}>
          <Button
            variant={colorScheme === "dark" ? "outline" : "filled"}
            type="submit"
            className="btn btn-primary "
            size='md'
            variant="outline"
            color={'#09ac8c'}
            onClick={() => {
              setPatientValues(setPatientValueActions.SET_PROFILE_COMPLETE, {
                profileComplete: true,
              });
            }}
          >
            Update
          </Button>
          <Button
            variant={colorScheme === "dark" ? "outline" : "filled"}
            type="reset"
            className="btn btn-primary"
            size='md'
            variant="outline"
            color={'#f39c12'}
            onClick={() => {
              setPatientValues(setPatientValueActions.RESET);
              setPatientErrors(setPatientErrorActions.RESET);
              setSelectedState(patientValues?.location?.state as string);
              setSelectedCountry(patientValues?.location?.country as string);
       
            }}
          >
            Reset
          </Button>
          <Button
            variant={colorScheme === "dark" ? "outline" : "filled"}
            type="button"
            className="btn btn-primary"
            size='md'
            variant="outline"
            color={'#e44c3f'}
            onClick={() => {
              router.push(paths.rootDirectory + paths.managePatient)
            }}
          >
            Cancel
          </Button>
        </Group>
      </form>
    </Box>
  );
}
