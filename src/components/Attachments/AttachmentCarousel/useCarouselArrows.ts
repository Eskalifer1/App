import type {SetStateAction} from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as DeviceCapabilities from '@libs/DeviceCapabilities';
import CONST from '@src/CONST';

function useCarouselArrows() {
    const canUseTouchScreen = DeviceCapabilities.canUseTouchScreen();
    const [shouldShowArrows, setShouldShowArrowsInternal] = useState(canUseTouchScreen);
    const autoHideArrowTimeout = useRef<NodeJS.Timeout | null>(null);

    const isAutoHidePaused = useRef(false);

    /**
     * Cancels the automatic hiding of the arrows.
     */
    const cancelAutoHideArrows = useCallback(() => {
        if (autoHideArrowTimeout.current) {
            clearTimeout(autoHideArrowTimeout.current);
            autoHideArrowTimeout.current = null;
        }
    }, []);

    /**
     * Automatically hide the arrows if there is no interaction for 3 seconds.
     */
    const autoHideArrows = useCallback(() => {
        if (!canUseTouchScreen || isAutoHidePaused.current) {
            return;
        }

        cancelAutoHideArrows();
        autoHideArrowTimeout.current = setTimeout(() => {
            setShouldShowArrowsInternal(false);
        }, CONST.ARROW_HIDE_DELAY);
    }, [canUseTouchScreen, cancelAutoHideArrows]);

    /**
     * Sets the visibility of the arrows.
     */
    const setShouldShowArrows = useCallback(
        (show: SetStateAction<boolean> = true) => {
            setShouldShowArrowsInternal(show);
            autoHideArrows();
        },
        [autoHideArrows],
    );

    /**
     * Pauses auto-hide while user is interacting (e.g., swiping)
     */
    const pauseAutoHideArrows = useCallback(() => {
        isAutoHidePaused.current = true;
        cancelAutoHideArrows();
    }, [cancelAutoHideArrows]);

    /**
     * Resumes auto-hide after user stops interacting
     */
    const resumeAutoHideArrows = useCallback(() => {
        isAutoHidePaused.current = false;
        autoHideArrows();
    }, [autoHideArrows]);

    useEffect(() => {
        autoHideArrows();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);

    return {shouldShowArrows, setShouldShowArrows, autoHideArrows, cancelAutoHideArrows, pauseAutoHideArrows, resumeAutoHideArrows};
}

export default useCarouselArrows;
