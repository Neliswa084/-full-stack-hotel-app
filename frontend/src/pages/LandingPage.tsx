import { NavBar } from '../components/NavBar/NavBar'
import { Hero } from '../components/Hero/Hero'
import { Footer } from '../components/Footer/Footer'
import { WhyChooseUs } from '../components/WhyChooseUs/WhyChooseUs'
import { FeaturedHotels } from '../components/FeaturedHotels/FeaturedHotels'



export const LandingPage = () => {

  return (
<>
   -  <NavBar />
      <Hero />
      <FeaturedHotels />
      <WhyChooseUs />
      <Footer />
 
     </>
  )
}
