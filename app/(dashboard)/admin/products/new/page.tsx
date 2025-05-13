"use client";
import { DashboardSidebar } from "@/components";
import { BASE_URL } from "@/utils/base_url";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const emptyVariantObject = {
  name: "",
  price: 0,
  inStock: 1,
};

const AddNewProduct = () => {
  const [product, setProduct] = useState<{
    title: string;
    manufacturer: string;
    mainImage: string;
    description: string;
    slug: string;
    categoryId: string;
    variants: ProductVariant[];
  }>({
    title: "",
    manufacturer: "",
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
    variants: [emptyVariantObject],
  });
  const [categories, setCategories] = useState<Category[]>([]);

  const addProduct = async () => {
    if (
      product.title === "" ||
      product.manufacturer === "" ||
      product.description == "" ||
      product.slug === "" ||
      product.variants.length === 0
    ) {
      toast.error("Please enter values in input fields");
      return;
    }

    const requestOptions: any = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    };
    fetch(`${BASE_URL}/api/products`, requestOptions)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw Error("There was an error while creating product");
        }
      })
      .then((data) => {
        toast.success("Product added successfully");
        setProduct({
          title: "",
          manufacturer: "",
          mainImage: "",
          description: "",
          slug: "",
          categoryId: "",
          variants: [emptyVariantObject],
        });
      })
      .catch((error) => {
        toast.error("There was an error while creating product");
      });
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await fetch(`${BASE_URL}/api/main-image`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProduct({ ...product, mainImage: data.filename });
      } else {
        console.error("File upload unsuccessfull");
      }
    } catch (error) {
      console.error("Error happend while sending request:", error);
    }
  };

  const fetchCategories = async () => {
    fetch(`${BASE_URL}/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setProduct({
          title: "",
          manufacturer: "",
          mainImage: "",
          description: "",
          slug: "",
          categoryId: data[0]?.id,
          variants: [emptyVariantObject],
        });
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new product</h1>
        <div>
          <label className="daisy-form-control w-full max-w-xs">
            <div className="daisy-label">
              <span className="daisy-label-text">Product name:</span>
            </div>
            <input
              type="text"
              className="daisy-input daisy-input-bordered w-full max-w-xs"
              value={product?.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="daisy-form-control w-full max-w-xs">
            <div className="daisy-label">
              <span className="daisy-label-text">Product slug:</span>
            </div>
            <input
              type="text"
              className="daisy-input daisy-input-bordered w-full max-w-xs"
              value={convertSlugToURLFriendly(product?.slug)}
              onChange={(e) => {
                let value = e.target.value;
                // Remove leading slash if present
                if (value.startsWith("/")) {
                  value = value.substring(1);
                }
                // Replace spaces with hyphens
                value = value.replace(/\s+/g, "-");
                setProduct({
                  ...product,
                  slug: value.toLowerCase(),
                });
              }}
            />
          </label>
        </div>

        <div>
          <label className="daisy-form-control w-full max-w-xs">
            <div className="daisy-label">
              <span className="daisy-label-text">Category:</span>
            </div>
            <select
              className="daisy-select daisy-select-bordered"
              value={product?.categoryId}
              onChange={(e) =>
                setProduct({ ...product, categoryId: e.target.value })
              }
            >
              {categories &&
                categories.map((category: any) => (
                  <option key={category?.id} value={category?.id}>
                    {category?.name}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <div>
          <label className="daisy-form-control w-full max-w-xs">
            <div className="daisy-label">
              <span className="daisy-label-text">Manufacturer:</span>
            </div>
            <input
              type="text"
              className="daisy-input daisy-input-bordered w-full max-w-xs"
              value={product?.manufacturer}
              onChange={(e) =>
                setProduct({ ...product, manufacturer: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <input
            type="file"
            className="daisy-file-input daisy-file-input-bordered daisy-file-input-lg w-full max-w-sm"
            onChange={(e: any) => {
              uploadFile(e.target.files[0]);
            }}
          />
          {product?.mainImage && (
            <Image
              src={`${BASE_URL}/uploads/` + product?.mainImage}
              alt={product?.title}
              className="w-auto h-auto"
              width={100}
              height={100}
            />
          )}
        </div>
        <div>
          <label className="daisy-form-control">
            <div className="daisy-label">
              <span className="daisy-label-text">Product description:</span>
            </div>
            <textarea
              className="daisy-textarea daisy-textarea-bordered h-24"
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Product Variants</h2>
          {product.variants.map((variant, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <label className="daisy-form-control w-full max-w-xs">
                    <div className="daisy-label">
                      <span className="daisy-label-text">Variant Name:</span>
                    </div>
                    <input
                      type="text"
                      className="daisy-input daisy-input-bordered w-full max-w-xs"
                      value={variant.name}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          variants: product.variants.map((v, i) =>
                            i === index ? { ...v, name: e.target.value } : v
                          ),
                        })
                      }
                    />
                  </label>
                  <label className="daisy-form-control w-full max-w-xs">
                    <div className="daisy-label">
                      <span className="daisy-label-text">Variant Price:</span>
                    </div>
                    <input
                      type="text"
                      className="daisy-input daisy-input-bordered w-full max-w-xs"
                      value={variant.price}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          variants: product.variants.map((v, i) =>
                            i === index
                              ? { ...v, price: Number(e.target.value) }
                              : v
                          ),
                        })
                      }
                    />
                  </label>
                  <label className="daisy-form-control w-full max-w-xs">
                    <div className="daisy-label">
                      <span className="daisy-label-text">In Stock:</span>
                    </div>
                    <select
                      className="daisy-select daisy-select-bordered"
                      value={variant.inStock}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          variants: product.variants.map((v, i) =>
                            i === index
                              ? { ...v, inStock: Number(e.target.value) }
                              : v
                          ),
                        })
                      }
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setProduct({
                      ...product,
                      variants: product.variants.filter((_, i) => i !== index),
                    })
                  }
                  disabled={product.variants.length === 1}
                  className="daisy-btn daisy-btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setProduct({
                ...product,
                variants: [...product.variants, emptyVariantObject],
              })
            }
            className="daisy-btn daisy-btn-primary"
          >
            Add Variant
          </button>
        </div>

        <div className="flex gap-x-2">
          <button
            onClick={addProduct}
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border  border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
          >
            Add product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;
