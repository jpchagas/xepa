// Product id for a CEASA product name ("Cebola Nacional" -> "cebola_nacional").
//
// Must stay identical to normalizeProductId in
// functions/src/ceasa/syncPrices.js (a test checks this): the import
// creates products under these ids, and recipes link to them.
export const normalizeProductId = name =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[()/]/g, '')
