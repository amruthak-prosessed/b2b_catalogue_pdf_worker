export function generateBentoSupplierPage(
  catalog: any,
  brand: string,
  products: any[],
  supplierLogos: any[]
) {
  const safeBrand = brand
    .replace(/\s+/g, "-")
    .toLowerCase();

  const supplierLogo = supplierLogos.find(
    (supplier: any) =>
      supplier.brand?.trim().toLowerCase() ===
      brand?.trim().toLowerCase()
  );

  const supplierLogoUrl = supplierLogo
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${supplierLogo.asset_path}`
    : "";

  const categories = [
    ...new Set(
      products.map(
        (cp: any) => cp.products.category
      )
    ),
  ] as string[];

  const categoryCards = categories
    .map((category) => {
      const categoryProducts =
        products.filter(
          (cp: any) =>
            cp.products.category === category
        );

      const categoryId = category
        .replace(/\s+/g, "-")
        .toLowerCase();

      // Pick up to 3 real product images
      // from this category for the visual strip.
      const previewProducts =
        categoryProducts
          .filter(
            (cp: any) =>
              cp.products.product_images?.length
          )
          .slice(0, 3);

      return `
        <a
          href="#category-${safeBrand}-${categoryId}"
          class="bentoCategoryCard"
        >

          <div class="bentoCategoryImages">

            ${
              previewProducts.length
                ? previewProducts
                    .map((cp: any) => {
                      const image =
                        cp.products.product_images[0];

                      const imageUrl =
                        `${process.env.SUPABASE_URL}/storage/v1/object/public/product_images/${image.storage_url}`;

                      return `
                        <div class="bentoCategoryImage">
                          <img src="${imageUrl}" />
                        </div>
                      `;
                    })
                    .join("")
                : `
                  <div class="bentoCategoryFallback">
                    ${category
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                `
            }

          </div>

          <div class="bentoCategoryInfo">

            <div>
              <h3>${category}</h3>

              <span>
                ${categoryProducts.length}
                ${
                  categoryProducts.length === 1
                    ? "Product"
                    : "Products"
                }
              </span>
            </div>

            <div class="bentoCategoryArrow">
              →
            </div>

          </div>

        </a>
      `;
    })
    .join("");

  return `
    <div
      class="page bentoSupplierPage"
      id="supplier-${safeBrand}"
    >

      <div class="pageContent">

        <div class="bentoSupplierHeader">

          <div class="bentoSupplierIdentity">

            ${
              supplierLogoUrl
                ? `
                  <img
                    src="${supplierLogoUrl}"
                    class="bentoSupplierHeroLogo"
                  />
                `
                : `
                  <div class="bentoSupplierHeroPlaceholder">
                    ${brand.charAt(0).toUpperCase()}
                  </div>
                `
            }

            <div>

              <div class="bentoSupplierEyebrow">
                SUPPLIER COLLECTION
              </div>

              <h1>
                ${brand}
              </h1>

              <p>
                ${products.length}
                ${
                  products.length === 1
                    ? "Product"
                    : "Products"
                }
                across
                ${categories.length}
                ${
                  categories.length === 1
                    ? "Category"
                    : "Categories"
                }
              </p>

            </div>

          </div>

          <a
            href="#cover"
            class="bentoBackLink"
          >
            ← Suppliers
          </a>

        </div>

        <div class="bentoCategoryIntro">

          <div class="bentoSectionHeading">
            Browse Categories
          </div>

          <div class="bentoCategoryGrid">
            ${categoryCards}
          </div>

        </div>

      </div>

      <div class="footer">

        <div class="footerLeft">
          ${catalog.companies.name}
        </div>

        <div class="footerRight"></div>

      </div>

    </div>
  `;
}