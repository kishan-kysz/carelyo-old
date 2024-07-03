import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Title,
  Text,
  Loader,
  Group,
  Stack,
  Divider,
} from "@mantine/core";
import usePrescription from "../../helper/hooks/usePrescription";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { PathsContext } from "../../components/path";

const FullPrescriptionsProfile = () => {
  const paths = useContext(PathsContext);
  const router = useRouter();
  const prescriptionId = Number(router.query.id);
  const { prescription, loadingPrescription } = usePrescription(prescriptionId);
  const [isLoading, setIsLoading] = useState(loadingPrescription);

  useEffect(() => {
    if (!loadingPrescription) {
      setIsLoading(loadingPrescription);
    }
  }, [loadingPrescription]);

  const issueDate = prescription?.issueDate
    ? new Date(prescription?.issueDate)
    : null;

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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Container mb={20}>
            <Title mt={50}>
              Complete Prescription Profile for {prescription?.recipientName}
            </Title>
            <Box mb="md" mt={80}>
              <Group align="center">
                <Group align="flex-start" spacing={40}>
                  <Stack spacing={10}>
                    <Text weight={600}>Status </Text>
                    <Divider />

                    <Text weight={600}>
                      {" "}
                      Created at:{" "}
                      <Text weight={500} component="span">
                        {prescription?.createdAt.replace("T", " ").slice(0, 16)}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Updated at:{" "}
                      <Text weight={500} component="span">
                        {prescription?.updatedAt.replace("T", " ").slice(0, 16)}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Issued at:{" "}
                      <Text weight={500} component="span">
                        {issueDate
                          ?.toISOString()
                          .replace("T", " ")
                          .slice(0, 16)}
                      </Text>{" "}
                    </Text>
                    <Text weight={600}>
                      Fullfilled on:{" "}
                      <Text weight={500} component="span">
                        {prescription?.fulfilledDate}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Status:{" "}
                      <Text weight={500} component="span">
                        {prescription?.status}
                      </Text>
                    </Text>
                  </Stack>

                  <Divider orientation="vertical" />

                  <Stack spacing={10}>
                    <Text weight={600}>Related Information </Text>
                    <Divider />
                    <Text weight={600}>
                      Prescription id:{" "}
                      <Text weight={500} component="span">
                        {prescription?.id}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Consultation id:{" "}
                      <Text weight={500} component="span">
                        {prescription?.consultationId}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Patient id:{" "}
                      <Text weight={500} component="span">
                        {prescription?.patientId}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Doctor id:{" "}
                      <Text weight={500} component="span">
                        {prescription?.doctorId}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Patient:{" "}
                      <Text weight={500} component="span">
                        {prescription?.recipientName}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Doctor:{" "}
                      <Text weight={500} component="span">
                        {prescription?.issuerName}
                      </Text>
                    </Text>
                  </Stack>
                  <Divider orientation="vertical" />
                  <Stack spacing={10}>
                    <Text weight={600}>Medication</Text>
                    <Divider />
                    <Text weight={600}>
                      Medication name:{" "}
                      <Text weight={500} component="span">
                        {prescription?.medicationName}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Medication strength:{" "}
                      <Text weight={500} component="span">
                        {prescription?.medicationStrength}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Medication type:{" "}
                      <Text weight={500} component="span">
                        {prescription?.medicationType}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Quantity:{" "}
                      <Text weight={500} component="span">
                        {prescription?.quantity}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Withdrawals:{" "}
                      <Text weight={500} component="span">
                        {prescription?.withdrawals}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Amount per withdrawal:{" "}
                      <Text w={500} component="span">
                        {prescription?.amountPerWithdrawal}
                      </Text>
                    </Text>
                  </Stack>
                  <Divider orientation="vertical" />
                  <Stack spacing={10}>
                    <Text weight={600}>Treatment</Text>
                    <Divider />
                    <Text weight={600}>
                      Illness:{" "}
                      <Text weight={500} component="span">
                        {prescription?.illness}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Dosage:{" "}
                      <Text weight={500} component="span">
                        {prescription?.dosage}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Frequency:{" "}
                      <Text weight={500} component="span">
                        {prescription?.frequency}
                      </Text>
                    </Text>
                    <Text weight={600}>
                      Treatment duration:{" "}
                      <Text weight={500} component="span">
                        {prescription?.treatmentDuration}
                      </Text>
                    </Text>
                  </Stack>
                </Group>
              </Group>

              <Button
                type="button"
                className="btn btn-primary"
                mt="20"
                size="md"
                variant="outline"
                color="#09ac8c"
                leftSection={<IconArrowNarrowLeft />}
                onClick={() => {
                  router.push(paths.rootDirectory + paths.managePrescription);
                }}
              >
                Return
              </Button>
            </Box>
          </Container>
        </div>
      )}
    </>
  );
};

export default FullPrescriptionsProfile;
