/* eslint-disable react/no-unescaped-entities */
import '../../assets/styles/pages/extraPages.css';
import { ActionIcon, Button, createStyles, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { BsArrowUpCircle } from 'react-icons/bs';
import { useGuardedNavigation } from '../navigation';

export const TermsAndConditions = () => {
	const { t } = useTranslation(['default']);
	const { navigate } = useGuardedNavigation();
	const [showBackToTop, setShowBackToTop] = useState(false);
	const { classes } = useStyles({ showBackToTop });

	useEffect(() => {
		const handleScroll = () => {
			if (window.pageYOffset > 200) {
				setShowBackToTop(true);
			} else {
				setShowBackToTop(false);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleBackToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className="container">
			<h1>Terms and Conditions</h1>
			<p className="text">
				The followings are the Terms and Conditions (the "Agreement"), which
				govern your access and use of CARELYO products, namely Carelyo Cloud
				Connect Hospital Software, Carelyo Cloud Connect Clinic Software,
				Carelyo Cloud Connect Independent Doctor Software which can be used for
				the provision of telehealth services (collectively the "Platforms,
				Services"). The Terms and Conditions Policy, together with the Privacy
				Policy, form a legal contract between you and the Company governing your
				access to and use of the Platforms. Please read the Terms and Privacy
				Policy carefully before using the Platforms. If you do not agree with
				and accept these Terms of Use and the Privacy Policy, do not use the
				Platform. BY CLICKING "ON ACCEPT", YOU ARE ENTERING INTO A LEGALLY
				BINDING AGREEMENT TO THESE TERMS OF USE AND THE PRIVACY POLICY, JUST AS
				YOU WOULD BY SIGNING A PAPER CONTRACT. When the terms "we", "us", "our",
				or similar are used in this Agreement, they refer to the Company that
				owns and operates the Platforms (the "Company").
			</p>
			<h2>What We Do</h2>
			<p className="text">
				Our services are provided through the Platforms which allow
				participating medical professionals ("Healthcare Providers" or
				"Providers") to communicate with their clients and patients ("Patients")
				for the provision of healthcare services online via a secure Internet
				connection (the "Services"). We are not a medical service provider,
				health insurance company, or licensed to sell health insurance. THE USE
				OF OUR PLATFORMS IS NOT APPROPRIATE FOR EMERGENCIES. IF YOU THINK YOU
				HAVE A MEDICAL OR MENTAL HEALTH EMERGENCY, WE SUGGEST YOU GO TO THE
				NEAREST OPEN CLINIC OR EMERGENCY ROOM.
			</p>
			<h3>Platform Content</h3>
			<p className="text">
				While the Platforms may provide access to certain general medical
				information and also allow patients to communicate with healthcare
				providers, the services we provide cannot and should not be constituted
				as medical advice. The content on the Platforms is not and should not be
				considered medical advice or a substitute for individual medical advice,
				diagnosis, or treatment. You should always talk to your healthcare
				providers for diagnosis and treatment, including information regarding
				which drugs, therapy, or other treatment may be appropriate for you.
				None of the information on the Platforms represents or warrants that any
				particular drug, therapy or other treatment is safe, appropriate, or
				effective for you. Further, a health care provider's ability to use our
				services is not an endorsement or recommendation of that health care
				provider by the Company. If you receive medical advice from a health
				care provider through the Platforms, that advice will be based on the
				personal health information that you have provided to the provider and
				the standards of care for your current symptoms according to the
				information you have provided. Your healthcare provider's medical advice
				is not within the Company's control, and neither is it given to or used
				by the Company.
			</p>
			<h3>User Accounts</h3>
			<p className="text">
				When you register on the Platform, you are required to create an
				individual user account ("Account") by entering your name, email
				address, and password and providing certain information collected by the
				Platform (collectively "Account Information"). To create an Account, you
				must be of legal age to form a binding contract. By using this Platform,
				you represent, acknowledge and agree that you are at least 18 years of
				age, or if you are under 18 years of age but are at least 13 years old
				(a "Minor") and that you are using the Platform with the consent of your
				parent or legal guardian and that you have received your parent's or
				legal guardian's permission to use the Platform and agree to its Terms
				of use. If you are a parent or legal guardian of a Minor, you hereby
				agree to bind the Minor to these Terms of Use and to fully indemnify and
				hold the Company harmless if the Minor breaches any of these Terms. If
				you are not at least 13 years old, you may not use the Platform at any
				time or in any manner or submit any information to the Platform without
				parantal guidance . You agree that the Account Information that you
				always provide to us, including during registration and any such
				information which you upload to the Platform, will be true, accurate,
				current, and complete. You may not transfer or share your Account
				password with anyone or create more than one Account. You are
				responsible for maintaining the confidentiality of your Account password
				and for all activities that occur under your Account. The Company
				reserves the right to take any action, as it deems necessary or
				reasonable, regarding the security of the Platform and your Account
				Information. In no event and under no circumstances shall the Company be
				held liable to you for any liabilities or damages resulting from or
				arising out of your use of the Platform, your use of the Account
				Information or your release of the Account Information to a third party.
				You may not use anyone else's Account at any time. By signing into your
				Account and making the necessary modifications, you can modify, amend,
				or delete any information that is stored there. You acknowledge that you
				may not register for an account on behalf of anybody other than yourself
				or behalf of any group or entity unless you have the necessary authority
				to bind that person, group, or entity to these Terms. By registering
				another person, organization, or business, you hereby warrant that you
				have the necessary permissions. Healthcare Provider Registration. To
				register, Healthcare Providers must provide certain information about
				themselves and their practices, including the Healthcare Provider's
				name, date of birth, gender, address, email, mobile and work phone, and
				any government approved means of identification. We may also collect
				certain optional information, including middle name or initial, bank
				account or other payment information and other contact details, picture
				and communication preferences. In no event and under no circumstances
				shall the Company be held liable to you for any liabilities or damages
				resulting from or arising out of your use of the Platform, your use of
				the Account Information or your release of the Account Information to a
				third party. You may not use anyone else's Account at any time.
			</p>
			<h3>Access Rights</h3>
			<p className="text">
				We hereby grant to you a limited, non-exclusive, and non-transferable
				right to access the Platform and use it solely for your personal use and
				only as permitted under these Terms of Use and any separate agreements
				you may have entered with us ("Access Rights"). We reserve the right, in
				our sole discretion, to deny or suspend the use of the Platform to
				anyone for any reason. You agree that you will not, and will not attempt
				to: ● impersonate any person or entity, or otherwise misrepresent your
				affiliation with a person or entity; ● use the Platform to violate any
				local, state, national or international law; ● reverse engineer,
				disassemble, decompile, or translate any software or other components of
				the Platforms or services; ● distribute viruses or other harmful
				computer code through the Platform or ● otherwise, use the services or
				Platform in any manner that exceeds the scope of use granted above. In
				addition, you agree to refrain from abusive language and behaviour,
				which could be regarded as inappropriate, or conduct that is unlawful or
				illegal when communicating with your healthcare provider through the
				Platform. The Company is not responsible for any interactions with
				health care providers conducted through this Platform. We strongly
				recommend that you do not use the services on public computers. We also
				recommend that you do not store your Account password through your web
				browser or other software. In addition, when using our Platforms, you
				agree not to do any of the following: • Defame, abuse, harass, stalk,
				threaten, or otherwise violate the legal rights (such as rights of
				privacy and publicity) of others. • Use racially, ethnically, or
				otherwise offensive language. • Discuss or incite illegal activity. •
				Use explicit/obscene language or solicit/post sexually explicit images
				(actual or simulated). • Post anything that exploits children or minors.
				• Post any copyrighted or trademarked materials without express
				permission from the owner. • Disseminate any unsolicited or unauthorized
				advertising, promotional materials, 'junk mail', 'spam', 'chain
				letters', 'pyramid schemes', or any other form of such solicitation. •
				Post anything contrary to our public image, goodwill or reputation.
				Patient and Health Care Provider Responsibilities. If you are a Patient,
				you accept responsibility for yourself in the use of the Platforms. You
				acknowledge that your relationship for health care services is with your
				healthcare provider, and your obtaining services from the Healthcare
				Provider is solely at your own risk, and you assume full responsibility
				for all risk associated therewith, to the extent permitted by law. By
				using the Service, you agree to not hold the Company liable in any way
				for any malpractice or substandard treatment the Healthcare Provider may
				render. We do not confirm the credentials of Healthcare Providers using
				our Platforms and do not validate that they are in good standing with
				their respective licensing and regulatory bodies. It is the patient's
				responsibility to separately confirm that a healthcare Provider is in
				good standing with his or her respective licensing and regulatory
				bodies. If you are a Healthcare Provider, you accept responsibility for
				your Patients as well as yourself in the use of these Platforms. You are
				also responsible for the quality of the services you provide during your
				use of the Platforms and for complying with all applicable laws in
				connection with your use of the Platforms. For example, you are
				responsible for obtaining licenses and certifications which may be
				required to practice your profession when using these Platforms and
				maintaining malpractice and liability insurance in compliance with
				regulatory and local requirements. You are also responsible for
				obtaining the relevant Patient consent required by law and complying
				with any and all privacy laws applicable to the use of this Platform
				with your patients. The Company has established reasonable safeguards
				and procedures to protect the security of patient information, but you
				must also take steps to protect your privacy and confidentiality of that
				of your patients We make no representations regarding your ability to
				bill patients for the services you provide using the Platform. You are
				responsible for complying with all laws in billing for the services you
				provide.
			</p>{' '}
			<h3>Payment </h3>
			<p className="text">
				The Company has no say in the fees to be charged by the health care
				provider. The chargeable fees may vary based on the level of expertise
				of the particular onboarded doctor. The Company will, however be
				entitled to retain between 18.5 to 20% of the consultation fees for each
				successful consultation as processing fees. The processing fees will be
				used for handling payment gateway charges, tax, fund transfer costs, and
				other service charges.
			</p>{' '}
			<h3>Termination</h3>
			<p className="text">
				By deactivating your Account on the Platform or sending us an email at
				info@swedcon18.com, you can cancel your registration at any time for any
				reason. Your use of the Platform, your Account, and/or your registration
				may all be suspended or terminated by the Company at any time and for
				any reason. According to its internal record retention and/or content
				destruction rules, the Company reserves the right to maintain, delete,
				or destroy any communications or materials submitted or uploaded to the
				Platform, subject to any relevant laws. After such termination, we won't
				be required to continue offering the services.
			</p>{' '}
			<h3>Right to Modify</h3>
			<p className="text">
				You understand, agree, and acknowledge that we may modify, suspend,
				disrupt or discontinue the Platform, any part of the Platform or the use
				of the Platform, whether to all customers or you specifically, at any
				time with or without notice to you at our sole discretion. Continued use
				of the Platform or our services following notice of any such changes
				will indicate your acknowledgement of such changes and Agreement to be
				bound by the revised Terms of Use, inclusive of such changes. The
				Platform depends on various factors such as software, hardware and
				tools, either owned by the Platform or those owned and/or operated by
				our contractors and suppliers. While we make commercially reasonable
				efforts to ensure the Platform's reliability and accessibility, you
				understand and agree that no platform can be 100% reliable and
				accessible and so we cannot guarantee that access to the Platform will
				be uninterrupted or that it will be accessible, consistent, timely or
				errorfree at all times. DISCLAIMER OF WARRANTIES AND LIMITATION OF
				LIABILITY YOU EXPRESSLY AGREE THAT THE USE OF THE PLATFORM IS AT YOUR
				SOLE RISK. THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE"
				BASIS. THE COMPANY EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND,
				WHETHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY
				WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR USE OR PURPOSE,
				NON-INFRINGEMENT, TITLE, OPERABILITY, CONDITION, QUIET ENJOYMENT, VALUE,
				ACCURACY OF DATA AND SYSTEM INTEGRATION. YOU HEREBY RELEASE US AND AGREE
				TO HOLD US HARMLESS FROM ANY AND ALL CAUSES OF ACTION AND CLAIMS OF ANY
				NATURE RESULTING FROM THE HEALTH PROFESSIONAL SERVICES OR THE PLATFORM,
				INCLUDING (WITHOUT LIMITATION) ANY ACT, OMISSION, OPINION, DIAGNOSIS,
				RESPONSE, ADVICE, SUGGESTION, INFORMATION AND/OR SERVICE OF ANY
				PROFESSIONAL AND/OR ANY OTHER CONTENT OR INFORMATION ACCESSIBLE THROUGH
				THE PLATFORM. YOU UNDERSTAND THAT TO THE EXTENT PERMITTED UNDER
				APPLICABLE LAW, IN NO EVENT WILL THE COMPANY OR THEIR OFFICERS,
				EMPLOYEES, DIRECTORS, PARENTS, SUBSIDIARIES, AFFILIATES, AGENTS OR
				LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL
				OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF
				REVENUES, PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES
				ARISING OUT OF OR RELATED TO YOUR USE OF THE PLATFORM, REGARDLESS OF
				WHETHER SUCH DAMAGES ARE BASED ON CONTRACT, TORT (INCLUDING NEGLIGENCE
				AND STRICT LIABILITY), WARRANTY, STATUTE OR OTHERWISE. To the extent
				that we may not, as a matter of applicable law, disclaim any implied
				warranty or limit our liabilities, the scope and duration of such
				warranty and the extent of our liability will be the minimum permitted
				under such applicable law.
			</p>{' '}
			<h3>Indemnification</h3>
			<p className="text">
				You agree to indemnify, defend, and hold harmless the Company, their
				officers, directors, employees, agents, subsidiaries, affiliates,
				licensors, and suppliers, harmless from and against any claim, actions,
				demands, liabilities and settlements, including without limitation
				reasonable legal and accounting fees ("Claims"), resulting from, or
				alleged to result from, your violation of these Terms of Use.
			</p>
			<h3>Geographical Restrictions</h3>
			<p className="text">
				The Company makes no representation that all products, services and/or
				material described on the Platforms are appropriate or available for use
				in locations outside Nigeria/Ghana.
			</p>
			<h3>Disclosure</h3>
			<p className="text">
				You may choose to report complaints against a Healthcare Professional to
				the management of the Platform as a first resort. The Platform is
				committed to the protection of the rights and interests of all
				Users/Patients of the Platform and will be willing to escalate such
				complaints to relevant professional bodies, as required. However, for no
				reason and in no circumstances shall the Company be held liable or
				responsible for any such complaint made against any Health Professional
				using the Platform or any such act of any of the Health Professionals.
				The Health Professionals are independent providers who are neither our
				employees nor agents nor representatives. The Platform's role is limited
				to enabling their Services, while the Health Professional Services
				themselves are the responsibility of the Professionals who provides
				them. If you feel the Services provided by the Health Professional do
				not fit your needs or expectations, you may change to a different
				Professional who provides services through the Platform. While we hope
				the Health Professional Services are beneficial to you, you understand,
				agree and acknowledge that they may not be the appropriate solution for
				everyone's needs and that they may not be appropriate for every
				situation and/or may not be a complete substitute for a face-to face
				examination and/or care in every situation like emergencies as stated
				earlier in this term of use.
			</p>
			<h3>Web Links</h3>
			<p className="text">
				This Platform may be linked to other websites (collectively,
				"Third-Party Sites"). Certain areas of the Platform may allow you to
				interact and/or conduct transactions with such Third-Party Sites and, if
				applicable, allow you to configure your privacy settings in your
				Third-Party Site account to permit your activities on this Platform to
				be shared with your contacts in your Third-Party Site account and, in
				certain situations, you may be transferred to a Third-Party Site through
				a link but it may appear that you are still on this Platform In any
				case, you acknowledge and agree that the Third-Party Sites may have
				different privacy policies and terms and conditions and/or user guides
				and business practices than this Platform, and you further acknowledge
				and agree that your use of such ThirdParty Sites is governed by the
				respective Third-Party Site privacy policy and terms and conditions
				and/or user guides. WE WILL NOT BE LIABLE FOR ANY INFORMATION, SOFTWARE,
				OR THIRD-PARTY LINKS FOUND AT ANY OTHER APP, WEBSITE, INTERNET LOCATION,
				OR SOURCE OF INFORMATION, NOR FOR YOUR USE OF SUCH INFORMATION, SOFTWARE
				OR THIRD-PARTY LINKS, NOR THE ACTS OR OMISSIONS OF ANY SUCH PLATFORMS OR
				THEIR RESPECTIVE OPERATORS AND THIS IS IRRESPECTIVE OF THE FACT THAT OUR
				PLATFORM MAY CONTAIN LINKS TO SUCH SITES OPERATED BY THIRD PARTIES. WE
				RECOMMEND THAT YOU REVIEW THE POLICIES OF EACH WEBSITE YOU VISIT.
			</p>
			<h3>Ownership</h3>
			<p className="text">
				The Platform and its entire contents, features, and functionality
				(including but not limited to all information, software, text, displays,
				images, video and audio, and the design, selection and arrangement
				thereof) are owned by the Company, its licensors or other providers of
				such material—these Terms of Use permit you to use the Platform for your
				personal, non-commercial use only. You must not reproduce, distribute,
				modify, create derivative works of, publicly display, publicly perform,
				republish, download, store or transmit any of the material on our
				Platform except as generally and ordinarily permitted through the
				Platform according to these Terms of Use. You must not access or use for
				any commercial purposes any part of the Platform or any services or
				materials available through the Platform.
			</p>
			<h3>Trademarks</h3>
			<p className="text">
				Certain use of the names, logos, and other materials displayed on the
				Platform may constitute trademarks, trade names, service marks, or logos
				("Marks") of the Company or other entities. You are not authorized to
				use any such Marks without the express written permission of the Company
				. Ownership of all such Marks and the goodwill associated therewith
				remains with us or those other entities
			</p>
			<h3>Intellectual Property Infringement</h3>
			<p className="text">
				The Company respects the intellectual property rights of others, and we
				ask you to do the same. The Company may, in appropriate circumstances
				and at our discretion, terminate Service and/or access to this Platform
				for users who infringe the intellectual property rights of others.
			</p>
			<h3>Geographical Restrictions</h3>
			<p className="text">
				The Company makes no representation that all products, services and/or
				material described on the Platforms are appropriate or available for use
				in locations outside Nigeria/Ghana.
			</p>
			<h3>Privacy and Communications</h3>
			<p className="text">
				We may gather information about you while you access and/or use the
				Platform and the Services, or you may be required to give us specific
				information. Your information will be used in line with how it is
				described in our Privacy Policy, which is a fundamental component of
				these Terms. Utilizing the Platform and/or creating an account signifies
				your acceptance of our Privacy Policy, as it may be updated from time to
				time. You must stop using the Platform if you disagree with any way that
				the Privacy Policy describes using your information. BY AGREEING TO THIS
				AGREEMENT AND/OR BY USING THE PLATFORM, YOU ALSO AGREE TO THE TERMS OF
				THE PRIVACY POLICY. THE PRIVACY POLICY IS INCORPORATED INTO AND DEEMED A
				PART OF THIS AGREEMENT. You understand that by checking the "agree" box
				for these Terms of Use and/or any other forms presented to you on the
				Platform, you agree to these Terms of Use and that such action
				constitutes a legal signature. You agree that we may send to you
				Communications through any or all of the electronic means, including but
				not limited to: (1) by email, using the address that you provided to us
				during registration, (2) via short messaging service ("SMS") text
				message to the mobile number you provided us during registration ("SMS
				Messages"), (3) push notifications on your tablet or mobile device, or
				(4) by posting Communications on the Platform. The delivery of any
				Communications from us is effective when sent by us, regardless of
				whether you read the Communication. You can withdraw your consent to
				receive Communications by selecting your notification preference under
				the Settings link in your Account or, in extreme cases, by deactivating
				your Account. While secure electronic messaging is always preferred to
				insecure email, under certain circumstances, insecure email
				communication may take place between you and the Company. The Company
				cannot ensure the security or confidentiality of messages sent by email.
			</p>
			<h3>Miscellaneous</h3>
			<p className="text">
				These Terms of Use and use of the Platforms shall be governed by the
				laws of the Federal Republic of Nigeria and Ghana depending on which is
				applicable. Any dispute arising under or relating in any way to these
				terms of use will be resolved by mediation in Lagos/Accra where
				applicable and, in other instances, under the rules of the relevant
				court and/or jurisdiction, except that either party may bring a claim
				related to intellectual property rights or seek temporary and
				preliminary specific performance and injunctive relief, in any court of
				competent jurisdiction, without the posting of a bond or other security.
				All claims, whether in arbitration or otherwise, must be brought solely
				in your individual capacity and not as a class member in any purported
				class or collective proceeding. No waiver by the Company of any term or
				condition set forth in these Terms of Use shall be deemed a further or
				continuing waiver of such term or condition or a waiver of any other
				term or condition, and any failure of the Company to assert a right or
				provision under these Terms of Use shall not constitute a waiver of such
				right or provision. If any provision of these Terms of Use is held by a
				court or other tribunal of competent jurisdiction to be invalid,
				illegal, or unenforceable for any reason, such provision shall be
				eliminated or limited to the minimum extent such that the remaining
				provisions of the Terms of Use will continue in full force and effect.
			</p>
			<h3>Changes to this Terms of Use</h3>
			<p className="text">
				The Company may modify these Terms of Use from time to time on an ad-hoc
				basis to reflect our current privacy practices as well as the legal,
				regulatory, and operating environment, and such revised versions will
				automatically become applicable to you. When we make changes to this
				statement, we will revise the "updated" date at the top of this page,
				and such revised terms become effective as at the time it is posted. We
				encourage you to periodically review these Terms of Use.
			</p>
			<h3>Grievance</h3>
			<p className="text">
				If you have any grievance relating to the clauses mentioned in this
				policy, please write to info@carelyo.com
			</p>
			<Tooltip label="Back to top" position="right">
				<ActionIcon
					size="lg"
					color="teal"
					onClick={handleBackToTop}
					className={classes.buttonStyles}
				>
					<BsArrowUpCircle size={28} />
				</ActionIcon>
			</Tooltip>
			<Button
				className="back-button"
				onClick={() => {
					navigate('home');
				}}
			>
				{t('tr.go-back')}
			</Button>
		</div>
	);
};

const useStyles = createStyles(
	(theme, { showBackToTop }: { showBackToTop: boolean }) => ({
		buttonStyles: {
			display: showBackToTop ? 'block' : 'none',
			position: 'fixed',
			bottom: '50px',
			right: '20px',
		},
	})
);
