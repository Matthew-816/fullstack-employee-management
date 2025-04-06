// utils.js

// Helper function to prepend base URL if not already a full URL
const getFullUrl = (url) => {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `${process.env.REACT_APP_API_BASE_URL}${url}`;
};

export const performAuthenticatedGetActionAsync = async (url) => {
  if (!checkJwt()) {
    return {
      error: true,
      tokenExpired: true,
      message: "Invalid token. Please login again!",
    };
  }
  return await callAPIAsync(getFullUrl(url), {
    method: "GET",
    ...getHttpHeaders(true),
  });
};

export async function performPostActionAsync(url, data) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Please sign in to perform this action.");
  }

  const fullUrl = getFullUrl(url);

  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response error:", errorText);
      throw Object.assign(new Error(errorText || "Server error"), { response });
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      console.warn("Non-JSON response:", text);
      return { ok: true, message: "Operation successful" };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export const performAuthenticatedPostActionAsync = async (url, data) => {
  if (!checkJwt()) {
    return {
      error: true,
      tokenExpired: true,
      message: "Invalid token. Please login again!",
    };
  }
  return await callAPIAsync(getFullUrl(url), {
    method: "POST",
    body: JSON.stringify(data),
    ...getHttpHeaders(true),
  });
};

export const performAuthenticatedPutActionAsync = async (url, data) => {
  if (!checkJwt()) {
    return {
      error: true,
      tokenExpired: true,
      message: "Invalid token. Please login again!",
    };
  }
  return await callAPIAsync(getFullUrl(url), {
    method: "PUT",
    body: JSON.stringify(data),
    ...getHttpHeaders(true),
  });
};

export const performAuthenticatedDeleteActionAsync = async (url, data) => {
  if (!checkJwt()) {
    return {
      error: true,
      tokenExpired: true,
      message: "Invalid token. Please login again!",
    };
  }
  return await callAPIAsync(getFullUrl(url), {
    method: "DELETE",
    ...(data && { body: JSON.stringify(data) }),
    ...getHttpHeaders(true),
  });
};

const callAPIAsync = async (url, options) => {
  try {
    console.log(options);

    const response = await fetch(url, options);

    if (response.status === 401) {
      return {
        error: true,
        tokenExpired: true,
        message: "Token expired. Please login again!",
      };
    }

    return await response.json();
  } catch (err) {
    return {
      error: true,
      message: err,
    };
  }
};

const checkJwt = () => {
  return localStorage.getItem("jwt");
};

function getHttpHeaders(withCredentials) {
  if (withCredentials) {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    };
  }

  return {
    headers: {
      "Content-Type": "application/json",
    },
  };
}
