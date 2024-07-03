/*
import {
  Box,
  Button,
  Checkbox,
  ColorInput,
  Group,
  Input,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import SV from "date-fns/locale/sv";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, zodResolver } from "@mantine/form";
import useCalendar from "@hooks/use-calendar";
import {
  DEFAULT_CALENDAR_VALUES,
  DEFAULT_COLORS,
  ENDOFTHEDAY,
} from "@utils/constants";
import { z } from "zod";
import { DateTimePicker } from "@mantine/dates";

registerLocale("se", SV);

setDefaultLocale("se");

const CalendarSchema = z.object({
  color: z.string(),
  url: z.string(),
  start: z.date(),
  end: z.date(),
  allDay: z.boolean(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
});
export default function NewEventModal({
  open,
  close,
  event,
}: {
  open: boolean;
  close: Function;
  event: ICalendarEvent;
}) {
  const { onSubmit, getInputProps, errors, values } = useForm({
    initialValues: {
      ...DEFAULT_CALENDAR_VALUES(event),
    },
    validate: zodResolver(CalendarSchema),
  });
  const fifteenMinFromNow = new Date(new Date().getTime() + 15 * 60000);

  const { createEntry, updateEntry, deleteEntry } = useCalendar();
  const newEvents = async (values) => {
    if (event) {
      const updatedEvent = {
        ...event,
        ...values,
        end: values.end.toISOString(),
        start: values.start.toISOString(),
      };

      await updateEntry(updatedEvent);
      close();
      return;
    }
    await createEntry({
      ...values,
      end: values.end.toISOString(),
      start: values.start.toISOString(),
    });
    close();
  };

  const deleteEvent = async () => {
    await deleteEntry(event.id);
    close();
  };

  return (
    <Modal
      opened={open}
      onClose={close}
      centered={true}
      title={event ? "Edit Event" : "New Event"}
    >
      <Box>
        <form onSubmit={onSubmit(newEvents)}>
          <Stack>
            <Group sx={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
              <TextInput
                label="Title"
                data-autofocus={true}
                withAsterisk={true}
                error={errors?.title}
                placeholder="Event title..."
                {...getInputProps("title")}
                sx={{ width: "50%" }}
              />
              <TextInput
                label="Location or URL"
                placeholder="Location or URL..."
                sx={{ width: "50%" }}
                {...getInputProps("url")}
              />
            </Group>
            <ColorInput
              label="Color"
              format="hsla"
              defaultValue="#b8a18f"
              {...getInputProps("color")}
              disallowInput={true}
              swatches={DEFAULT_COLORS}
            />

            <>
              <DateTimePicker
                label="Start Time"
                withAsterisk={true}
                error={errors?.start}
              />
              <DateTimePicker
                label="End Time"
                withAsterisk={true}
                error={errors?.end}
                disabled={values.allDay}
                required={!values.allDay}
              />
            </>

            <Group>
              <Checkbox label="All Day" {...getInputProps("allDay")} />
              <Checkbox
                label="Available"
                {...getInputProps("availabilityStatus")}
              />
            </Group>
            <Textarea
              label={`Description ${values.description?.length}/100`}
              placeholder="Event description..."
              error={errors?.description}
              {...getInputProps("description")}
            />
            <Group sx={{ marginTop: "10px" }} position="center">
              {event && (
                <Button type="button" color="red" onClick={deleteEvent}>
                  Delete
                </Button>
              )}
              <Button type="submit">{event ? "Update " : "Create "}</Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
*/

import {
  Box,
  Button,
  Checkbox,
  ColorInput,
  Group,
  Input,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core'
import SV from 'date-fns/locale/sv'
import { useEffect, useState } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import useCalendar from '@hooks/use-calendar'
import {
  DEFAULT_CALENDAR_VALUES,
  DEFAULT_COLORS,
  ENDOFTHEDAY,
} from '@utils/constants'
import { ICalendarEvent } from '@types'

registerLocale('se', SV)

setDefaultLocale('se')

export default function NewEventModal({
  open,
  close,
  event,
}: {
  open: boolean
  close: () => void
  event?: ICalendarEvent
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_CALENDAR_VALUES(event),
  })
  const fifteenMinFromNow = new Date(new Date().getTime() + 15 * 60000)
  const [color, setColor] = useState(event ? event.color : '#be4bdb')
  const [start, setStart] = useState(event ? event.start : new Date())
  const [end, setEnd] = useState(event ? event.end : fifteenMinFromNow)
  const { createEntry, updateEntry, deleteEntry } = useCalendar()
  const newEvents = async (values) => {
    if (event) {
      const updatedEvent = {
        ...event,
        ...values,
        color,
        end: end.toISOString(),
        start: start.toISOString(),
      }

      await updateEntry(updatedEvent)
      close()
      return
    }
    await createEntry({
      ...values,
      color,
      end: end.toISOString(),
      start: start.toISOString(),
    })
    close()
  }

  const deleteEvent = async () => {
    await deleteEntry(event.id)
    close()
  }

  const ALLDAY = watch('allDay')

  const DESC = watch('description')
  useEffect(() => {
    if (ALLDAY) {
      setEnd(ENDOFTHEDAY)
    }
  }, [ALLDAY])

  return (
    <Modal
      opened={open}
      onClose={close}
      centered={true}
      title={event ? 'Edit Event' : 'New Event'}
    >
      <Box>
        <form onSubmit={handleSubmit(newEvents)}>
          <Stack>
            <Group sx={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              <TextInput
                label="Title"
                data-autofocus={true}
                withAsterisk={true}
                //@ts-ignore
                error={errors?.title?.message}
                placeholder="Event title..."
                {...register('title', {
                  required: { value: !!event, message: 'Title is required' },
                  maxLength: { value: 30, message: 'Title is too long' },
                })}
                sx={{ width: '50%' }}
              />
              <TextInput
                label="Location or URL"
                placeholder="Location or URL..."
                sx={{ width: '50%' }}
                {...register('url')}
              />
            </Group>
            <ColorInput
              label="Color"
              format="hex"
              defaultValue={event ? event.color : '#b8a18f'}
              value={color}
              onChange={setColor}
              disallowInput={true}
              swatches={DEFAULT_COLORS}
            />

            <>
              <Input.Wrapper
                label="Start Time"
                withAsterisk={true}
                //@ts-ignore
                error={errors?.start?.message}
              >
                <Input
                  component={DatePicker}
                  selected={start}
                  required={true}
                  onChange={(date) => setStart(date as Date)}
                  isClearable={true}
                  timeFormat="HH:mm"
                  dateFormat="Pp"
                  showTimeSelect={true}
                />
              </Input.Wrapper>

              <Input.Wrapper
                label="End Time"
                withAsterisk={true}
                error={errors?.end?.message}
              >
                <Input
                  component={DatePicker}
                  disabled={ALLDAY}
                  selected={end}
                  required={!ALLDAY}
                  onChange={(date) => setEnd(date as Date)}
                  isClearable={true}
                  timeFormat="HH:mm"
                  dateFormat="Pp"
                  showTimeSelect={true}
                />
              </Input.Wrapper>
            </>

            <Group>
              <Checkbox label="All Day" {...register('allDay')} />
              <Checkbox label="Available" {...register('availabilityStatus')} />
            </Group>
            <Textarea
              label={`Description ${DESC?.length}/100`}
              placeholder="Event description..."
              //@ts-ignore
              error={errors?.description?.message}
              {...register('description', {
                maxLength: { value: 100, message: 'Description is too long' },
              })}
            />
            <Group sx={{ marginTop: '10px' }} position="center">
              {event && (
                <Button type="button" color="red" onClick={deleteEvent}>
                  Delete
                </Button>
              )}
              <Button type="submit">{event ? 'Update ' : 'Create '}</Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}
