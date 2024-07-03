import { TextInput, Input } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import * as yup from "yup";
import { AnyObject } from "yup";
import { setPatientValueActions } from "../hooks/usePatientValues";
import PhoneInput from "../phoneInput/PhoneInput";
import { IGetPatientResponse } from "../../helper/utils/types";
import { IPatientErrors } from "../hooks/usePatientErrors";
export function EmailAndPhoneForm(
  patient: IGetPatientResponse,
  setPatientValues: (
    action: setPatientValueActions,
    payload?: AnyObject | undefined
  ) => void,
  patientErrors: IPatientErrors,
  setIsPhoneInputValid: (isPhoneInputValid: boolean) => void,
  setPhoneInputValue: (mobile: string) => void
) {
  return (
    <>
      <TextInput
        label="Emassil"
        leftSection={<IconAt size={15} />}
        placeholder="example@carelyo.com"
        defaultValue={patient?.email ? patient?.email : ""}
        onKeyDown={(event) =>
          event.key === "Enter"
            ? setPatientValues(setPatientValueActions.SET_EMAIL, {
                email: event.currentTarget.value,
              })
            : null
        }
        onBlur={(event) =>
          setPatientValues(setPatientValueActions.SET_EMAIL, {
            email: event.currentTarget.value,
          })
        }
      />
      <div className="invalid-feedback" style={{ marginBottom: 3 }}>
        {patientErrors?.email !== undefined ? patientErrors?.email : null}
      </div>
      <Input.Wrapper label="Mobile">
        <PhoneInput
          value={patient?.mobile ? patient?.mobile : ""}
          setIsPhoneInputValid={setIsPhoneInputValid}
          setPhoneInputValue={setPhoneInputValue}
        />
      </Input.Wrapper>
      <div className="invalid-feedback">
        {patientErrors?.mobile !== undefined ? patientErrors?.mobile : null}
      </div>
    </>
  );
}
