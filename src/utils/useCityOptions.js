import { useEffect, useMemo, useState } from 'react';
import { getCitySelectOptions, UK_CITIES } from 'constants/AddressConstants';
import clinicService from 'services/ClinicService';
import { isUkCountry, isUsCountry } from 'utils/helpers';

const usCityCache = {};

export const useCityOptions = ({ country, state, currentCity } = {}) => {
  const isUSA = isUsCountry(country);
  const isUK = isUkCountry(country);
  const stateCode = String(state || '').trim().toUpperCase();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (isUK) {
      setCities(UK_CITIES);
      setLoading(false);
      return undefined;
    }

    if (isUSA && stateCode) {
      if (usCityCache[stateCode]) {
        setCities(usCityCache[stateCode]);
        setLoading(false);
        return undefined;
      }

      setLoading(true);
      clinicService
        .listCities({ state: stateCode })
        .then(({ data }) => {
          const list = Array.isArray(data?.cities) ? data.cities : [];
          usCityCache[stateCode] = list;
          if (!cancelled) {
            setCities(list);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setCities([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });

      return () => {
        cancelled = true;
      };
    }

    setCities([]);
    setLoading(false);
    return undefined;
  }, [isUK, isUSA, stateCode]);

  const options = useMemo(
    () => getCitySelectOptions(cities, currentCity),
    [cities, currentCity]
  );

  return {
    options,
    loading,
    disabled: isUSA && !stateCode,
    useDropdown: isUK || isUSA,
  };
};
