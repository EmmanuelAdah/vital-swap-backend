import axios from 'axios';
import Account from "../models/account.model.js";
import {accountSchema} from '../middlewares/validator.middleware.js';

let banksCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // last for 2 days

export const createAccount = async (req, res) => {
    const {userId, accountNumber, accountHolder, bankName, currency, settlementType} = req.body
    try {
        const bankDetails = await fetchBankDetails(bankName);
        if (!bankDetails) {
            return res.status(400).json({message: 'Invalid bank name'});
        }
        const isVerified = verifyAccount(accountNumber, bankDetails.code);
        if (!isVerified || isVerified.data.status !== 'true') {
            return res.status(400).json({message: 'Invalid account number'});
        }
        const accountName = isVerified.data.account_name || accountHolder.trim().toUpperCase();


            const createdAccount = await Account.create({
                userId,
                accountNumber,
                accountHolder: accountName,
                bankName,
                bankCode: bankDetails.code,
                currency,
                settlementType,
            })
            return res.status(201).json(createdAccount);
    }catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create account',
            error: error.message
        });
    }
}

export const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { accountHolder, settlementType, currency } = req.body;

    const {error} = accountSchema.validate(accountHolder, settlementType, currency);
    if (error) return res.status(400).json({ message: error.message });

    try {
        const updatedAccount = await Account.findByIdAndUpdate(
            id,
            { accountHolder, settlementType, currency },
            { new: true, runValidators: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const setPrimaryAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const account = await Account.findByIdAndUpdate(
            id,
            { isPrimary: true },
            { new: true }
        );
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json({ message: "Primary account updated", account });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const findByUserId = async (res, req) => {
     try {
        const {userId} = req.params;

        const accounts = await Account.find({ userId: userId });

        return res.status(200).json({
            success: true,
            count: accounts.length,
            data: accounts
        });

    } catch (error) {
        console.error('Error fetching accounts:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch accounts',
            error: error.message
        });
    }
};

export const deleteAccount = async (req, res) => {
    const { id } = req.params;

    const isDelete = await Account.findByIdAndDelete({_id: id})
    if (!isDelete) {
        return res.status(404).json({message: 'Account not found'});
    }
    return res.status(200).json({message: 'Account deleted successfully'});
}

export const findById = async (req, res) => {
    const {id} = req.params;
    const account = await Account.findById(id);
    if (!account) {
        return res.status(404).json({message: 'Account not found'});
    }
    return res.status(200).json({
        status: 'success',
        data: account
    });
}

async function verifyAccount(accountNumber, bankCode) {
    return await axios.get("https://api.paystack.co/bank/resolve", {
        params: {
          account_number: accountNumber,
          bank_code: bankCode
        },
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );
}

async function fetchAllBanks() {
  const allBanks = [];
  let nextUrl = 'https://api.paystack.co/bank?perPage=100';
  const SECRET_KEY = process.env.PAYSTACK_SECRET;

  while (nextUrl) {
    const response = await axios.get(nextUrl, {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    });
    const result = response.data;

    if (result.status && result.data) {
      allBanks.push(...result.data);
      nextUrl = result.meta?.next || null;
    } else {
      break;
    }
  }
  return allBanks;
}

async function fetchBankDetails(bankName) {
  try {
    if (!banksCache || !cacheTimestamp || (Date.now() - cacheTimestamp > CACHE_DURATION)) {
      banksCache = await fetchAllBanks();
      cacheTimestamp = Date.now();
    }

    const matchingBank = banksCache.find(bank =>
      bank.name.toLowerCase() === bankName.toLowerCase()
    );

    return matchingBank || null;
  } catch (error) {
    console.error('Error fetching bank details:', error);
    return null;
  }
}