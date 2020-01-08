//Константы для шины событий
export const BUS_MESSAGE_READ_EVENT = 'message_read_event';
export const BUS_NEW_MESSAGE_EVENT = 'new_message_event';
export const BUS_CLEAR_NOTIFICATIONS = 'clear_notifications';
export const BUS_CLOSE_PROPOSAL = 'close-proposal';
export const BACK_TO_FORM_EVENT = 'back_to_form';
//Константы для хранилища значений
export const STORAGE_NEW_ORGANIZATIONS_IDS = 'noids';
export const STORAGE_AUTH_ID = 'battle@id';
export const STORAGE_AUTH_TOKEN = 'battle@token';
export const STORAGE_FIRST_LUNCH = "battle@firstLunch";
export const STORAGE_PROPOSALS_LIST_CACHE_KEY = 'proposal-list';
export const STORAGE_GEO_CACHE_KEY = 'geo-base';
//Числовые константы
export const MIN_GUEST_COUNT = 1; //Минимальное кол-во гостей
export const MIN_AMOUNT = 1000; //Минимальная стоимость
//Кеш
export const CACHE_PREFIX = 'cachestore-';
export const CACHE_EXPIRATION_PREFIX = 'cacheexpiration-';
export const EXPIRY_UNITS = 60 * 1000; // Time resolution in minutes
