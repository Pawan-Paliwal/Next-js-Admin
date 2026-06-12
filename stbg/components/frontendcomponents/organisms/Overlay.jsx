'use client';
import { useEffect } from 'react';
import { useModalStore } from '@/store/modalStore';

export default function Overlay() {
    const isHamOpen = useModalStore((state) => state.isHamOpen);
    const isEnquireOpen = useModalStore((state) => state.isEnquireOpen);
    const isVideoOpen = useModalStore((state) => state.isVideoOpen)
    const isTeamPopOpen = useModalStore((state) => state.isTeamPopOpen)
    const isPositionsOpen = useModalStore((state) => state.isPositionsOpen)
    const isTestimonialOpen = useModalStore((state) => state.isTestimonialOpen)
    const isThankyouOpen = useModalStore((state) => state.isThankyouOpen)
    const isSigninOpen = useModalStore((state) => state.isSigninOpen)
    const closeAll = useModalStore((state) => state.closeAll);

    const isAnyOpen = isHamOpen || isEnquireOpen || isVideoOpen || isTeamPopOpen || isPositionsOpen || isThankyouOpen || isTestimonialOpen || isSigninOpen
    useEffect(() => {
        if (isAnyOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => document.body.classList.remove('overflow-hidden');
    }, [isAnyOpen]);

    return (
        <div
            className={`overlay ${isAnyOpen ? 'is-open' : ''}`}
            onClick={closeAll}
        />
    );
}