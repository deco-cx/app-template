import { BlogPostPage } from "apps/blog/types.ts";
import ListingPageBanner, {
  ImageSizes,
} from "../../components/product/ListingPageBanner.tsx";
import Section from "../../components/ui/Section.tsx";

export interface Props {
  /**
   * @title Blogpost Page integration
   */
  postPage: BlogPostPage | null;
}

const IMAGES_SIZES = {
  desktopWidth: 1280,
  desktopHeight: 400,
  mobileWidth: 375,
  mobileHeight: 232,
} as ImageSizes;

export default function BlogpostBanner(
  { postPage }: Props,
) {
  if (!postPage) {
    return <></>;
  }
  return (
    <ListingPageBanner
      image={postPage.post.image}
      mobileImage={postPage.post.image}
      imageSizes={IMAGES_SIZES}
      disabledOpacity={true}
    />
  );
}

export const LoadingFallback = () => (
  <Section.Placeholder height="250px" class="h-[235px] sm:min-h-[400px]" />
);
