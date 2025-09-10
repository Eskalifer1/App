import {useRoute} from '@react-navigation/native';
import ONYXKEYS from '@src/ONYXKEYS';
import useOnyx from './useOnyx';

export default function useCurrencyFromRoute(excludedCurrencies: string[] = [], paramName = 'currency') {
    const [currencyList] = useOnyx(ONYXKEYS.CURRENCY_LIST, {canBeMissing: false});
    const routeParams = useRoute().params as Record<string, string>;
    const currencyFromUrlTemp = routeParams?.[paramName] as string | undefined;

    if (!currencyFromUrlTemp) {
        return {currency: undefined};
    }

    const currencyInfo = currencyList?.[currencyFromUrlTemp];

    const isValidCurrency = Boolean(currencyInfo) && !excludedCurrencies.includes(currencyFromUrlTemp);

    return {
        currency: isValidCurrency ? currencyFromUrlTemp : undefined,
    };
}
