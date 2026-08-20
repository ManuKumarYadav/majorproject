// Utility for managing client-side wishlist in LocalStorage

export const getWishlist = () => {
  try {
    const saved = localStorage.getItem('stayaira_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error reading wishlist from localStorage:', e);
    return [];
  }
};

export const isWishlisted = (id) => {
  if (!id) return false;
  const list = getWishlist();
  return list.includes(id);
};

export const toggleWishlistId = (id) => {
  if (!id) return [];
  const list = getWishlist();
  let updated;
  if (list.includes(id)) {
    updated = list.filter(item => item !== id);
  } else {
    updated = [...list, id];
  }
  try {
    localStorage.setItem('stayaira_wishlist', JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving wishlist to localStorage:', e);
  }
  
  // Broadcast event so UI updates instantly across components
  window.dispatchEvent(new Event('wishlistUpdated'));
  return updated;
};
