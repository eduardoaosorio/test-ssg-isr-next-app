import { GetStaticPaths, GetStaticProps } from "next";
import {
  mockGetLandingPages,
  mockGetLandingPageDetails,
} from "../../utils/mocks";

interface Section {
  id: number;
  title: string;
  content: string;
}

interface LandingPageProps {
  pageData: {
    id?: number;
    title: string;
    slug: string;
    sections: Section[];
    seo: {
      metaTitle: string;
      metaDescription: string;
    };
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all landing page slugs from backend
  const response = await mockGetLandingPages();
  const landingPages = await response.json();

  // Generate paths for all landing pages
  const paths = landingPages.map((page) => ({
    params: { slug: page.slug.split("/") },
  }));

  return {
    paths,
    fallback: "blocking", // New pages will be generated on-demand
  };
};

export const getStaticProps: GetStaticProps<LandingPageProps> = async ({
  params,
}) => {
  try {
    const { slug } = params as { slug: string[] };

    const slugString = slug.join("/");

    // Fetch specific landing page data from backend
    const response = await mockGetLandingPageDetails(slugString);

    if (!response.ok) {
      return {
        notFound: true, // Returns 404 if page doesn't exist
      };
    }

    const pageData = await response.json();

    return {
      props: {
        pageData,
      },
      // Next.js will invalidate the cache when a
      // request comes in, at most once every 60 seconds.
      revalidate: 60, // Regenerate page every 60 seconds
    };
  } catch (error) {
    console.error("Failed to fetch landing page data", error);
    return {
      notFound: true,
    };
  }
};

const LandingPage = ({ pageData }: LandingPageProps) => {
  // Render landing page using pageData
  return (
    <div>
      <h1>{pageData.title}</h1>
      {pageData.sections.map((section) => (
        <div key={section.id}>
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default LandingPage;
