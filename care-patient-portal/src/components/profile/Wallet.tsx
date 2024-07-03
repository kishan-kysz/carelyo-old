
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { Button, TextInput, Box, Select } from '@mantine/core';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import useProfile from '../../hooks/use-profile';
import useFetchBanks from '../../hooks/UseFetchBanks';

interface WalletProps {
    currentStep: number;
    onNextStep: () => void;
    setShowWallet: (show: boolean) => void; 
    setCurrentStep: (step: number) => void;
}

interface FormData {
    reference: string;
    name: string;
    amountPaid: number;
    bank: string;
    accountNumber: string;
}

const Wallet: React.FC<WalletProps> = ({ currentStep, onNextStep, setShowWallet, setCurrentStep }) => {

    const {user} = useProfile()

  
    const { t } = useTranslation();

    const [formData, setFormData] = useState<FormData>({
        reference: '',
        name: user?.surName || '',
        amountPaid: 0,
        bank: '',
        accountNumber: '',
    });

    const country = user?.location.country|| ""; 
    const banks = useFetchBanks(country);
    
   
    const inputRefs = {
        reference: useRef<HTMLInputElement>(null),
        name: useRef<HTMLInputElement>(null),
        amountPaid: useRef<HTMLInputElement>(null),
        bank: useRef<HTMLInputElement>(null),
        accountNumber: useRef<HTMLInputElement>(null),
    };

  

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'amountPaid' ? parseFloat(value) : value
        }));
    };

    const handleSelectChange = (value: string): void => {
        setFormData((prevData) => ({
            ...prevData,
            bank: value
        }));
    };
   

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, nextInputRef?: React.RefObject<HTMLInputElement>, isLastInput?: boolean): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextInputRef) {
                nextInputRef.current?.focus();
                onNextStep();
            } else if (isLastInput) {
                handleSubmit(e);
            }
        }
    };

    const resetSteps = () => {
        setCurrentStep(0);
        setShowWallet(false);
    };


    const handleSubmit = async (e: KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
    
        try {
            const token = Cookies.get('PATIENT_token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/topup`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.status === 201) {
                showNotification({
                    title: t('success'),
                    message: t('Thank you! Once verified we will credit your wallet'),
                    color: 'green',
                });
                setShowWallet(false);
                resetSteps();
            } else {
                throw new Error('Failed to add money to wallet');
            }
        } catch (error) {
            console.error('Error adding money to wallet:', error);
            showNotification({
                title: t('error'),
                message: t('failed-to-add-money'),
                color: 'red',
            });
            resetSteps();
        }
    };

    return (
        <div>
           
            {currentStep === 0 && (
                <Box mt="md">
                    <TextInput
                        ref={inputRefs.reference}
                        label="Reference"
                        placeholder="Enter reference"
                        name="reference"
                        value={formData.reference}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, inputRefs.name)}
                        required
                        autoFocus
                    />
                </Box>
            )}

            {currentStep === 1 && (
                <Box mt="md">
                    <TextInput
                        ref={inputRefs.name}
                        label="Name"
                        placeholder="Enter your name"
                        name="name"
                        value={`${user?.surName} ${user?.firstName}`}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, inputRefs.amountPaid)}
                        required
                    />
                </Box>
            )}

            {currentStep === 2 && (
                <Box mt="md">
                    <TextInput
                        ref={inputRefs.amountPaid}
                        label="Amount"
                        placeholder="Enter the amount"
                        name="amountPaid"
                        value={formData.amountPaid === 0 ? '' : formData.amountPaid.toString()}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, inputRefs.bank)}
                        type="number"
                        required
                    />
                </Box>
            )}

            {currentStep === 3 && (
                 <Box mt="md">
                    <Select
                        ref={inputRefs.bank}
                        label="Sender's Bank Name"
                        placeholder="Enter sender's bank name"
                        name="bank"
                        value={formData.bank}
                        onChange={ handleSelectChange}
                        onKeyDown={(e) => handleKeyDown(e, inputRefs.accountNumber)}
                        required
                        data={banks.map((bank) => ({ value: bank, label: bank }))}
                    />
                 
             </Box>
               
            )}

            {currentStep === 4 && (
                <Box mt="md">
                    <TextInput
                        ref={inputRefs.accountNumber}
                        label="Sender's Account Number"
                        placeholder="Enter sender's account number"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, undefined, true)}
                        required
                    />
                    <Box mt="md">
                     <Button onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default Wallet;
