
import usePrice from "../../helper/hooks/usePrice";
import { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Loader,
  TextInput,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconReceipt2,
  IconCash,
  IconBusinessplan,
  IconClockHour3,
} from "@tabler/icons-react";
import { updatePrice } from "../../helper/api/index";
import { useRouter } from "next/router";
import { PathsContext } from "../../components/path";
import { IPriceSubmitForm } from "../../components/prices/types"; // Assuming this is where IPriceSubmitForm is defined

const Updatev2 = () => {
  const paths = useContext(PathsContext);
  const router = useRouter();
  const priceId = router.query.id;
  const { price, loading } = usePrice(priceId as string);
  
  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [newVat, setNewVat] = useState<string>("");
  const [newCommission, setNewCommission] = useState<string>("");
  const [newDuration, setNewDuration] = useState<number | null>(null);

  useEffect(() => {
    if (price) {
      setNewPrice(price.prices.price);
      setNewVat(price.prices.vat.toString()); // Convert to string for TextInput
      setNewCommission(price.prices.commission.toString()); // Convert to string for TextInput
      setNewDuration(price.prices.duration);
    }
  }, [price]);

  const handlePriceChange = (value: string) => {
    const parsedValue = parseFloat(value);
    setNewPrice(isNaN(parsedValue) ? null : parsedValue);
  };

  const handleVatChange = (value: string) => {
    // Allow decimal input including 0
    setNewVat(value);
  };

  const handleCommissionChange = (value: string) => {
    // Allow decimal input including 0
    setNewCommission(value);
  };

  const handleDurationChange = (value: string) => {
    const parsedValue = parseFloat(value);
    setNewDuration(isNaN(parsedValue) ? null : parsedValue);
  };

  const submit = async () => {
    if (!price?.name) return;

    const payload: IPriceSubmitForm = {
      name: price.name,
      price: newPrice !== null ? newPrice : null,
      vat: newVat.trim() !== "" ? parseFloat(newVat) : null,
      commission: newCommission.trim() !== "" ? parseFloat(newCommission) : null,
      duration: newDuration !== null ? newDuration : null,
    };

    try {
      // Ensure at least one field is being updated
      if (!payload.price && !payload.vat && !payload.commission && !payload.duration) {
        showNotification({
          title: `No Changes`,
          message: `No changes were made.`,
        });
        return;
      }

      await updatePrice(payload);

      showNotification({
        title: `Price: ${price?.name} Updated`,
        message: `Price updated at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
        icon: <IconCash />,
      });

      router.push(paths.rootDirectory + paths.managePrice);
    } catch (error) {
      if (error instanceof Error) {
        showNotification({
          title: `Error`,
          message: `Error ${error.message}, occurred at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
        });
      } else {
        showNotification({
          title: `Error`,
          message: `An unexpected error occurred.`,
        });
      }
    }
  };

  const handleReset = () => {
    if (price) {
      setNewPrice(price.prices.price);
      setNewVat(price.prices.vat.toString()); // Convert to string for TextInput
      setNewCommission(price.prices.commission.toString()); // Convert to string for TextInput
      setNewDuration(price.prices.duration);
    }
  };

  return (
    <>
      {loading ? (
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
          <Title order={2} style={{ textAlign: "center" }}>
            {`${price?.name.trim().substring(0, 1).toUpperCase()}${price?.name
              .trim()
              .substring(1)}`}
          </Title>
          <Box mb="md" mt={40}>
            <div style={{ width: "100%" }}>
              {price ? (
                <div className="form-group">
                  <TextInput
                    label="Price"
                    value={newPrice !== null ? newPrice.toString() : ""}
                    onChange={(e) => handlePriceChange(e.currentTarget.value)}
                    placeholder="Input price..."
                    leftSection={<IconCash size={15} />}
                  />
                  <TextInput
                    label="VAT"
                    value={newVat}
                    onChange={(e) => handleVatChange(e.currentTarget.value)}
                    placeholder="Input VAT..."
                    leftSection={<IconReceipt2 size={15} />}
                  />
                  <TextInput
                    label="Commission"
                    value={newCommission}
                    onChange={(e) => handleCommissionChange(e.currentTarget.value)}
                    placeholder="Input commission..."
                    leftSection={<IconBusinessplan size={15} />}
                  />
                  <TextInput
                    label="Duration"
                    value={newDuration !== null ? newDuration.toString() : ""}
                    onChange={(e) => handleDurationChange(e.currentTarget.value)}
                    placeholder="Input duration..."
                    leftSection={<IconClockHour3 size={15} />}
                  />
                  <Button
                    mt="20"
                    variant="outline"
                    color={"#05a98b"}
                    type="submit"
                    onClick={submit}
                  >
                    Update
                  </Button>
                  <Button
                    mt="20"
                    variant="outline"
                    color="#f39c12"
                    ml="20"
                    type="reset"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button
                    mt="20"
                    variant="outline"
                    color={"#e44c3f"}
                    ml="20"
                    type="button"
                    onClick={() => {
                      router.push(paths.rootDirectory + paths.managePrice);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Loader size="xl" color="teal" />
              )}
            </div>
          </Box>
        </Container>
      )}
    </>
  );
};

export default Updatev2;
