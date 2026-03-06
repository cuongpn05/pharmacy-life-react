import axios from 'axios';
import API_BASE_URL from '../constants/api';

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

    // Get all categories for selection
    getAllCategories: async () => {
        const response = await axios.get(`${API_BASE_URL}/Category`);
        return response.data;
    },

    // Create a new import receipt
    createImport: async (importData) => {
        try {
            const { SupplierId, ImportCreateAt, TotalPrice, Details } = importData;
            console.log("Creating import with data:", { SupplierId, ImportCreateAt, TotalPrice, itemCount: Details.length });

            // Fetch current records to determine the next numeric IDs
            const [importsResponse, detailsResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/Import`),
                axios.get(`${API_BASE_URL}/ImportDetail`)
            ]);

            // Calculate next numeric ImportId
            const importList = Array.isArray(importsResponse.data) ? importsResponse.data : [];
            const nextImportId = importList.reduce((max, i) => {
                const num = parseInt(i.ImportId);
                return isNaN(num) ? max : Math.max(max, num);
            }, 0) + 1;

            // 1. Create the master Import record
            // We'll also provide 'id' as a string to json-server to be explicit
            const importRecord = {
                ImportId: nextImportId,
                SupplierId: parseInt(SupplierId),
                StaffId: 1,
                ImportCreateAt,
                TotalPrice: parseFloat(TotalPrice) || 0,
                ImportStatus: 'Hoàn thành',
                Status: 'Hoàn thành'
            };

            const importResponse = await axios.post(`${API_BASE_URL}/Import`, importRecord);
            console.log("Master import record created:", importResponse.data);

            const newImportId = importResponse.data.ImportId;

            // 2. Create ImportDetail records
            const detailList = Array.isArray(detailsResponse.data) ? detailsResponse.data : [];
            let nextDetailId = detailList.reduce((max, d) => {
                const num = parseInt(d.ImportDetailId);
                return isNaN(num) ? max : Math.max(max, num);
            }, 0) + 1;

            const detailPromises = Details.map(detail => {
                const detailPayload = {
                    ImportDetailId: nextDetailId++,
                    ImportId: newImportId,
                    MedicineId: parseInt(detail.MedicineId),
                    ImportQuantity: parseInt(detail.Quantity) || 0,
                    UnitPrice: parseFloat(detail.UnitPrice) || 0
                };
                return axios.post(`${API_BASE_URL}/ImportDetail`, detailPayload);
            });

            await Promise.all(detailPromises);
            console.log("All import details created successfully");
            return importResponse.data;
        } catch (error) {
            console.error("Critical error in createImport service:", error);
            if (error.response) {
                console.error("Server responded with:", error.response.status, error.response.data);
            }
            throw error;
        }
    },

    // Get a single import by ID
    getImportById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/Import/${id}?_expand=Supplier`);
        return response.data;
    },

    // Get details for a specific import
    getImportDetails: async (importId) => {
        // Since numeric ImportId is used for relationships
        const response = await axios.get(`${API_BASE_URL}/ImportDetail?ImportId=${importId}&_expand=Medicine`);
        return response.data;
    },

    // Update an existing import receipt
    updateImport: async (id, importData) => {
        try {
            const { SupplierId, ImportCreateAt, TotalPrice, Details } = importData;

            // 1. Update the master Import record
            const importResponse = await axios.patch(`${API_BASE_URL}/Import/${id}`, {
                SupplierId: parseInt(SupplierId),
                ImportCreateAt,
                TotalPrice: parseFloat(TotalPrice),
                Status: 'Hoàn thành'
            });

            // For simplicity in a mock environment, we'll delete old details and add new ones
            // In a real app, you'd perform a diff.
            const oldDetails = await axios.get(`${API_BASE_URL}/ImportDetail?ImportId=${importResponse.data.ImportId}`);
            await Promise.all(oldDetails.data.map(d => axios.delete(`${API_BASE_URL}/ImportDetail/${d.id}`)));

            // Get max ID for details again
            const allDetails = await axios.get(`${API_BASE_URL}/ImportDetail`);
            let nextDetailId = (allDetails.data && allDetails.data.length > 0)
                ? allDetails.data.reduce((max, d) => {
                    const id = parseInt(d.ImportDetailId);
                    return isNaN(id) ? max : Math.max(max, id);
                }, 0) + 1
                : 1;

            const detailPromises = Details.map(detail =>
                axios.post(`${API_BASE_URL}/ImportDetail`, {
                    ImportDetailId: nextDetailId++,
                    ImportId: importResponse.data.ImportId,
                    MedicineId: parseInt(detail.MedicineId),
                    ImportQuantity: parseInt(detail.Quantity),
                    UnitPrice: parseFloat(detail.UnitPrice)
                })
            );

            await Promise.all(detailPromises);
            return importResponse.data;
        } catch (error) {
            console.error("Error in updateImport:", error);
            throw error;
        }
    },

    // Delete an import receipt
    deleteImport: async (id) => {
        // Delete related details first if we have the numeric ImportId
        const imp = await axios.get(`${API_BASE_URL}/Import/${id}`);
        if (imp.data && imp.data.ImportId) {
            const details = await axios.get(`${API_BASE_URL}/ImportDetail?ImportId=${imp.data.ImportId}`);
            await Promise.all(details.data.map(d => axios.delete(`${API_BASE_URL}/ImportDetail/${d.id}`)));
        }
        return axios.delete(`${API_BASE_URL}/Import/${id}`);
    }
};

export default importService;
