export function generateBentoProductCard(
  catalogProduct: any,
  settings: any,
  size: "large" | "small" = "small",
  colorIndex: number = 1
) {
  const product =
    catalogProduct?.products;

  if (!product) {
    return "";
  }

  /* =========================================
     PRODUCT IMAGE
  ========================================= */

  const images =
    product.product_images ?? [];

  const primaryImage =
    images.find(
      (image: any) =>
        image.is_primary === true
    ) ??
    images[0];

  const imageUrl =
    primaryImage?.storage_url
      ? `${process.env.SUPABASE_URL}/storage/v1/object/public/product-images/${primaryImage.storage_url}`
      : "";

  /* =========================================
     STOCK

     Keeping current stock logic unchanged.
     We can fix boolean stock separately.
  ========================================= */

  const rawStock =
    product.stock ??
    product.stock_quantity ??
    product.quantity ??
    null;

  const hasStockInformation =
    rawStock !== null &&
    rawStock !== undefined &&
    rawStock !== "";

  const numericStock =
    hasStockInformation
      ? Number(rawStock)
      : null;

  const isInStock =
    numericStock !== null &&
    !Number.isNaN(numericStock)
      ? numericStock > 0
      : null;

  /* =========================================
     PRICE
  ========================================= */

  const price =
    catalogProduct.price ??
    product.price ??
    null;

  /* =========================================
     UNIT / PACK INFORMATION
  ========================================= */

  const unit =
    catalogProduct.unit ??
    product.unit ??
    product.pack_size ??
    product.packSize ??
    "";

  /* =========================================
     COLOUR
  ========================================= */

  const safeColorIndex =
    ((colorIndex - 1) % 7) + 1;

  /* =========================================
     CARD
  ========================================= */

  return `
    <div
      class="
        bentoCard
        ${size}
        productColor${safeColorIndex}
      "
    >

      <div class="bentoImageContainer">

        <div
          class="bentoProductDecor
                 bentoProductDecorOne"
        ></div>

        <div
          class="bentoProductDecor
                 bentoProductDecorTwo"
        ></div>

        ${
          imageUrl
            ? `
              <img
                src="${imageUrl}"
                class="bentoProductImage"
              />
            `
            : `
              <div class="bentoNoImage">

                <div class="bentoNoImageIcon">
                  ◇
                </div>

                <span>
                  No Image
                </span>

              </div>
            `
        }

        ${
          settings?.showStock &&
          hasStockInformation &&
          isInStock !== null
            ? `
              <span
                class="
                  bentoStock
                  ${
                    isInStock
                      ? ""
                      : "out"
                  }
                "
              >
                ${
                  isInStock
                    ? "In Stock"
                    : "Out of Stock"
                }
              </span>
            `
            : ""
        }

      </div>

      <div class="bentoProductInfo">

        <div class="bentoProductText">

          <h3 class="bentoProductName">
            ${product.name ?? ""}
          </h3>

          ${
            settings?.showSku &&
            product.sku
              ? `
                <div class="bentoSku">
                  ${product.sku}
                </div>
              `
              : ""
          }

        </div>

        <div class="bentoBottom">

          ${
            settings?.showPrice &&
            price !== null &&
            price !== undefined
              ? `
                <span class="bentoPrice">
                  Rs ${price}
                </span>
              `
              : `
                <span></span>
              `
          }

          ${
            unit
              ? `
                <span class="bentoUnit">
                  ${unit}
                </span>
              `
              : ""
          }

        </div>

      </div>

    </div>
  `;
}