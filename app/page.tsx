import Hero from "@/components/Hero";
import Top10Section from "@/components/Top10Section";
import FeedbackBanner from "@/components/FeedbackBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-tldr-dark">
      <Hero />
      <Top10Section />
      <FeedbackBanner />
    </main>
  );
}
