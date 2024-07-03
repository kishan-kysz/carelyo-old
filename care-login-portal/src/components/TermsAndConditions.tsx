import { Box, Button, Text, Title } from '@mantine/core'
//This is a lorme ipsum placeholcder text
//Real one has to be written and filled in
const TermsAndConditions = ({ close }: { close: () => void }) => {
  return (
    <Box className='container'>
      <Title>
        Terms and Conditions for Online Digital Healthcare Information
        Management Platform
      </Title>
      <Title order={2}>1. Acceptance of Terms and Conditions</Title>
      <Text className='text'>
        These Terms and Conditions (the "Terms") constitute a legally binding
        agreement between Carelyo (hereinafter referred to as "Platform," "we,"
        "our," or "us"), and you the user ("User," "you," or "your"). By
        accessing or using the Platform, you agree to comply with and be bound
        by these Terms. If you do not agree to these Terms, you must not use the
        Platform. BY CLICKING "ON ACCEPT", YOU ARE ENTERING INTO A LEGALLY
        BINDING AGREEMENT TO THESE TERMS OF USE, JUST AS YOU WOULD BY SIGNING A
        PAPER CONTRACT.
      </Text>
      <Title order={2}>2. Registration and User Accounts</Title>
      <Text className='text'>
        <Title order={4}>2.1.</Title> To access the Platform, you are required
        to create a user account. You agree to provide accurate or required
        information during the registration process and to keep your account
        information thereafter updated.
        <Title order={4}>2.2.</Title> You are solely responsible for maintaining
        the confidentiality of your account credentials and for all activities
        that occur under your account. You must immediately notify your
        Healthcare Provider and or Carelyo of any unauthorized use and or
        security breach related to your account.
      </Text>
      <Title order={2}>3. Use of the Platform</Title>
      <Text className='text'>
        <Title order={4}>3.1.</Title> The Platform is intended for authorized
        healthcare providers, patients, and individuals with the necessary
        permissions to access electronic healthcare records. You agree to use
        the Platform only for lawful purposes and in compliance with all
        applicable laws and regulations.
        <Title order={4}>3.2.</Title>. You shall not use the Platform to: a.
        Access healthcare records without proper authorization. b. Share your
        account credentials with unauthorized individuals. c. Transmit any
        harmful code, malware, or viruses. d. Attempt to gain unauthorized
        access to the Platform or its data. e. Engage in any activity that
        disrupts or interferes with the Platform's operation.
      </Text>
      <Title order={2}>4. Privacy and Data Security</Title>
      <Text className='text'>
        <Title order={4}>4.1.</Title> Our Privacy Policy, available on the
        Platform, outlines how we collect, use, disclose, and protect your
        personal and healthcare information. By using the Platform, you consent
        to the practices described in our Privacy Policy.
        <Title order={4}>4.1.</Title> We implement reasonable measures to
        protect the security and confidentiality of your healthcare records, but
        we cannot guarantee absolute security. You are responsible for
        safeguarding your login credentials and taking appropriate security
        precautions.
      </Text>{' '}
      <Title order={2}>5. Intellectual Property</Title>
      <Text className='text'>
        <Title order={4}>5.1.</Title> All content, trademarks, logos, and
        intellectual property displayed on the Platform are owned by or licensed
        to Carelyo. You may not use, reproduce, or distribute such content
        without our prior written consent.
      </Text>{' '}
      <Title order={2}>6. Liability</Title>
      <Text className='text'>
        <Title order={4}>6.1.</Title> Carelyo is not liable for any error that
        might occur or has occurred due to the userU+2019s error. Carelyo is not
        responsible for the accuracy, completeness, or legality of the
        healthcare records that are collected, documented, and administered by
        the healthcare provider through the Platform. Carelyo advice healthcare
        providers to take necessary precautions to protect and secure patients
        data.
        <Title order={4}>6.2.</Title> To the extent permitted by law, the
        Company shall not be liable for any direct, indirect, incidental,
        consequential, or punitive damages arising from your use of the
        Platform, including but not limited to loss of data, loss of profits, or
        interruption of service.
      </Text>{' '}
      <Title order={2}>7. Termination</Title>
      <Text className='text'>
        <Title order={4}>7.1.</Title> We reserve the right to terminate or
        suspend your access to the Platform at our sole discretion, with or
        without cause, and with or without notice.
      </Text>{' '}
      <Title order={2}>8. Changes to this Terms of Use</Title>
      <Text className='text'>
        <Title order={4}>8.1.</Title> The Terms and Conditions will be updated
        on a regular basis. You will be notified, and your continued use of the
        Platform after such changes will constitute your acceptance of the
        updated Terms and Conditions.
      </Text>
      <Title order={2}>9. Governing Law and Dispute Resolution</Title>
      <Text className='text'>
        <Title order={4}>9.1.</Title> These Terms and Condition shall be
        governed by and construed in accordance with the laws of Your
        Jurisdiction. Any disputes arising from or relating to these Terms shall
        be resolved through arbitration in accordance with the rules of
        Arbitration Provider.
      </Text>
      <Title order={2}>10. Contact Information</Title>
      <Text className='text'>
        <Title order={4}>10.1.</Title> For questions or concerns related to
        these Terms and Conditions, please contact us at compliance@carelyo.io.
      </Text>
      <Button onClick={close} my={16} size='sm'>
        Close
      </Button>
    </Box>
  )
}

export default TermsAndConditions
