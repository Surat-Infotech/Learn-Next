'use client';

import { useState, useEffect } from 'react';

import constate from 'constate';

import { productCategoryApi } from '@/api/product-category';

type Category = { id: string; name: string, slug: string } | any; // Replace with your real type

const useProductCategory = () => {
  const [category, setCategory] = useState<Category | null>(null);

  const getCategories = async () => {
    const { data } = await productCategoryApi.all();
    setCategory(data.data);
  };

  useEffect(() => {
    if (!category?.length) getCategories();
  }, [category?.length]);

  return {
    category,
    setCategory,
  };
};

export const [ProductProvider, useProductContext] = constate(useProductCategory);

