import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

interface Deductions {
  '80C'?: number;
  '80D'?: number;
  '80E'?: number;
}

interface TaxRequest {
  income: number;
  deductions?: Deductions;
}

const taxSlabs = [
  { limit: 350000, rate: 0 },
  { limit: 750000, rate: 0.05 },
  { limit: 1250000, rate: 0.1 },
  { limit: 2500000, rate: 0.25 },
  { limit: Infinity, rate: 0.3 },
];

const deductionLimits: Deductions = {
  '80C': 150000,
  '80D': 50000,
  '80E': 200000,
};

function applyDeductions(income: number, deductions: Deductions = {}): number {
  let totalDeductions = 0;
  for (const key in deductions) {
    const maxLimit = deductionLimits[key as keyof Deductions] || 0;
    const userDeduction = deductions[key as keyof Deductions] || 0;
    totalDeductions += Math.min(userDeduction, maxLimit);
  }
  return Math.max(income - totalDeductions, 0);
}

function calculateTax(income: number): number {
  let tax = 0;
  let prevLimit = 0;

  for (const slab of taxSlabs) {
    if (income > slab.limit) {
      tax += (slab.limit - prevLimit) * slab.rate;
      prevLimit = slab.limit;
    } else {
      tax += (income - prevLimit) * slab.rate;
      break;
    }
  }

  return tax;
}

app.post('/api/calculate-tax', (req: Request, res: Response): void => {
  try {
    const { income, deductions }: TaxRequest = req.body;

    if (typeof income !== 'number' || income < 0) {
      res.status(400).json({ error: 'Invalid income value' });
      return;
    }

    const netIncome = applyDeductions(income, deductions);
    const tax = calculateTax(netIncome);

    res.json({ income, deductions, netIncome, tax });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
