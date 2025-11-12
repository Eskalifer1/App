import {createContext, useContext} from 'react';

type CarouselArrowsContextValue = {
    setShouldShowArrows?: (show?: boolean) => void;
};

const CarouselArrowsContext = createContext<CarouselArrowsContextValue | null>(null);

export const useCarouselArrowsContext = () => useContext(CarouselArrowsContext);

export const CarouselArrowsProvider = CarouselArrowsContext.Provider;
