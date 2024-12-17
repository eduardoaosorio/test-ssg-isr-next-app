const mockFetch = <T>(
  data: T
): Promise<{ ok: true; json: () => Promise<T> }> => {
  // Simulate fetching data from a backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        json: () => Promise.resolve(data),
      });
    }, 1000);
  });
};

const landingPages = [
  { id: 1, slug: "talent/john-doe/super-bulk" },
  { id: 2, slug: "talent/jane-doe/super-shred" },
  { id: 3, slug: "talent/joe-smith/super-strength" },
] as const;

const mockGetLandingPages = () => {
  // Simulate fetching all landing pages from a backend
  return mockFetch(landingPages);
};

const talentPageRegex = /^talent\/[\w-]+\/[\w-]+$/;

const mockGetLandingPageDetails = (slug: string) => {
  const landingPage = landingPages.find((page) => page.slug === slug);

  const title = slug.replace("/", " ");

  if (landingPage) {
    // Simulate fetching specific landing page details from a backend
    return mockFetch({
      id: landingPage.id,
      title,
      slug,
      sections: [
        { id: 1, title: "Section 1", content: "Section 1 content" },
        { id: 2, title: "Section 2", content: "Section 2 content" },
        { id: 3, title: "Section 3", content: "Section 3 content" },
      ],
      seo: {
        metaTitle: `${title} - Meta Title`,
        metaDescription: `${title} - Meta Description`,
      },
    });
  }

  const isTalentPage = talentPageRegex.test(slug);

  // Simulate fetching specific landing page details from a backend
  // When the page is not among landingPages (pre-rendered), i.e. generated via SSR
  if (isTalentPage) {
    return mockFetch({
      id: Math.floor(Math.random() * 1000),
      title,
      slug,
      sections: [
        { id: 1, title: "Section 1", content: "Section 1 content" },
        { id: 2, title: "Section 2", content: "Section 2 content" },
        { id: 3, title: "Section 3", content: "Section 3 content" },
      ],
      seo: {
        metaTitle: `${title} - Meta Title`,
        metaDescription: `${title} - Meta Description`,
      },
    });
  }

  throw new Error(`Landing page not found for slug: ${slug}`);
};

export { mockFetch, mockGetLandingPages, mockGetLandingPageDetails };
