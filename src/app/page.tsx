import Hero from "@/components/Home/Hero";
import FeaturedPosts from "@/components/blog/FeaturedPosts";
import RecentPosts from "@/components/blog/RecentPosts";
import NewsletterSection from "@/components/Home/NewsletterSection";
import CategoryBar from "@/components/blog/CategoryBar";

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
      <CategoryBar/>
      <RecentPosts category={category} />
      <NewsletterSection />
    </>
  );
}
