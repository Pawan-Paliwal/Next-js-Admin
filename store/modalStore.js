import { create } from 'zustand';

export const useModalStore = create((set) => {
  const closeAll = () =>
    set({
      isHamOpen: false,
      isEnquireOpen: false,
      isVideoOpen: false,
      isTeamPopOpen: false,
      isPositionsOpen: false,
      isThankyouOpen: false,
      isTestimonialOpen: false,
      isSigninOpen: false,
      thankyouMessage: null,
      selectedTeamMember: null,
      selectedPosition: null,
    });

  return {
    isHamOpen: false,
    isEnquireOpen: false,
    isVideoOpen: false,
    isTeamPopOpen: false,
    isPositionsOpen: false,
    isThankyouOpen: false,
    isTestimonialOpen: false,
    isSigninOpen: false,
    thankyouMessage: null,
    selectedTeamMember: null,
    selectedPosition: null,

    openHam: () => {
      closeAll();
      set({ isHamOpen: true });
    },
    closeHam: () => set({ isHamOpen: false }),

    openSignin: () => {
      closeAll();
      set({ isSigninOpen: true });
    },
    closeSignin: () => set({ isSigninOpen: false }),

    openEnquire: () => {
      closeAll();
      set({ isEnquireOpen: true });
    },
    closeEnquire: () => set({ isEnquireOpen: false }),

    openVideo: () => {
      closeAll();
      set({ isVideoOpen: true });
    },
    closeVideo: () => set({ isVideoOpen: false }),

    openTeamPop: (memberData) => {
      closeAll();
      set({ isTeamPopOpen: true, selectedTeamMember: memberData });
    },
    closeTeamPop: () => set({ isTeamPopOpen: false }),
    clearTeamMember: () => set({ selectedTeamMember: null }),

    openPositionsPop: (positionData) => {
      closeAll();
      set({ isPositionsOpen: true, selectedPosition: positionData });
    },
    closePositionsPop: () => set({ isPositionsOpen: false, selectedPosition: null }),

    openTestimonialPop: (testimonialData) => {
      closeAll();
      set({ isTestimonialOpen: true, selectedTestimonial: testimonialData });
    },
    closeTestimonialPop: () => set({ isTestimonialOpen: false, selectedTestimonial: null }),

    openThankyouPop: (message) => {
      closeAll();
      set({ isThankyouOpen: true, thankyouMessage: message });
    },
    closeThankyouPop: () => set({ isThankyouOpen: false, thankyouMessage: null }),

    closeAll,
  };
});
