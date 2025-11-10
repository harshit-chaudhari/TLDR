import Hero from "@/components/Hero";
import ContentBrowser from "@/components/ContentBrowser";
import FeedbackBanner from "@/components/FeedbackBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-tldr-dark">
      <Hero />
      <ContentBrowser />
      <FeedbackBanner />
    </main>
  );
}
