// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************

import React from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { categoryMenuList } from "@/lib/utils";
import Heading from "./Heading";
import { formatCategoryName } from "@/utils/categoryFormating";

type CategoryItem = {
  id: string;
  name: string;
  mainImage: string;
};

const CategoryMenu = async () => {
  const res = await fetch("http://localhost:3001/api/categories", {
    cache: "no-store",
  });
  const categories: CategoryItem[] = await res.json();

  return (
    <div className="py-10 bg-blue-500">
      <Heading title="BROWSE CATEGORIES" />
      <div className="max-w-screen-2xl mx-auto py-10 gap-x-5 px-16 max-md:px-10 gap-y-5 grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-[450px]:grid-cols-1">
        {categories.map((item) => (
          <CategoryItem
            title={formatCategoryName(item.name)}
            key={item.id}
            href={`/shop/${item.name}`}
          >
            <Image
              src={`/${item.mainImage}`}
              width={48}
              height={48}
              alt={item.name}
            />
          </CategoryItem>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
