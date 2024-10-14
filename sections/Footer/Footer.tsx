import { type ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";
import Collumn, {
  Props as CollumProps,
} from "../../components/footer/Collumn.tsx";

/** @titleBy alt */
export interface ImageProps {
  src: ImageWidget;
  alt: string;
  link: string;
  isBlank?: boolean;
  width?: number;
  height?: number;
}
interface Props {
  logo: ImageWidget;
  collumns: CollumProps[];
  richText: RichText;
  images?: ImageProps[];
}

function Footer({
  images,
  logo,
  richText,
  collumns,
}: Props) {
  return (
    <footer class="py-14 mt-14 max-md:px-4 max-md:py-10 max-lg:flex-wrap container text-sm">
      <div class="flex flex-col gap-8">
        <Image src={logo} width={150} height={18} />
        <div class="flex justify-between gap-5 md:gap-10 max-md:flex-col text-secondary">
          {collumns.map((props) => <Collumn {...props} />)}
        </div>
        <div class="flex justify-between gap-8 md:gap-10 lg:h-12 items-center max-lg:flex-wrap max-lg:justify-center">
          <div
            class="text-xxs text-info max-w-[684px]"
            dangerouslySetInnerHTML={{ __html: richText }}
          />
          <div class="flex items-center flex-shrink">
            {images?.map(({ src, alt, link, height, isBlank, width }) => (
              <a
                href={link}
                target={isBlank ? "_blank" : "_self"}
                rel={isBlank ? "noopener noreferrer" : ""}
              >
                <Image
                  class="flex-shrink"
                  src={src}
                  alt={alt}
                  height={height || 44}
                  width={width || 96}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
