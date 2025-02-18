// import AnimatedBrand from '../AnimatedBrand';
// import { ScreenFitText } from '../ScreenFitText';
import Container from '@/components/Container';
import FooterNav from './FooterNav';

export default function Footer() {
  return (
    <footer className="relative bg-stone-900 overflow-hidden py-12 lg:px-6 mx-auto sm:mx-0 [&>*]:px-4 sm:[&>*]:px-0">
          <Container>

      {/* Outer container for the columns */}
      <div className="container lg:!px-20 lg:py-12 lg:border !overflow-visible lg:border-white lg:relative mx-auto">
        
        {/* Navigation columns */}
        <FooterNav />

        {/* Large brand text (hidden on small screens) */}
        {/* <div className="justify-center hidden lg:block font-righteous z-0 select-none">
          <ScreenFitText>
            <AnimatedBrand />
          </ScreenFitText>
        </div> */}

        {/* Horizontal rule on mobile */}
        <hr className="border-white w-full mt-14 mb-6 lg:hidden" />
      </div>

      {/* Footer bottom note */}
      <footer className="container mx-auto text-stone-200 line-height-0 lg:mt-2">
        <p>© {new Date().getFullYear()} Uproll. All rights reserved.</p>
      </footer>
      </Container>
    </footer>
  );
}