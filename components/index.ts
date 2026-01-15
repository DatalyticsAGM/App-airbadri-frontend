/**
 * Components Barrel Export
 * 
 * Export centralizado de todos los componentes del proyecto
 * Facilita imports limpios: import { Header, Footer } from '@/components'
 */

// Shared/Landing components
export {
  Header,
  Footer,
  HeroSection,
  FeaturesSection,
  PromotionsSection,
  CTASection,
  TopbarOffers,
} from './shared';

// Auth components
export {
  AuthButton,
  LoginForm,
  SignupForm,
  ForgotPasswordForm,
  ResetPasswordForm,
} from './auth';

// Properties components
export {
  PropertyCard,
  PropertyGrid,
  PropertyFiltersComponent,
  PropertyDetail,
  CreatePropertyForm,
  EditPropertyForm,
} from './properties';

// Bookings components
export { BookingForm } from './bookings';

