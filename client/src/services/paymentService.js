import api from './api';

const paymentService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/payment', { params });
    return Array.isArray(data) ? data : data?.payments || [];
  },
  create: async (paymentData) => {
    const { data } = await api.post('/payment', paymentData);
    return data;
  },
  refund: async (id) => {
    const { data } = await api.patch(`/payment/${id}/refund`);
    return data;
  },

  // Folio / invoices
  getAllInvoices: async (params = {}) => {
    const { data } = await api.get('/payment/invoices', { params });
    return Array.isArray(data) ? data : data?.invoices || [];
  },
  getInvoice: async (id) => {
    const { data } = await api.get(`/payment/invoices/${id}`);
    return data;
  },
  addCharge: async (id, charge) => {
    const { data } = await api.post(`/payment/invoices/${id}/add-charge`, charge);
    return data;
  },
  settleInvoice: async (id, payload) => {
    const { data } = await api.post(`/payment/invoices/${id}/settle`, payload);
    return data;
  },
};

export default paymentService;
