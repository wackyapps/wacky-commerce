"use client";
import { useProductStore } from "@/app/_zustand/store";
import Image from "next/image";
import Link from "next/link";
import QuantityInputCart from "../QuantityInputCart";
import toast from "react-hot-toast";
import {
  FaCheck,
  FaCircleQuestion,
  FaClock,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
const CartDrawer = () => {
  const {
    products,
    removeFromCart,
    calculateTotals,
    total,
    isShowCartDrawer,
    setShowCartDrawer,
  } = useProductStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success("Product removed from the cart");
  };
  const { isOpen, onClose } = {
    isOpen: isShowCartDrawer,
    onClose: () => {
      setShowCartDrawer(false);
    },
  };

  return (
    <>
      <Drawer
        size="lg"
        isOpen={isOpen}
        onClose={onClose}
        className="rounded-none"
      >
        <DrawerContent className="rounded-none">
          {(onClose) => (
            <>
              <DrawerBody className="p-0 rounded-none">
                <div className="p-4 flex min-h-full flex-col items-stretch">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Shopping Cart
                  </h1>
                  <form className="mt-12 flex-1 flex flex-col items-stretch  ">
                    <section aria-labelledby="cart-heading" className="flex-1">
                      <h2 id="cart-heading" className="sr-only">
                        Items in your shopping cart
                      </h2>

                      <ul
                        role="list"
                        className="divide-y divide-gray-200 border-b border-t border-gray-200"
                      >
                        {products.map((product) => (
                          <li key={product.id} className="flex  py-6 sm:py-10">
                            <div className="flex-shrink-0">
                              <Image
                                width={112}
                                height={112}
                                src={
                                  product?.image
                                    ? `/${product.image}`
                                    : "/product_placeholder.jpg"
                                }
                                alt="laptop image"
                                className="h-24 w-24 rounded-md object-cover object-center sm:h-28 sm:w-28"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col justify-between ">
                              <div className="relative  sm:grid sm:grid-cols-2 sm:gap-x-2 ">
                                <div>
                                  <div className="flex justify-between">
                                    <h3 className="text-sm">
                                      <Link
                                        href={`#`}
                                        className="font-medium text-gray-700 hover:text-gray-800"
                                      >
                                        {product.title}
                                      </Link>
                                    </h3>
                                  </div>

                                  <p className="mt-1 text-sm font-medium text-gray-900">
                                    ${product.price}
                                  </p>
                                </div>

                                <div className="mt-4 sm:mt-0 flex justify-between items-center">
                                  <QuantityInputCart product={product} />
                                  <div className=" right-0 top-0">
                                    <button
                                      onClick={() =>
                                        handleRemoveItem(product.id)
                                      }
                                      type="button"
                                      className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                    >
                                      <span className="sr-only">Remove</span>
                                      <FaTrash
                                        color="red"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                                {1 ? (
                                  <FaCheck
                                    className="h-5 w-5 flex-shrink-0 text-green-500"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <FaClock
                                    className="h-5 w-5 flex-shrink-0 text-gray-300"
                                    aria-hidden="true"
                                  />
                                )}

                                <span>
                                  {1 ? "In stock" : `Ships in 3 days`}
                                </span>
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Order summary */}
                    <section
                      aria-labelledby="summary-heading"
                      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6  "
                    >
                      <h2
                        id="summary-heading"
                        className="text-lg font-medium text-gray-900"
                      >
                        Order summary
                      </h2>

                      <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-gray-600">Subtotal</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            ${total}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                          <dt className="flex items-center text-sm text-gray-600">
                            <span>Shipping estimate</span>
                            <a
                              href="#"
                              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">
                                Learn more about how shipping is calculated
                              </span>
                              <FaCircleQuestion
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </a>
                          </dt>
                          <dd className="text-sm font-medium text-gray-900">
                            $5.00
                          </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                          <dt className="flex text-sm text-gray-600">
                            <span>Tax estimate</span>
                            <a
                              href="#"
                              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">
                                Learn more about how tax is calculated
                              </span>
                              <FaCircleQuestion
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </a>
                          </dt>
                          <dd className="text-sm font-medium text-gray-900">
                            ${total / 5}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                          <dt className="text-base font-medium text-gray-900">
                            Order total
                          </dt>
                          <dd className="text-base font-medium text-gray-900">
                            $
                            {total === 0
                              ? 0
                              : Math.round(total + total / 5 + 5)}
                          </dd>
                        </div>
                      </dl>
                      {products.length > 0 && (
                        <div className="mt-6">
                          <Link
                            href="/checkout"
                            className=" flex justify-center items-center w-full uppercase bg-white px-4 py-3 text-base border  border-gray-300 font-bold text-blue-600 shadow-sm  duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2"
                          >
                            <span>Checkout</span>
                          </Link>
                        </div>
                      )}
                    </section>
                  </form>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CartDrawer;
