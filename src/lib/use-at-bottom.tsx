import { useEffect, useState } from "react";

export function useAtBottom(offset = 0) {
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(()=> {
        const handleScroll = () => {
            setIsAtBottom(
                window.innerHeight + window.scrollY >= document.body.offsetHeight - offset,
            );
        };
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }

    }, [offset]);

    return isAtBottom;
}