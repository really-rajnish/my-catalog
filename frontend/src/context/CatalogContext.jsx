import React, { createContext, useContext, useReducer } from 'react';

const CatalogContext = createContext();

const initialState = {
  products: [],
  categories: [],
  filters: {
    categoryId: null,
    brands: [],
    minPrice: null,
    maxPrice: null,
    inStockOnly: false,
    sortBy: 'newest'
  },
  searchResults: [],
  loading: false,
  error: null
};

function catalogReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, loading: false };
    default:
      return state;
  }
}

export function CatalogProvider({ children }) {
  const [state, dispatch] = useReducer(catalogReducer, initialState);

  return (
    <CatalogContext.Provider value={{ state, dispatch }}>
      {children}
    </CatalogContext.Provider>
  );
}

export const useCatalog = () => useContext(CatalogContext);
