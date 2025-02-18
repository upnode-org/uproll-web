import { ConfigDetails } from "@/components/config/config-details";
import Container from "@/components/Container";
import HeroWrapper from "@/components/HeroWrapper";

export default function ConfigurePage() {
  return (
    <>
      <HeroWrapper className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-b border-stone-900">
        <Container className="p-10">
          <h1 className="text-4xl font-bold">Create a new config and deploy in minutes</h1>
        </Container>
      </HeroWrapper>
      <Container className="border-stone-900 pt-7">
        <ConfigDetails />
      </Container>
    </>
  );
}
