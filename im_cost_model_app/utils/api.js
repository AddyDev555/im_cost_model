const BASE_URL = process.env.NEXT_PUBLIC_IM_BACKEND_URL;

export const api = {
    get: async (path) => {
        const res = await fetch(`${BASE_URL}${path}`);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    },

    post: async (path, data) => {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    },

    // add put, delete when needed
};
