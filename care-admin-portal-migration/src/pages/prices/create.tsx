import { createPrice } from "../../helper/api";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Title,
  Container,
  TextInput,
  Loader,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState, useContext } from "react";
import { PathsContext } from "../../components/path";
import { getResponseErrorMessages } from "../../helper/utils/getResponseErrorMessages";
import { AnyObject } from "yup";
import * as Yup from "yup";
import validationSchema from "../../components/prices/getValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { IPriceSubmitForm } from "../../components/prices/types";
import {
  IconReceipt2,
  IconCash,
  IconBusinessplan,
  IconAbc,
  IconClockHour3,
} from "@tabler/icons-react";

const CreatePrices = () => {
  const paths = useContext(PathsContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IPriceSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const { mutate } = useMutation(createPrice, {
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ["getPrice"] });
      queryClient.invalidateQueries({ queryKey: ["getPrices"] });

      showNotification({
        title: `Price: ${item?.name} Created`,
        message: `New price: ${
          item?.name
        }, added at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
        icon: <IconCash />,
      });

      router.push(paths.rootDirectory + paths.managePrice);
    },
    onError: (err: AnyObject) => {
      const responseErrorMessages: AnyObject = getResponseErrorMessages(
        err.response.data.errors,
        ["name", "price", "vat", "commission", "duration"]
      );
      setError("name", { type: "custom", message: responseErrorMessages.name });
      setError("price", {
        type: "custom",
        message: responseErrorMessages.price,
      });
      setError("vat", { type: "custom", message: responseErrorMessages.vat });
      setError("commission", {
        type: "custom",
        message: responseErrorMessages.commission,
      });
      setError("duration", {
        type: "custom",
        message: responseErrorMessages.duration,
      });
      setIsLoading(false);
    },
  });

  const onSubmit = (data: IPriceSubmitForm) => {
    setIsLoading(true);
    mutate(data);
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
          <Title mt={50}>Create Price</Title>

          <Box mb="md" mt={40}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <div className="form-group">
                <TextInput
                  size="md"
                  mt="md"
                  label="Name"
                  required
                  placeholder="Input price name..."
                  {...register("name")}
                  leftSection={<IconAbc size={15} />}
                />
                <div className="invalid-feedback">{errors.name?.message}</div>

                <TextInput
                  size="md"
                  mt="md"
                  label="Price"
                  required
                  placeholder="input price..."
                  {...register("price")}
                  leftSection={<IconCash size={15} />}
                />
                <div className="invalid-feedback">{errors.price?.message}</div>

                <TextInput
                  size="md"
                  mt="md"
                  label="VAT"
                  required
                  placeholder="input VAT..."
                  {...register("vat")}
                  leftSection={<IconReceipt2 size={15} />}
                />
                <div className="invalid-feedback">{errors.vat?.message}</div>

                <TextInput
                  size="md"
                  mt="md"
                  label="Commission"
                  required
                  placeholder="input commission..."
                  {...register("commission")}
                  leftSection={<IconBusinessplan size={15} />}
                />
                <div className="invalid-feedback">
                  {errors.commission?.message}
                </div>
                <TextInput
                  mt="md"
                  size="md"
                  label="Duration"
                  required
                  placeholder="input duration..."
                  {...register("duration")}
                  leftSection={<IconClockHour3 size={15} />}
                />
                <div className="invalid-feedback">
                  {errors.duration?.message}
                </div>

                <Button
                  variant="outline"
                  color={"#05a98b"}
                  mt="md"
                  size="md"
                  type="submit"
                  className="btn btn-primary"
                >
                  Create
                </Button>

                <Button
                  variant="outline"
                  color={"#e44c3f"}
                  mt="md"
                  ml="md"
                  size="md"
                  type="button"
                  className="btn btn-warning float-right"
                  onClick={() => {
                    router.push(paths.rootDirectory + paths.managePrice);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Box>
        </Container>
      )}
    </>
  );
};

export default CreatePrices;
