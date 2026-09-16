import { COUNTRY_CODES } from './CountryCodesConstants';

export const US_ZIP_REGEX = /^\d{5}(-\d{4})?$/;
export const UK_POSTCODE_REGEX =
  /^(GIR ?0AA|[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2})$/i;

export const US_ZIP_PLACEHOLDER = 'e.g. 10118';
export const UK_POSTCODE_PLACEHOLDER = 'e.g. SW1A 1AA';

export const US_ZIP_ERROR =
  'Zip Code must be 5 digits or ZIP+4 (e.g. 10118 or 10118-0001)';
export const UK_POSTCODE_ERROR =
  'Postcode must be a valid UK postcode (e.g. SW1A 1AA)';
export const US_STATE_ERROR = 'Select a US state';
export const COUNTRY_ERROR = 'Select a country';
export const US_PHONE_PLACEHOLDER = '+1 (555) 123-4567';
export const US_LOCAL_PHONE_PLACEHOLDER = '(555) 123-4567';
export const US_PHONE_ERROR = 'Enter a US phone number as +1 (XXX) XXX-XXXX';

export const US_STATES = [
  { id: 'AL', name: 'Alabama' },
  { id: 'AK', name: 'Alaska' },
  { id: 'AZ', name: 'Arizona' },
  { id: 'AR', name: 'Arkansas' },
  { id: 'CA', name: 'California' },
  { id: 'CO', name: 'Colorado' },
  { id: 'CT', name: 'Connecticut' },
  { id: 'DE', name: 'Delaware' },
  { id: 'DC', name: 'District of Columbia' },
  { id: 'FL', name: 'Florida' },
  { id: 'GA', name: 'Georgia' },
  { id: 'HI', name: 'Hawaii' },
  { id: 'ID', name: 'Idaho' },
  { id: 'IL', name: 'Illinois' },
  { id: 'IN', name: 'Indiana' },
  { id: 'IA', name: 'Iowa' },
  { id: 'KS', name: 'Kansas' },
  { id: 'KY', name: 'Kentucky' },
  { id: 'LA', name: 'Louisiana' },
  { id: 'ME', name: 'Maine' },
  { id: 'MD', name: 'Maryland' },
  { id: 'MA', name: 'Massachusetts' },
  { id: 'MI', name: 'Michigan' },
  { id: 'MN', name: 'Minnesota' },
  { id: 'MS', name: 'Mississippi' },
  { id: 'MO', name: 'Missouri' },
  { id: 'MT', name: 'Montana' },
  { id: 'NE', name: 'Nebraska' },
  { id: 'NV', name: 'Nevada' },
  { id: 'NH', name: 'New Hampshire' },
  { id: 'NJ', name: 'New Jersey' },
  { id: 'NM', name: 'New Mexico' },
  { id: 'NY', name: 'New York' },
  { id: 'NC', name: 'North Carolina' },
  { id: 'ND', name: 'North Dakota' },
  { id: 'OH', name: 'Ohio' },
  { id: 'OK', name: 'Oklahoma' },
  { id: 'OR', name: 'Oregon' },
  { id: 'PA', name: 'Pennsylvania' },
  { id: 'RI', name: 'Rhode Island' },
  { id: 'SC', name: 'South Carolina' },
  { id: 'SD', name: 'South Dakota' },
  { id: 'TN', name: 'Tennessee' },
  { id: 'TX', name: 'Texas' },
  { id: 'UT', name: 'Utah' },
  { id: 'VT', name: 'Vermont' },
  { id: 'VA', name: 'Virginia' },
  { id: 'WA', name: 'Washington' },
  { id: 'WV', name: 'West Virginia' },
  { id: 'WI', name: 'Wisconsin' },
  { id: 'WY', name: 'Wyoming' },
  { id: 'AS', name: 'American Samoa' },
  { id: 'GU', name: 'Guam' },
  { id: 'MP', name: 'Northern Mariana Islands' },
  { id: 'PR', name: 'Puerto Rico' },
  { id: 'VI', name: 'U.S. Virgin Islands' },
];

export const US_STATE_CODES = US_STATES.map((state) => state.id);

export const US_STATE_SELECT_OPTIONS = US_STATES.map((state) => ({
  value: state.id,
  label: `${state.id} — ${state.name}`,
}));

const PREFERRED_COUNTRY_NAMES = ['United States', 'United Kingdom'];

const COUNTRY_ALIASES = {
  us: 'United States',
  usa: 'United States',
  america: 'United States',
  unitedstates: 'United States',
  unitedstatesofamerica: 'United States',
  uk: 'United Kingdom',
  gb: 'United Kingdom',
  unitedkingdom: 'United Kingdom',
  greatbritain: 'United Kingdom',
  england: 'United Kingdom',
};

const countriesFromDialCodes = [];
const seenCountryNames = new Set();
COUNTRY_CODES.forEach((entry) => {
  const name = String(entry.name || '').replace(/\s+\d+$/, '').trim();
  const key = name.toLowerCase();
  if (!name || seenCountryNames.has(key)) {
    return;
  }
  seenCountryNames.add(key);
  countriesFromDialCodes.push({ id: name, name });
});

export const COUNTRIES = [
  ...PREFERRED_COUNTRY_NAMES.filter((name) =>
    countriesFromDialCodes.some((country) => country.id === name)
  ).map((name) => ({ id: name, name })),
  ...countriesFromDialCodes.filter(
    (country) => !PREFERRED_COUNTRY_NAMES.includes(country.id)
  ),
];

export const COUNTRY_NAMES = COUNTRIES.map((country) => country.id);

export const normalizeCountryForSelect = (country) => {
  const trimmed = String(country || '').trim();
  if (!trimmed) {
    return '';
  }
  const compact = trimmed.toLowerCase().replace(/[^a-z]/g, '');
  if (COUNTRY_ALIASES[compact]) {
    return COUNTRY_ALIASES[compact];
  }
  const match = COUNTRIES.find(
    (option) =>
      option.id.toLowerCase() === trimmed.toLowerCase() ||
      option.id.toLowerCase().replace(/[^a-z]/g, '') === compact
  );
  return match ? match.id : trimmed;
};

export const getCountrySelectOptions = (currentValue) => {
  const normalized = normalizeCountryForSelect(currentValue);
  if (normalized && !COUNTRIES.some((country) => country.id === normalized)) {
    return [{ id: normalized, name: normalized }, ...COUNTRIES];
  }
  return COUNTRIES;
};

export const UK_CITIES = [
  'Aberdeen',
  'Armagh',
  'Bangor',
  'Bath',
  'Belfast',
  'Birmingham',
  'Blackburn',
  'Blackpool',
  'Bolton',
  'Bournemouth',
  'Bradford',
  'Brighton and Hove',
  'Bristol',
  'Cambridge',
  'Canterbury',
  'Cardiff',
  'Carlisle',
  'Chelmsford',
  'Chester',
  'Chichester',
  'Colchester',
  'Coventry',
  'Derby',
  'Derry',
  'Doncaster',
  'Dundee',
  'Dunfermline',
  'Durham',
  'Edinburgh',
  'Ely',
  'Exeter',
  'Glasgow',
  'Gloucester',
  'Hereford',
  'Inverness',
  'Ipswich',
  'Kingston upon Hull',
  'Lancaster',
  'Leeds',
  'Leicester',
  'Lichfield',
  'Lincoln',
  'Lisburn',
  'Liverpool',
  'London',
  'Londonderry',
  'Luton',
  'Manchester',
  'Milton Keynes',
  'Newcastle upon Tyne',
  'Newport',
  'Newry',
  'Northampton',
  'Norwich',
  'Nottingham',
  'Oxford',
  'Perth',
  'Peterborough',
  'Plymouth',
  'Portsmouth',
  'Preston',
  'Reading',
  'Ripon',
  'Salford',
  'Salisbury',
  'Sheffield',
  'Southampton',
  'Southend-on-Sea',
  'St Albans',
  'St Asaph',
  'St Davids',
  'Stirling',
  'Stoke-on-Trent',
  'Sunderland',
  'Swansea',
  'Swindon',
  'Truro',
  'Wakefield',
  'Wells',
  'Westminster',
  'Winchester',
  'Wolverhampton',
  'Worcester',
  'Wrexham',
  'York',
];

export const getCitySelectOptions = (cities, currentCity) => {
  const list = Array.isArray(cities) ? cities : [];
  const current = String(currentCity || '').trim();
  const seen = new Set(list.map((city) => city.toLowerCase()));
  const options = list.map((name) => {
    if (current && name.toLowerCase() === current.toLowerCase()) {
      return { id: current, name };
    }
    return { id: name, name };
  });
  if (current && !seen.has(current.toLowerCase())) {
    options.unshift({ id: current, name: current });
  }
  return options;
};
