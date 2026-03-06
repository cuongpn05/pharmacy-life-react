import API_BASE_URL from "../constants/api";

// ─── Category ─────────────────────────────────────────────────────────────────

export const getCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/Category`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// ─── Medicine ─────────────────────────────────────────────────────────────────

export const getMedicines = async ({ limit, categoryId } = {}) => {
  let url = `${API_BASE_URL}/Medicine`;
  const params = new URLSearchParams();
  if (categoryId) params.append("CategoryId", categoryId);
  if (limit) params.append("_limit", limit);
  const query = params.toString();
  if (query) url += `?${query}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch medicines");
  return res.json();
};

export const getMedicineById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/Medicine/${id}`);
  if (!res.ok) throw new Error("Failed to fetch medicine");
  return res.json();
};

// ─── Customer ─────────────────────────────────────────────────────────────────

export const getCustomerById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/Customer?CustomerId=${id}`);
  if (!res.ok) throw new Error(`Failed to fetch customer with ID ${id}`);
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
};

export const updateCustomer = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/Customer/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update customer with ID ${id}`);
  return res.json();
};
