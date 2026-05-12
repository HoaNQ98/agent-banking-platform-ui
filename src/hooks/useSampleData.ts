import { useAppStore } from '../store/useAppStore';
import type { FormData } from '../types';
import { generateId } from '../utils';

/**
 * Hook to populate sample form data for demonstration
 */
export const useSampleFormData = () => {
  const { setCurrentForm } = useAppStore();

  const generateSampleLoanForm = (): FormData => ({
    id: generateId(),
    title: 'Business Loan Application',
    description: 'Please fill out the following information for your business loan application.',
    createdAt: new Date(),
    fields: [
      {
        id: generateId(),
        name: 'businessName',
        label: 'Business Name',
        type: 'text',
        placeholder: 'Enter your business name',
        required: true,
        defaultValue: 'ABC Corporation',
        autoFilled: true,
        helperText: 'Extracted from document',
      },
      {
        id: generateId(),
        name: 'businessType',
        label: 'Business Type',
        type: 'select',
        required: true,
        options: [
          { label: 'Sole Proprietorship', value: 'sole' },
          { label: 'Partnership', value: 'partnership' },
          { label: 'LLC', value: 'llc' },
          { label: 'Corporation', value: 'corporation' },
        ],
        defaultValue: 'llc',
        autoFilled: true,
        helperText: 'Extracted from document',
      },
      {
        id: generateId(),
        name: 'loanAmount',
        label: 'Requested Loan Amount',
        type: 'currency',
        placeholder: 'Enter amount',
        required: true,
        currencySymbol: '$',
        currencyCode: 'USD',
        defaultValue: 50000,
        autoFilled: true,
        helperText: 'Extracted from document',
      },
      {
        id: generateId(),
        name: 'loanPurpose',
        label: 'Loan Purpose',
        type: 'textarea',
        placeholder: 'Describe the purpose of the loan',
        required: true,
        helperText: 'Please provide details about how you plan to use the funds',
      },
      {
        id: generateId(),
        name: 'annualRevenue',
        label: 'Annual Revenue',
        type: 'currency',
        placeholder: 'Enter annual revenue',
        required: true,
        currencySymbol: '$',
        currencyCode: 'USD',
      },
      {
        id: generateId(),
        name: 'yearEstablished',
        label: 'Year Established',
        type: 'number',
        placeholder: 'e.g., 2020',
        required: true,
      },
      {
        id: generateId(),
        name: 'contactEmail',
        label: 'Contact Email',
        type: 'email',
        placeholder: 'your@email.com',
        required: true,
        defaultValue: 'contact@abccorp.com',
        autoFilled: true,
        helperText: 'Extracted from document',
      },
      {
        id: generateId(),
        name: 'preferredContactDate',
        label: 'Preferred Contact Date',
        type: 'date',
        placeholder: 'Select date',
        helperText: 'When would you like us to reach out?',
      },
      {
        id: generateId(),
        name: 'supportingDocuments',
        label: 'Supporting Documents',
        type: 'file',
        accept: '.pdf,.png,.jpg',
        maxSize: 10 * 1024 * 1024,
        helperText: 'Upload tax returns, financial statements, or other supporting documents',
      },
    ],
  });

  return { generateSampleLoanForm, setCurrentForm };
};
