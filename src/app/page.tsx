import Hero from "@/components/shared/Hero";
import FeaturedPosts from "@/features/blog/components/FeaturedPosts";
import RecentPosts from "@/features/blog/components/RecentPosts";
import CategoryBar from "@/features/blog/components/CategoryBar";
import NewsletterSection from "@/components/shared/NewsletterSection";

type PageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const category =
    typeof params?.category === "string"
      ? params.category
      : undefined;

  return (
    <>
      <Hero />
      <FeaturedPosts />
      <CategoryBar />
      <RecentPosts category={category} />
      <NewsletterSection />
    </>
  );
}
