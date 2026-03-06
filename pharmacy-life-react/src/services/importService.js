import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const importService = {
    // Get all import receipts
    getAllImports: async () => {
        const response = await axios.get(`${API_BASE_URL}/Import?_expand=Supplier`);
        return response.data;
    },

    // Get all suppliers for selection
    getAllSuppliers: async () => {
        const response = await axios.get(`${API_BASE_URL}/Supplier`);
        return response.data;
    },

    // Get all medicines for selection
    getAllMedicines: async () => {
        const response = await axios.get(`${API_BASE_URL}/Medicine`);
        return response.data;
    },

    // Create a new import receipt
    createImport: async (importData) => {
        const { SupplierId, ImportCreateAt, TotalPrice, Details } = importData;

        // 1. Create the master Import record
        const importResponse = await axios.post(`${API_BASE_URL}/Import`, {
            SupplierId,
            StaffId: 1, // Default staff for now
            ImportCreateAt,
            TotalPrice,
            Status: 'Hoàn thành'
        });

        const newImportId = importResponse.data.id || importResponse.data.ImportId;

        // 2. Create ImportDetail records
        const detailPromises = Details.map(detail =>
            axios.post(`${API_BASE_URL}/ImportDetail`, {
                ImportId: newImportId,
                MedicineId: detail.MedicineId,
                ImportQuantity: detail.Quantity,
                UnitPrice: detail.UnitPrice
            })
        );

        await Promise.all(detailPromises);
        return importResponse.data;
    },

    // Delete an import receipt
    deleteImport: async (id) => {
        // Note: In a real app we should also delete details, 
        // but JSON server handles cascading if configured or we do it manually.
        return axios.delete(`${API_BASE_URL}/Import/${id}`);
    }
};

export default importService;
