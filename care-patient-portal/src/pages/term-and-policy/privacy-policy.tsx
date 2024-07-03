/* eslint-disable react/no-unescaped-entities */
import '../../assets/styles/pages/extraPages.css';
import {
	ActionIcon,
	Box,
	Button,
	Center,
	createStyles,
	Title,
	Tooltip,
	TypographyStylesProvider,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { BsArrowUpCircle } from 'react-icons/bs';
import { useGuardedNavigation } from '../navigation';
import { Text } from '@mantine/core';

export const PrivacyPolicy = () => {
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
			<Title
				order={1}
				size="h1"
				style={{ marginTop: '20px', marginBottom: '40px' }}
			>
				CARELYO PRIVACY POLICY
			</Title>
			<Text component="div">
				<TypographyStylesProvider>
					<h1>1.0 About Your Privacy and This Privacy Policy</h1>
					<p className="text">
						<span style={{ fontWeight: 'bold', color: '#000000' }}>
							CARELYO
						</span>
						- (“we,” “our,” and/or “us”) values the privacy of individuals who
						visit or use our platform, and such other platforms we may create
						from time to time (collectively, our “Platform”). This privacy
						policy explains how we collect, use, and share information from
						users of our Platform (“Users, Customers, Patients, Healthcare
						Providers, Partners).
					</p>
					<p className="text">
						This Privacy Policy is developed by <b>CARELYO</b> is in full
						compliance with the <b>Nigerian Data Protection Act 2023</b>and{' '}
						<b>the Data Protection Act 2012 of Ghana</b> and other relevant
						countries in sub-Sahara Africa we operate. In line with these laws,
						it is our responsibility as a company to bring this policy to the
						attention of all interested parties and stakeholders that provide us
						with their personal data. By providing your personal information or
						data, you acknowledge that we may use it only in the ways set out in
						this Privacy Policy. We may provide you with further notices
						highlighting certain uses we wish to make of your personal
						information.
					</p>

					<p className="text">
						This Privacy Policy outlines your rights regarding privacy and
						details our procedures for collecting, using, storing, and, if
						required, sharing your personal data as part of our service
						provision.
					</p>
					<p className="text">
						Your privacy holds immense importance to us. We dedicate significant
						thought, effort, tools, and resources toward safeguarding the
						confidentiality of the information you entrust to us. Committed to
						the proper handling of personal information (also known as 'personal
						data' or 'personally identifiable information') gathered through our
						Platform, this policy comprehensively addresses privacy concerns
						during your Platform usage.
					</p>
					<p className="text">
						{' '}
						Please read this Privacy Policy carefully to understand and learn
						more about our views, policies, procedures, and practices regarding
						the collection of information and personal information, how we
						collect, use, share, disclose and protect the personal information
						that we have obtained.{' '}
						<b>
							BY ACCESSING AND USING OUR PLATFORM AND, OR COMMUNICATING WITH US
							IN ANY MANNER, YOU REPRESENT THAT YOU HAVE READ AND UNDERSTOOD
							THIS PRIVACY POLICY.
						</b>
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>2.0 Definitions:</h2>
					<p className="text">
						For the purpose of this privacy policy
						<b>Country</b>: When we mention 'country' within this privacy
						policy, we are specifically referring to Nigeria, Ghana, and other
						countries within the Sub-Saharan African region unless expressly
						specified otherwise.
						<b>Personal Data</b>: refers to any information that pertains to an
						identified or identifiable individual. This includes all details we
						collect or retain about users, stakeholders, and other involved
						parties, whether obtained directly or indirectly. It encompasses
						online data that can identify a person, such as names, addresses,
						phone numbers, passport IDs, national identification numbers,
						usernames, passwords, digital footprints, photographs, and financial
						information.
						<b>Service Provider</b>: A data processor refers to any natural or
						legal person entrusted by the Company to handle data. This includes
						third-party entities or individuals engaged by the Company to
						facilitate, provide, or support the Service, perform services
						associated with it, or aid the Company in analysing Service usage.{' '}
						<b>Third-Party Social Media Platforms</b>: refers to any website or
						social network website to which a user can log in to assess our
						Platform. <b>CARELYO</b>: is referred to as either “We” “Us” or
						“Our” in this Policy. You: These terms encompass patients, doctors,
						care providers, users, beneficiaries, third-party vendors, agents,
						healthcare providers, their affiliated firms, and other
						stakeholders. They represent individuals or entities from whom we
						collect personal data or instruct to collect and process such data
						on our behalf.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>3.0 Our Privacy Principles</h2>
					<p className="text">
						Personal information provided by you is processed fairly, lawfully,
						and in a transparent manner. The personal information you provide is
						collected for a specific purpose and is not processed in a way
						incompatible with the purpose for which we collected it. Your
						personal information is adequate, relevant, and limited to what is
						necessary in relation to the purposes for which it was collected or
						further processed Your personal information is kept accurate and,
						where necessary, kept up to date. Your personal information is kept
						no longer than is necessary to achieve the lawful basis for which
						the personal data was collected or further processed. Accurate,
						complete, and not misleading, and where necessary kept up to date
						regarding the purpose for which the personal data is collected or
						further processed. Processed in a manner that ensures appropriate
						security of personal data, including the necessary protection
						against unauthorized or unlawful processing, access, loss,
						destruction, damage, or any form of data breach. We employ technical
						and organizational measures to ensure confidentiality, integrity,
						and availability of technical data.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>4.0 What Information we collect use, and disclosure</h2>
					<p className="text">
						For us to provide our services effectively, we may collect, use, and
						store personal identifiable information, if you choose to provide it
						during our interaction. We also disclose and collect certain
						information to third parties if you choose to log in to our Platform
						using a third-party single sign-in service that authenticates your
						identity and connects your social media login information (for
						example Facebook, LinkedIn, Google, Instagram, Twitter, and others)
						such as your name and email address. Other information we collect
						may depend on the privacy settings you have set with your social
						media provider, so please review the privacy policy of the
						applicable service. It is crucial to note that in addition to the
						personal information indicated in this Policy, we may also collect
						any additional information that could be viewed as personal
						information.{' '}
					</p>
					<p className="text">
						Registration is required to use this Platform. Once a Healthcare
						Provider has registered with us and subscribed to our Services, the
						Healthcare Provider can then invite Patients to use their Services.{' '}
					</p>{' '}
					<p className="text">
						Healthcare Provider Registration. To register, Healthcare Providers
						must provide certain information about themselves and their
						practices including: the Healthcare Provider’s name, date of birth,
						gender, address, email, phone number, mobile number; provider
						license, company registration, and a government authorized means of
						identification.  We may also collect certain optional information,
						including middle name or initial, bank account or other payment
						information and other contact details, picture, and communication
						preferences.{' '}
					</p>{' '}
					<p className="text">
						Patient Registration.  Patients must provide certain information,
						including first name, last name, date of birth, gender, address,
						email, mobile, work phone, as well as a government authorized means
						of identification.  We may also collect certain optional
						information, including middle name or initial, and other contact
						info, demographic information, billing details, picture, and
						communications preferences.  In addition, the Patient can
						communicate other health-related information to the Healthcare
						Provider during a video consultation or in-person which is stored in
						the healthcare journal via the Platform.{' '}
					</p>
					<p className="text">
						The information we collect may come directly from you or be
						generated while providing services. For marketing purposes, your
						consent is required, which you agree to before using the platform,
						unless specified in this Privacy Policy or mandated by
						law/professional standards. By registering or submitting personal
						information, you acknowledge our use of information as outlined in
						this Privacy Policy.
					</p>
					<p className="text">
						Information We Collect Automatically: We may automatically collect
						the following information regarding your use of this Platform
						through cookies, web beacons, and other technologies: your domain
						name; browser type and operating system; web pages visited; links
						clicked; your IP address; time and date stamps reflecting the
						duration of your Platform or Services usage; the referring URL or
						the webpage that led you to the Platform; and your browser type.
						This information may be combined with other data we have collected
						about you, including, where applicable, your username, name, and
						other personal information. For further details on our use of
						cookies and other tracking mechanisms, please refer to the{' '}
						<b>'Cookies and Beacons'</b> section below. Safeguarding this
						information is a priority for us. Unless explicitly detailed in this
						Privacy Policy or upon your request or approval, we will never use
						or disclose your information.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>5.0 Purpose for which information is used </h2>
					<p className="text">
						We are committed to ensuring that all information obtained from you
						is adequate, respecting the inherent dignity of every individual.
						All information collected from you is processed exclusively for
						legitimate and lawful purposes. In adherence to the laws of Nigeria,
						Ghana, and other sub-Saharan African countries where we operate, the
						collected information may be utilized for the following purposes:
					</p>
					<p className="text">
						(a)To register you as a new customer. (b) To contact or provide you
						with information, alerts, and suggestions. (c) To verify your
						identity (d) To reach out to you, either ourselves or using the
						appropriate authorities, if we have a good reason to believe that
						you or any other person may be in danger or may be either the cause
						or the victim of a criminal act. (e) To provide you with customer
						support, and ensure you are receiving quality service. (f) To send
						you reminders and other information related to your care on behalf
						of your Healthcare Provider For billing and transaction processing
						purposes To supervise, administer and monitor our Platform use. (g)
						To measure and improve the quality, effectiveness, and delivery of
						our services. (h) To personalize the Platform experience and to
						deliver content and product and service offerings relevant to
						individual interests, including targeted offers and ads. (i) To
						respond to law enforcement requests and as required by applicable
						law, court order, or governmental regulations. (j) To comply with
						any legal obligation requiring disclosure of such personal data to
						any public body. (k) To comply with applicable local and/or state
						and federal laws, including, but not limited to laws related to
						protecting client and public health and safety; Any other purpose
						with your consent. (l) To manage our relationship with you which
						will include:  (i) Notifying you about changes to our terms or
						privacy policy (ii) Asking you to leave a review or take a survey
						(ii) Performance of a contract with you (iv) It is necessary for our
						legitimate interests to keep our records updated and to study how
						customers use our products/services.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>6.0 Disclosure to third parties</h2>
					<p className="text">
						Information about you will not be disclosed to non-affiliated third
						parties except as necessary for our legitimate professional and
						business needs, to carry out your requests, and/or as required or
						permitted by law or professional standards. This includes but is not
						limited to the following.
						<h3>Healthcare Providers</h3>: Patients' information is accessible
						to their healthcare providers to facilitate personalized healthcare
						delivery. These healthcare providers, acting as data processors, are
						obligated to protect and ensure the proper handling of shared data.
						Our platform facilitates the secure sharing of your information only
						with the healthcare providers you have signed up with. It is
						important to note that while this Policy does not specify how
						healthcare providers will utilize or disclose information obtained
						during your platform use, you can request details directly from your
						healthcare provider regarding they handle and treat your information
						within their practice.
						<h3>For business purpose</h3>We may share your information with
						vendors and service providers, including our data hosting and data
						storage partners, analytics and vendors providing technology
						services and support, payment processing, and data security. We also
						may share information with professional advisers, such as auditors,
						law firms, and accounting firms.
						<h3>With your direction or consent</h3>: We may share your
						information with third parties if you request or direct us to do so.
						You have the option to withdraw your consent at any time by
						contacting us at info@swedcon18.com. Please note that your data may
						be retained for a considerable duration as required by law,
						government regulations, or any other institution that deems it
						necessary. Additionally, we may retain data for our own purposes,
						such as training and learning to enhance and improve the platform.
						<h3>With affiliates within our corporate group</h3>: We may share
						your information with any subsidiaries or parent companies within
						our corporate group
						<h3>For advertising</h3>
						If you opt-in to the use of targeting cookies and web beacons,
						information about your Platform activity may be shared with our
						advertising partners to optimize marketing efforts. Importantly, we
						do not share any confidential information, such as names, email
						addresses, phone numbers, etc., with any advertising platform.
						<h3>Compliance with law</h3>:We may share your information with a
						court, regulatory body, law enforcement agency, public body, or
						pursuant to a subpoena, to comply with applicable law or any
						obligations thereunder
						<h3>Business transfers</h3>:In the event of our acquisition, merger
						with another company, or if a substantial portion of our assets is
						transferred to another entity, or in the case of our involvement in
						a bankruptcy proceeding, the information collected from you may be
						transferred to the acquiring or merged entity.
						<h3>For other business reasons</h3>:We may share your information to
						enforce any applicable Terms of Use.
						<h3>Our service providers</h3>:We work with reputable strategic
						partners, service providers etc. so they can process your personal
						information on our behalf. We will only transfer personal
						information to them when they meet our strict standards on the
						processing of data and security. We only share personal information
						that allows them to provide their services.
						<h3>Preventing Fraud or Crime</h3>: We may disclose personal data to
						the extent permitted by law, where we believe it is necessary to
						investigate, prevent, or take action regarding illegal activities,
						suspected fraud, or any other criminal activity, situations
						involving potential threats to the safety of any person, or as
						evidence in litigation, or to safeguard our sites and platforms. We
						only disclose your personal information to third parties who agree
						to maintain strict confidentiality and use it solely for the
						specified purpose provided by us. Additionally, certain personal
						information may be transferred within or outside Ghana, Nigeria, or
						sub-Saharan Africa to offshore companies working with or on behalf
						of our organization, aligned with the purposes described in this
						Privacy Policy. In all cases where personal data is transferred to a
						country that is deemed not to have the same standards of protection
						for personal data as Ghana, Nigeria, and sub-Sahara African
						countries. We take measures to ensure appropriate safeguards are in
						place to protect your personal information. These steps may involve
						imposing contractual obligations on the party receiving the data to
						maintain adequate standards of protection. In situations where
						competent authorities or existing data protection laws are absent in
						the country where your data is intended to be transferred, we will
						seek your consent after informing you of potential associated risks.
						If the transfer solely benefits you and obtaining consent is
						impractical, we may proceed without it. Exceptions where we may
						transfer your data without prior consent include cases where it's
						necessary for public interest protection, legal defense claims, or
						safeguarding your vital interests in situations where you are unable
						to provide consent due to physical or legal incapacity. Note: We may
						prompt you to share content on our Platform. If you make any
						information publicly available on our Platform, it can be viewed and
						utilized by anyone. Consequently, we cannot prevent such information
						from being used in ways that might violate this Policy, the law, or
						your personal privacy. Therefore, it is advisable to refrain from
						posting sensitive information on our Platform that you are
						uncomfortable sharing publicly, such as personal medical details.
						Please note, we are not accountable to you or any other individual
						for any content or information you post on our Platform, or for the
						use or disclosure of such content or information by other users or
						third parties. We will rely on one or more of the following
						processing conditions and grounds when we collect your personal
						information:
						<h3>The performance of a contract</h3>: This is when the processing
						of your personal information is necessary to perform our obligations
						under a contract or for us to take steps at your request.
						<b>A legal obligation</b>: This is when we are required to process
						your personal information to comply with a legal obligation, such as
						keeping records for tax purposes or providing information to a
						public body or law enforcement agency
						<b>Legitimate and vital interests</b>:We may process information
						about you when it aligns with our legitimate business interests,
						provided it does not supersede your fundamental rights, freedoms, or
						interests. Additionally, this process should not be unexpected by
						you. Our legitimate interests encompass various purposes, including
						providing information and/or services to platform visitors,
						preventing fraud or criminal activities, and customizing
						individuals' online experiences. To protect your vital interest or
						that of another person.
						<b>Your consent is given</b>:We may occasionally request your
						explicit permission to process certain aspects of your personal
						information, and we will proceed with such processing only upon your
						agreement.You have the option to withdraw your consent at any time
						by contacting us at info@swedcon18.com. Where it is necessary for
						the performance of a task carried out in the interest of the public
						or in the exercise of an official public mandate vested in us.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>7.0 Cookies and web beacons</h2>
					<p className="text">
						Cookies are small text files stored on your computer or mobile
						devices when you visit a website. They serve various purposes, like
						recording preferences to customize your Platform experience and
						aiding us in analyzing Platform traffic. Another type, 'user-input'
						cookies, might be necessary for essential functionality and will not
						be blocked via notification banners. Your selection will be stored
						in a cookie for 60 days (about 2 months), and to revoke your choice,
						clearing your browser's cookies is necessary. A web beacon, a small
						and often invisible image or embedded code on a web page or email,
						tracks user activity. Third parties commonly use it for web
						analytics, advertising optimization, or page tagging. Like many
						platforms, we use 'cookies' and 'web beacons' for information
						collection. You have the option to modify your browser settings to
						disallow acceptance of cookies and web beacons (often available in
						your browser's Tools or Preferences menu) or prompt you before
						accepting them. Additionally, you can delete cookies from your
						device at any time. However, please note that declining cookies may
						limit your access to certain features on our Platform. We may
						utilize third-party cookies or web beacons for web analytics,
						attribution, and error management. Additionally, third-party tools
						and widgets employed on our Platform serve to enhance functionality.
						These tools or widgets may place cookies on your device to
						streamline their services and ensure proper display of your
						interactions on our web pages. While cookies themselves do not
						reveal your email address or personally identify you, our analytical
						reports may involve obtaining other identifiers, including IP
						addresses through Vendor services. However, this is solely for
						gauging the number of unique visitors to our Platform and
						understanding geographic trends among visitors, rather than
						identifying individual users. There may also be the use of cookies
						and web beacons of services owned or provided by third parties that
						are not covered by our Privacy Policy and we do not have access or
						control over these cookies and web beacons. BY NAVIGATING ON OUR
						PLATFORM, YOU CONSENT TO THE PLACEMENT OF THESE COOKIES ON YOUR
						COMPUTER OR INTERNET-ENABLED DEVICE.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>8.0 Social media and general information tools </h2>
					<p className="text">
						We utilize various publicly available tools and information exchange
						resources, including but not limited to blogs, Google, Facebook,
						Twitter, and others, to enable sharing. Any information you provide
						or share via these social media platforms is subject to the Privacy
						Policy of the respective site, and it may be accessed and collected
						by both the site and its users. We do not control or hold
						responsibility for these companies or their utilization of your
						information. Notably, we hold no liability for the use of your
						information by any social media platform. Moreover, our Platforms
						may include blogs, forums, crowd-sourcing, and other applications,
						or services collectively known as 'social media features.' These
						features aim to facilitate knowledge and content sharing. Any
						personal information you provide within these social media features
						may be shared with other users (unless specified otherwise at the
						point of collection), over whom we might have limited or no control.
						We may interact with you through various platforms including
						Facebook, WhatsApp, Twitter, LinkedIn, and Instagram, etc. Please
						note that any content you post to such social media platforms (e.g.,
						pictures, information, or opinions), as well as any personal
						information that you otherwise make available to users (e.g., your
						profile), is subject to the applicable social media platform’s terms
						of use and privacy policies. We recommend that you review this
						information carefully to better understand your rights and
						obligations regarding such content.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>9.0 Phishing</h2>
					<p className="text">
						Online identity theft and account hacking, including phishing, are
						significant concerns. Always exercise caution when providing your
						information and ensure it is within our secure system. We will never
						solicit your login or confidential information through non-secure or
						unsolicited communication (email, phone, or otherwise). As a result,
						we do not accept liability for any financial or account loss
						directly resulting from phishing activities.{' '}
						<h2>10.0 Location-based tools</h2>
						We may collect and use the geographical location of your computer or
						mobile device. This location data is collected for the purpose of
						providing you with information regarding services that we believe
						may be of interest to you based on your geographic location and to
						improve our location-based products and services.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>9.0 Data Security and information</h2>
					<p className="text">
						Using any internet-based service carries inherent security risks,
						despite our best efforts, security against all threats can therefore
						not be 100% guaranteed. Our infrastructure, encryption technology,
						operation and processes are all designed, built, and maintained to
						protect personal data from unauthorized loss or access, breaches
						such as theft, cyberattack, viral attack, manipulation of any kind,
						misuse, modification, alteration, destruction, or disclosure under
						our control. Where we have provided you (or where you have chosen)
						with a password that grants you access to specific areas on our
						Platform, you are responsible for keeping this password
						confidential. We request that you do not share your password or
						other authentication details (e.g., generated codes with anyone).
						You are responsible for maintaining the confidentiality of any
						password we have given you (or that you have selected) that gives
						you access to certain parts of our Platform. Please refrain from
						sharing your password or any other authentication information with
						anyone, including generated codes. You should take precautions to
						prevent unwanted access to your password, phone, and computer. This
						may include signing off after using a shared computer, using a
						strong password that nobody else knows or can readily guess, and
						keeping your log-in and password private. We disclaim all liability
						for any lost, stolen, or compromised passwords, and any account
						activity arising from unauthorized password use. We take measures to
						limit access to your personal information to those with a legitimate
						need. Individuals with data access are obligated to maintain strict
						confidentiality regarding such information. We endeavour to retain
						personal information only for as long as necessary, considering its
						purpose or until you request its deletion. The duration of data
						storage is influenced by administrative, legal, or operational
						requirements. For instance, we might retain your information to
						comply with legal obligations, settle disputes, or enforce our
						policies and agreements.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>12-0 Children’s privacy</h2>
					<p className="text">
						We are dedicated to protecting children's privacy and do not
						knowingly collect personally identifiable information, such as names
						or email addresses, from children, except where necessary for
						registering them as dependents related to our customers. However,
						registration of children under 18 years old, enabling access to
						healthcare services, requires the explicit consent of an elected
						guardian. To verify the age of our users, we typically request
						government-approved identification. If you have concerns in this
						regard, please contact us at info@swedcon18.com. We will promptly
						take necessary and legally permissible actions upon receiving such
						information.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>13.0 Your rights</h2>
					<p className="text">
						If we for the purposes set out in this policy processes your
						personal information, you have the following rights: Access and
						correction: you have the right to access your personal information.
						Provided we establish that we are under obligation to provide
						personal information to you. Before providing personal information
						to you, we may choose to ask for proof of identity and sufficient
						background information about your interaction with us. If any
						information we hold about you is incorrect, you are entitled to ask
						us to correct any inaccuracies in your personal information. We will
						ensure that such corrections are affected within a reasonable time.
						You may request us to update your personal information at any time.
						You may request us to update your personal information at any time.
						You may at any time request us to disclose your personal information
						to a third party. Your request may specify the required format for
						such disclosure provided we have the capacity to provide the
						personal information in the required format. Object to processing:
						you have the right to object to the processing of your personal
						information if we are not entitled to use same anymore. You may also
						have the right to seek that your personal information be deleted if
						in your opinion such personal information is being kept or collected
						longer than necessary for the original purpose or where you withdraw
						your consent. However, this will need to be balanced against other
						factors; for example, according to the type of personal information
						we hold about you and why we have collected it, there may be some
						legal and regulatory obligations which mean we cannot comply with
						your request. Right to restriction of processing: In certain
						circumstances, you are entitled to ask us to stop using your
						personal information, for example, where you think that the personal
						information, we hold about you may be inaccurate or where you think
						that we no longer need to process your personal information. The
						right to withdraw consent: You have the right to withdraw your
						consent to further use of your personal information Right to Lodge a
						Complaint with the appropriate authority if you believe that our
						processing of your personal information violates applicable data
						protection laws. Right to know if we intend to use automated
						decision making when processing your personal data. Request a copy
						of your personal data in a commonly used electronic format, except
						to the extent that providing your personal data will impose
						unreasonable cost on us. In such case we will ask you to bear the
						some of the cost in providing a copy of your personal data.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>14.0 Links to other websites</h2>
					<p className="text">
						Please be aware that our platform may contain links to other
						websites, services, or offers including sites maintained by third
						parties that are not governed by this Privacy Policy but by other
						privacy policies that may differ. We encourage users to review their
						privacy policies. If you click on a third-party link, you will be
						directed to that third party’s website or service. The fact that we
						link you to a website or service is not an endorsement,
						authorization, or representation of our affiliation with that third
						party, nor is it an endorsement of their privacy or information
						security policies or practices. We do not have control over
						third-party websites and services, and we do not have control over
						their privacy policies and terms of use. Please review the privacy
						policy of each website visited before disclosing any personal
						information.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>15.0 Changes in this policy</h2>
					<p className="text">
						We may modify this Privacy Policy from time to time at our
						discretion to reflect our current privacy practices as well as the
						legal, regulatory, and operating environment and such revised
						versions will automatically become applicable to you. The date of
						the last revision of this policy appears at the end of this page. We
						encourage you to periodically review this page for the latest
						information on our Privacy Policy and practices. Regardless of
						changes to our Privacy Policy, we will never use the information you
						submit under our current Privacy policy in a new way without first
						notifying you.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>16.0 Dislaimer</h2>
					<p className="text">
						By this Privacy Policy, we do not represent or warrant the condition
						or functionality of our Platform, its suitability for use, nor
						guarantee that our service will be free from interruption or any
						error. No liability or responsibility shall lie for risks associated
						with the use of our Platform, including but not limited to any risk
						to your computer, software or data being damaged by any virus,
						software, or any other file that might be transmitted or activated
						via our Platform or your access to it. Neither do we guarantee the
						reliability of information contained on our Platform, particularly
						those shared by third party users.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>17.0 Personal Data Breach</h2>
					<p className="text">
						In the event of a breach impacting your stored personal data and
						posing a risk to your rights and freedoms, as mandated by Section
						40(2) of the Nigeria Data Protection Act 2023, we commit to
						notifying the Commission within 72 hours (about 3 days) of becoming
						aware of the breach. Our notification to the Commission will include
						a description of the breach's nature. Moreover, if a data breach is
						likely to significantly risk your rights and freedoms, we will
						promptly inform you. Our communication will provide detailed steps
						and methods you can take to mitigate any adverse effects resulting
						from the breach.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>18.0 Governing Law</h2>
					<p className="text">
						This Privacy Policy is established in accordance with the Nigeria
						Data Protection Regulation (2019), the Data Protection Act 2012 of
						Ghana, and similar regulations in sub-Saharan African countries. In
						cases where any provision within this policy is considered
						inconsistent with the laws or regulations applicable in Nigeria,
						Ghana, or other relevant authorities, the overriding law,
						regulation, or convention shall prevail.
					</p>
				</TypographyStylesProvider>
			</Text>
			<Text component="div">
				<TypographyStylesProvider>
					<h2>19.0 Contact us</h2>
					<p className="text">
						If you have any questions, comments, or concerns about this Privacy
						Policy or questions, comments, or requests about our administration
						of your personal information, please contact us at
						info@swedcon18.com. We will respond within a reasonable time.
					</p>
				</TypographyStylesProvider>
			</Text>

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
