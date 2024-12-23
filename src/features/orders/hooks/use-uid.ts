import { useEffect, useState } from "react";

export const useUid = () => {
    const [uid, setUid] = useState<string | null>(null);

    useEffect(() => {
        const storedUid = localStorage.getItem('uid');
        if (storedUid) {
            setUid(storedUid);
        } else {
            const newUid = crypto.randomUUID();
            localStorage.setItem('uid', newUid);
            setUid(newUid);
        }
    }, []);

    return { uid, setUid };
}