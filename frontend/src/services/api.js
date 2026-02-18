const BASE_URL = "http://localhost:5000/api";

export const getEmployees = async () => {
  const res = await fetch(`${BASE_URL}/employees`);
  return res.json();
};

export const getExpiringCerts = async (days) => {
  const res = await fetch(
    `${BASE_URL}/employees/expiring?days=${days}`
  );
  return res.json();
};
