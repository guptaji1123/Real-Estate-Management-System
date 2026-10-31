
export async function api(path, options = {}) {

  // Send request to backend
  const response = await fetch("/api" + path, {
    ...options,

    // Send login cookie with request
    credentials: "include",

    // Tell backend we are sending JSON
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  // Convert backend response into JavaScript data
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  // Check whether request failed
  if (!response.ok) {
    const error = new Error(
      data.message || "Request failed"
    );

    error.status = response.status;

    throw error;
  }

  // Return backend data
  return data;
}
