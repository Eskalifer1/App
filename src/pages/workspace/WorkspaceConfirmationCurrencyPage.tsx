import React, {useCallback} from 'react';
import CurrencySelectionList from '@components/CurrencySelectionList';
import {CurrencyListItem} from '@components/CurrencySelectionList/types';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import useLocalize from '@hooks/useLocalize';
import Navigation from '@libs/Navigation/Navigation';
import type {PlatformStackScreenProps} from '@libs/Navigation/PlatformStackNavigation/types';
import type {WorkspaceConfirmationNavigatorParamList} from '@libs/Navigation/types';
import {appendParam} from '@libs/Url';
import type {Route} from '@src/ROUTES';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';

type CurrencySelectionPageProps = PlatformStackScreenProps<WorkspaceConfirmationNavigatorParamList, typeof SCREENS.WORKSPACE_CONFIRMATION.CURRENCY>;

function CurrencySelectionPage({route}: CurrencySelectionPageProps) {
    const {translate} = useLocalize();
    const currentCurrency = route.params.currency;

    const selectCurrency = useCallback(
        (option: CurrencyListItem) => {
            const backToRoute = ROUTES.WORKSPACE_CONFIRMATION.getRoute();

            Navigation.goBack(appendParam(backToRoute, 'currency', option.currencyCode), {compareParams: false});
        },
        [route],
    );

    return (
        <ScreenWrapper
            testID={CurrencySelectionPage.displayName}
            enableEdgeToEdgeBottomSafeAreaPadding
        >
            <HeaderWithBackButton
                title={translate('common.currency')}
                shouldShowBackButton
                onBackButtonPress={() => {
                    const backTo = ROUTES.WORKSPACE_CONFIRMATION.route;
                    const backToRoute = `${backTo}?currency=${currentCurrency}`;
                    Navigation.goBack(backToRoute as Route, {compareParams: false});
                }}
            />

            <CurrencySelectionList
                initiallySelectedCurrencyCode={currentCurrency}
                onSelect={selectCurrency}
                searchInputLabel={translate('common.search')}
                addBottomSafeAreaPadding
            />
        </ScreenWrapper>
    );
}

CurrencySelectionPage.displayName = 'CurrencySelectionPage';

export default CurrencySelectionPage;
