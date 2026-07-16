export function generateBentoProductCard(
  catalogProduct: any,
  settings: any,
  size: "large" | "small" = "small"
) {
  const product = catalogProduct.products;

  const image =
    product.product_images?.[0];

  const imageUrl = image
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/product_images/${image.storage_url}`
    : "";

  return `
    <div class="bentoCard ${size}">

      <div class="bentoImageContainer">

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
                No Image
              </div>
            `
        }

        ${
          settings?.showStock
            ? `
              <span class="bentoStock ${
                product.stock > 0
                  ? ""
                  : "out"
              }">
                ${
                  product.stock > 0
                    ? "In Stock"
                    : "Out of Stock"
                }
              </span>
            `
            : ""
        }

      </div>

      <div class="bentoProductInfo">

        <h3 class="bentoProductName">
          ${product.name}
        </h3>

        ${
          settings?.showSku
            ? `
              <div class="bentoSku">
                SKU: ${product.sku ?? "-"}
              </div>
            `
            : ""
        }

        <div class="bentoBottom">

          ${
            settings?.showPrice
              ? `
                <span class="bentoPrice">
                  AED ${product.price ?? "-"}
                </span>
              `
              : ""
          }

          ${
            product.unit
              ? `
                <span class="bentoUnit">
                  ${product.unit}
                </span>
              `
              : ""
          }

        </div>

      </div>

    </div>
  `;
}