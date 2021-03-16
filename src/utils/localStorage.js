export function getLocalStorageItem (key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (error) {
      console.log(error)
      return null
    }
  }
  
  export function setLocalStorageItem (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.log('Local storage is full.')
    }
  }
  
  export function removeLocalStorageItem (key) {
    localStorage.removeItem(key)
  }
  