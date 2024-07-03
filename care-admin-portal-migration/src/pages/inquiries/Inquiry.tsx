import { Title, Container, Text, Button } from "@mantine/core";
import InquiryPreview from "../../components/inquiry/InquiryPreview";
import { IconCircleChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { PathsContext } from "../../components/path";
const Inquiry = () => {
  const router = useRouter();
  const { id } = router.query; // Get the id from the router query
  const paths = useContext(PathsContext);

  return (
    <Container mb={20} mt={50} maw={2000}>
      <Title mt={40} mb={40}>
        Inquiry #{id}
      </Title>
      <Button
        type="button"
        fw={700}
        variant="outline"
        color={"#09ac8c"}
        leftSection={<IconCircleChevronLeft size={28} />}
        onClick={() => {
          router.push(paths.browseInquiry);
        }}
      >
        <Text>Back to Inquiries</Text>
      </Button>
      <InquiryPreview id={Number(id)} />
    </Container>
  );
};

export default Inquiry;
