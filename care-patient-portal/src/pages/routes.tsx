import { createStore } from 'little-state-machine';
import { Fragment, Suspense} from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Route, Routes} from 'react-router-dom';
import VideoCallFrame from '../components/booking/video-call-frame';
import LoadingIndicator from '../components/loading-indicator';
import { initialState } from '../consultation-state';
import useProfile from '../hooks/use-profile';
import Container from '../components/layout/container';
import { ConsultationInfo } from './summary/details';
import { ConsultationHistory } from './summary/history';
import { Home } from './home';
import { Profile } from './profile';
import { Messages } from './messages';
import { Message } from './message';
import { Services } from './services/services';
import { Prescriptions } from './summary/prescription';
import { LabRequests } from './summary/labrequests';
import { Receipt } from './summary/receipt';
import { FollowUp } from './summary/followup';
import { HealthcareProvider } from './profile/view-provider';
import { Support } from './support/inquiry';
import { PrivacyPolicy } from './term-and-policy/privacy-policy';
import { CookiesPolicy } from './term-and-policy/cookies-policy';
import { TermsAndConditions } from './term-and-policy/terms-and-conditions';
import { Feedback } from './support/feedback';
import { Booking } from './booking';
import { WaitingRoom } from './booking/waiting-room';
import { NotFound } from './not-found';
import { CompleteProfile } from './profile/complete-profile';
import { routes } from './navigation';
import { Prescription } from './services/prescription';
import { Invitation } from './services/invitations';
import { Payment } from './booking/payment';

/*const { Home } = lazyImport(() => import('./home'), 'Home');
const { Message } = lazyImport(() => import('./message'), 'Message');
const { Messages } = lazyImport(() => import('./messages'), 'Messages');
const { NotFound } = lazyImport(() => import('./not-found'), 'NotFound');
const { Profile } = lazyImport(() => import('./profile'), 'Profile');
const { CompleteProfile } = lazyImport(() => import('./profile/complete-profile'), 'CompleteProfile');
const { Booking } = lazyImport(() => import('./booking'), 'Booking');
const { HealthcareProvider } = lazyImport(() => import('./profile/view-provider'), 'HealthcareProvider');
const { Services } = lazyImport(() => import('./services/services'), 'Services');
const { ConsultationInfo } = lazyImport(() => import('./summary/details'), 'ConsultationInfo');
const { Feedback } = lazyImport(() => import('./support/feedback'), 'Feedback');
const { Support } = lazyImport(() => import('./support/inquiry'), 'Support');
const { TermsAndConditions } = lazyImport(() => import('./term-and-policy/terms-and-conditions'), 'TermsAndConditions');
const { MedicalHistory } = lazyImport(() => import('./services/medical-history'), 'MedicalHistory');
const { WaitingRoom } = lazyImport(() => import('./booking/waiting-room'), 'WaitingRoom');
const { CookiesPolicy } = lazyImport(() => import('./term-and-policy/cookies-policy'), 'CookiesPolicy');
const { PrivacyPolicy } = lazyImport(() => import('./term-and-policy/privacy-policy'), 'PrivacyPolicy');
const { Prescriptions } = lazyImport(() => import('./summary/prescription'), 'Prescriptions');
const { FollowUp } = lazyImport(() => import('./summary/followup'), 'FollowUp');
const { ConsultationHistory } = lazyImport(() => import('./summary/history'), 'ConsultationHistory');
const { LabRequests } = lazyImport(() => import('./summary/labrequests'), 'LabRequests');
const { Receipt } = lazyImport(() => import('./summary/receipt'), 'Receipt');
const {VerifyPayment} = lazyImport(() => import('./booking/verify-payment'), 'VerifyPayment');*/
createStore(
	{
		...initialState,
	},
	{
		storageType: localStorage,
	}
);

const Router = () => {
	const { isProfileComplete, user, userLoading } = useProfile();
	
	 const nationalIdExists = !(user?.nationalIdNumber == null && (() => {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const createdAtDate = new Date(user?.createdAt);
        const nationalIdIncomplete = !user?.nationalIdNumber && user?.createdAt;

        return nationalIdIncomplete && createdAtDate < twoWeeksAgo;
    })());
	

	return userLoading && !user ? (
		<Container sx={{ margin: '10rem auto' }}>
		  <LoadingIndicator />
		</Container>
	  ) : (
		<Fragment>
		  {isProfileComplete ? (
			nationalIdExists ? (
			  <Suspense fallback={<LoadingIndicator />}>
				<Routes>
				  <Route
					path={routes.home.path}
					element={<Home />}
					hasErrorBoundary={true}
				  />
				  <Route path={routes.profile.path} element={<Profile />} />
				  <Route path={routes.messages.path}>
					<Route index={true} element={<Messages />} />
					<Route path={routes.message.path} element={<Message />} />
				  </Route>
				  <Route path={routes.services.path}>
					<Route index={true} element={<Services />} />
					<Route path={routes.consultations.path}>
					  <Route index={true} element={<ConsultationHistory />} />
					  <Route path={routes.consultation.path}>
						<Route index={true} element={<ConsultationInfo />} />
						<Route path={routes.lab.path} element={<LabRequests />} />
						<Route path={routes.receipt.path} element={<Receipt />} />
						<Route
						  path={routes.prescription.path}
						  element={<Prescription />}
						/>
					  </Route>
					</Route>
					<Route
					  path={routes.prescriptions.path}
					  element={<Prescriptions />}
					/>
					<Route path={routes.followup.path} element={<FollowUp />} />
					<Route path={routes.invitations.path} element={<Invitation />} />
				  </Route>
				  <Route
					path={routes.provider.path}
					element={<HealthcareProvider />}
				  />
				  <Route path={routes.support.path}>
					<Route index={true} element={<Support />} />
					<Route path={routes.privacy.path} element={<PrivacyPolicy />} />
					<Route path={routes.cookies.path} element={<CookiesPolicy />} />
					<Route
					  path={routes.termsConditions.path}
					  element={<TermsAndConditions />}
					/>
					<Route path={routes.feedback.path} element={<Feedback />} />
				  </Route>
				  <Route path={routes.booking.path}>
					<Route index={true} element={<Booking />} />
					<Route path={routes.payment.path} element={<Payment />} />
				  </Route>
				  <Route path={routes.waitingroom.path} element={<WaitingRoom />} />
				  <Route path={routes.call.path} element={<VideoCallFrame />} />
				  <Route path="*" element={<NotFound />} />
				</Routes>
			  </Suspense>
			) : (
			  <Routes>
				<Route path="*" element={<Profile />} />
			  </Routes>
			)
		  ) : (
			<Routes>
			  <Route path="*" element={<CompleteProfile />} />
			</Routes>
		  )}
		  <ReactQueryDevtools />
		</Fragment>
	  );
	}

export default Router;