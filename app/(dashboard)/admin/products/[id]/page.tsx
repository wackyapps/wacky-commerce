"use client";
import { CustomButton, DashboardSidebar, SectionTitle } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import { nanoid } from "nanoid";
import { BASE_URL } from "@/utils/base_url";

interface DashboardProductDetailsProps {
  params: { id: number };
}

const emptyVariantObject = {
  name: "",
  price: 0,
  inStock: 1,
};
const DashboardProductDetails = ({
  params: { id },
}: DashboardProductDetailsProps) => {
  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>();
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const router = useRouter();

  // functionality for deleting product
  const deleteProduct = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    fetch(`${BASE_URL}/api/products/${id}`, requestOptions)
      .then((response) => {
        if (response.status !== 204) {
          if (response.status === 400) {
            toast.error(
              "Cannot delete the product because of foreign key constraint"
            );
          } else {
            throw Error("There was an error while deleting product");
          }
        } else {
          toast.success("Product deleted successfully");
          router.push("/admin/products");
        }
      })
      .catch((error) => {
        toast.error("There was an error while deleting product");
      });
  };

  // functionality for updating product
  const updateProduct = async () => {
    if (
      product?.title === "" ||
      product?.slug === "" ||
      product?.manufacturer === "" ||
      product?.description === ""
    ) {
      toast.error("You need to enter values in input fields");
      return;
    }

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    };
    fetch(`${BASE_URL}/api/products/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw Error("There was an error while updating product");
        }
      })
      .then((data) => toast.success("Product successfully updated"))
      .catch((error) => {
        toast.error("There was an error while updating product");
      });
  };

  // functionality for uploading main image file
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
        toast.error("File upload unsuccessful.");
      }
    } catch (error) {
      console.error("There was an error while during request sending:", error);
      toast.error("There was an error during request sending");
    }
  };

  // fetching main product data including other product images
  const fetchProductData = async () => {
    fetch(`${BASE_URL}/api/products/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      });

    const imagesData = await fetch(`${BASE_URL}/api/images/${id}`, {
      cache: "no-store",
    });
    const images = await imagesData.json();
    setOtherImages((currentImages) => images);
  };

  // fetching all product categories. It will be used for displaying categories in select category input
  const fetchCategories = async () => {
    fetch(`${BASE_URL}/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1 className="text-3xl font-semibold">Product details</h1>
        {/* Product name input div - start */}
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
                setProduct({ ...product!, title: e.target.value })
              }
            />
          </label>
        </div>
        {/* Product name input div - end */}
        {/* Product price input div - start */}

        {/* Product price input div - end */}
        {/* Product manufacturer input div - start */}
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
                setProduct({ ...product!, manufacturer: e.target.value })
              }
            />
          </label>
        </div>
        {/* Product manufacturer input div - end */}
        {/* Product slug input div - start */}

        <div>
          <label className="daisy-form-control w-full max-w-xs">
            <div className="daisy-label">
              <span className="daisy-label-text">Slug:</span>
            </div>
            <input
              type="text"
              className="daisy-input daisy-input-bordered w-full max-w-xs"
              value={product?.slug && convertSlugToURLFriendly(product?.slug)}
              onChange={(e) => {
                let value = e.target.value;
                // Remove leading slash if present
                if (value.startsWith("/")) {
                  value = value.substring(1);
                }
                // Replace spaces with hyphens
                value = value.replace(/\s+/g, "-");
                setProduct({
                  ...product!,
                  slug: value.toLowerCase(),
                });
              }}
            />
          </label>
        </div>
        {/* Product slug input div - end */}
        {/* Product inStock select input div - start */}

        {/* Product inStock select input div - end */}
        {/* Product category select input div - start */}
        <div>
          <label className="daisy-form-control w-full max-w-xs">
            <div className="daisy-label">
              <span className="daisy-label-text">Category:</span>
            </div>
            <select
              className="daisy-select daisy-select-bordered"
              value={product?.categoryId}
              onChange={(e) =>
                setProduct({
                  ...product!,
                  categoryId: e.target.value,
                })
              }
            >
              {categories &&
                categories.map((category: Category) => (
                  <option key={category?.id} value={category?.id}>
                    {formatCategoryName(category?.name)}
                  </option>
                ))}
            </select>
          </label>
        </div>
        {/* Product category select input div - end */}

        {/* Main image file upload div - start */}
        <div>
          <input
            type="file"
            className="daisy-file-input daisy-file-input-bordered daisy-file-input-lg w-full max-w-sm"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];

              if (selectedFile) {
                uploadFile(selectedFile);
              }
            }}
          />
          {product?.mainImage && (
            <Image
              src={`${BASE_URL}/uploads/` + product?.mainImage}
              alt={product?.title}
              className="w-auto h-auto mt-2"
              width={100}
              height={100}
            />
          )}
        </div>
        {/* Main image file upload div - end */}
        {/* Other images file upload div - start */}
        <div className="flex gap-x-1">
          {otherImages &&
            otherImages.map((image) => (
              <Image
                src={`/${image.image}`}
                key={nanoid()}
                alt="product image"
                width={100}
                height={100}
                className="w-auto h-auto"
              />
            ))}
        </div>
        {/* Other images file upload div - end */}
        {/* Product description div - start */}
        <div>
          <label className="daisy-form-control">
            <div className="daisy-label">
              <span className="daisy-label-text">Product description:</span>
            </div>
            <textarea
              className="daisy-textarea daisy-textarea-bordered h-24"
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product!, description: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Product Variants</h2>
          {product?.variants?.map((variant, index) => (
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
                          ...product!,
                          variants: product!.variants.map((v, i) =>
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
                          ...product!,
                          variants: product!.variants.map((v, i) =>
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
                          ...product!,
                          variants: product!.variants.map((v, i) =>
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
                      ...product!,
                      variants: product!.variants.filter((_, i) => i !== index),
                    })
                  }
                  disabled={product!.variants.length === 1}
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
                ...product!,
                variants: [...product!.variants, emptyVariantObject],
              })
            }
            className="daisy-btn daisy-btn-primary"
          >
            Add Variant
          </button>
        </div>
        {/* Product description div - end */}
        {/* Action buttons div - start */}
        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            onClick={updateProduct}
            className="uppercase bg-blue-500 px-10 py-5 text-lg border  border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
          >
            Update product
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border  border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={deleteProduct}
          >
            Delete product
          </button>
        </div>
        {/* Action buttons div - end */}
        <p className="text-xl max-sm:text-lg text-error">
          To delete the product you first need to delete all its records in
          orders (customer_order_product table).
        </p>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
