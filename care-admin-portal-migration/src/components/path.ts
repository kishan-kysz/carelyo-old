import { createPrice } from './../helper/api/index';
import { createContext } from 'react';
const paths = {
  rootDirectory: process.env.NEXT_PUBLIC_ROOT_DIRECTORY || '',
  dashboard: '/',
  manageUser: '/users',
  manageDoctor: '/doctors',
  managePatient: '/patients',
  manageTemplate: '/templates/all',
  updatePatients: '/patients/update',
  updateDoctors: '/doctors/update',
  updatePrice: '/prices/update',
  updateTemplate: '/templates/update',
  createAdmin: '/users/create/admin',
  updateTicket: 'tickets/handle?id=',
  createDoctors: '/doctors/create',
  createPrice : '/prices/create',
  createTicket: '/tickets/create',
  browseConsultation: '/consultation/all',
  browseInquiry: '/inquiries/all',
  manageTicket: '/tickets/all',
  manageProvider: '/provider',
  managePrescription: '/prescriptions/all',
  browseLab: '/labrequests/all',
  managePrice: '/prices/all',
  browsePayroll: '/payroll/all',
  browsePrescription: '/prescriptions/profile',
  previewInquiry: '/inquiries/Inquiry?id=',

};
export default paths;
export const PathsContext = createContext(paths);