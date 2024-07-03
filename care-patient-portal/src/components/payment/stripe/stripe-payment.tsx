import { IStripePayment } from "../../../api/types";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeForm from "./stripe-form";
import { env } from '../../../utils/env';

const VerifyStripePayment: React.FC<{stripePayment: IStripePayment, setVerify: React.Dispatch<React.SetStateAction<boolean>>}> = ({stripePayment, setVerify}) => {
    const stripePromise = loadStripe(env.VITE_STRIPE_PUBLIC_API_KEY);

    //Setup for stripe Elements
    const clientSecret = stripePayment.clientSecret;
    const appearance = {
        theme: 'flat' as const,
    };


    const options = {
        clientSecret,
        appearance
    };

    return(
        <Elements options={options} stripe={stripePromise}>
            <StripeForm clientSecret={clientSecret} setVerify={setVerify}/>
        </Elements>
    );
};


export default VerifyStripePayment;