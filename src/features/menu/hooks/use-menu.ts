

import { useState, useEffect } from 'react';

const useMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('/api/menu');
                const result = await response.json();

                if (response.ok) {
                    setMenuItems(result.data);
                } else {
                    setError(result.error);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    return { menuItems, loading, error };
};

export default useMenu;
