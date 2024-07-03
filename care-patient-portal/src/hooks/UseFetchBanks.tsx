
import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchBanks = (country: string) => {
    const [banks, setBanks] = useState<string[]>([]);


    useEffect(() => {
        const fetchBanks = async () => {
            const url = import.meta.env.VITE_PAYSTACK_URL;
            const authorization = `Bearer ${import.meta.env.VITE_PAYSTACK_API_SECRET}`;

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: authorization,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        country,
                        perPage: 100
                    }
                });


                if (response.data && response.data.data) {
                    const bankNames = response.data.data.map((bank: { name: string }) => bank.name);
                    setBanks(bankNames);
                }
            } catch (error) {
                console.error('Error fetching banks:', error);
            } 
        };

        fetchBanks();
    }, [country]);

   

    return banks;
   
};

export default useFetchBanks;