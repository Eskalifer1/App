import {render, waitFor} from '@testing-library/react-native';

import {loadIllustrationsChunk} from '@components/Icon/IllustrationLoader';
import ProactiveAppReviewModal from '@components/ProactiveAppReviewModal';

import SignInHeroImage from '@pages/signin/SignInPageLayout/SignInHeroImage';

import React from 'react';

const mockLoadIllustrationsChunk = jest.mocked(loadIllustrationsChunk);
let mockIsReduceMotionEnabled = false;

jest.mock('@components/Icon/IllustrationLoader', () => ({
    getIllustrationsChunk: jest.fn(() => null),
    loadIllustrationsChunk: jest.fn(() => Promise.resolve({getIllustration: () => undefined})),
    loadIllustration: jest.fn(),
}));

// jest/setup.ts stubs this hook globally. The real one is what decides when the chunk is requested.
jest.mock('@hooks/useLazyAsset', () => jest.requireActual<Record<string, unknown>>('@hooks/useLazyAsset'));

jest.mock('@libs/Accessibility', () => {
    const actual = jest.requireActual<{default: Record<string, unknown>}>('@libs/Accessibility');
    return {
        __esModule: true,
        default: {
            ...actual.default,
            useReducedMotion: () => mockIsReduceMotionEnabled,
        },
    };
});

// The real Lottie and modal pull in native views that do not matter here. The modal mock mirrors ReanimatedModal,
// which only mounts its content while the modal is visible.
jest.mock('@components/Lottie', () => 'Lottie');
jest.mock('@components/ImageSVG', () => 'ImageSVG');
jest.mock(
    '@components/Modal',
    () =>
        ({isVisible, children}: {isVisible: boolean; children: React.ReactNode}) =>
            isVisible ? children : null,
);

describe('Illustrations chunk is only requested when an illustration is shown', () => {
    beforeEach(() => {
        mockLoadIllustrationsChunk.mockClear();
        mockIsReduceMotionEnabled = false;
    });

    it('does not request the chunk on the sign-in page when the animation is shown', () => {
        // Given a user without reduced motion, who sees the Lottie animation instead of the static illustration
        // When the sign-in hero renders
        render(<SignInHeroImage />);

        // Then the illustrations chunk, which only holds the static fallback, is not downloaded
        expect(mockLoadIllustrationsChunk).not.toHaveBeenCalled();
    });

    it('requests the chunk on the sign-in page when reduced motion is enabled', async () => {
        // Given a user with reduced motion, who needs the static illustration
        mockIsReduceMotionEnabled = true;

        // When the sign-in hero renders
        render(<SignInHeroImage />);

        // Then the illustrations chunk is loaded so the static illustration can be shown
        await waitFor(() => expect(mockLoadIllustrationsChunk).toHaveBeenCalledTimes(1));
    });

    it('does not request the chunk while the app review modal is hidden', () => {
        // Given the app review modal, which is mounted globally on every app load but almost never shown
        // When it renders hidden
        render(
            <ProactiveAppReviewModal
                isVisible={false}
                onPositive={jest.fn()}
                onNegative={jest.fn()}
                onSkip={jest.fn()}
            />,
        );

        // Then it does not download the illustrations chunk for an illustration nobody sees
        expect(mockLoadIllustrationsChunk).not.toHaveBeenCalled();
    });

    it('requests the chunk once the app review modal is shown', async () => {
        // Given the app review modal becomes visible
        // When it renders
        render(
            <ProactiveAppReviewModal
                isVisible
                onPositive={jest.fn()}
                onNegative={jest.fn()}
                onSkip={jest.fn()}
            />,
        );

        // Then the illustrations chunk is loaded so the illustration can be shown
        await waitFor(() => expect(mockLoadIllustrationsChunk).toHaveBeenCalledTimes(1));
    });
});
