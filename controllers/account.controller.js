import axios from 'axios';

export const createAccount = async (req, res) => {
    const {accountNumber, accountHolder, bankName, currency, settlementType} = req.body

    const banks = await axios.get("https://api.paystack.co/bank",{
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        }
    });


}