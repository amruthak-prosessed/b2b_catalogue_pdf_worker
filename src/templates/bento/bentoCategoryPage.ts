import { generateBentoProductCard } from "./bentoProductCard";

import { generateFooter } from "../components/Footer";


export function generateBentoCategoryPage(
  catalog: any,
  brand: string,
  category: string,
  products: any[]
) {
  const safeBrand = brand
    .replace(/\s+/g, "-")
    .toLowerCase();

  const safeCategory = category
    .replace(/\s+/g, "-")
    .toLowerCase();

  /*
    Page strategy:

    1 product  -> 1 large
    2 products -> 2 large
    3 products -> 1 large + 2 small
    4 products -> 2 large rows
    5 products -> 1 large + 2 small, then 2 large
    6 products -> 2 complete bento rows

    More than 6:
    create separate pages with maximum 6 products each.

    This prevents Puppeteer from deciding where to split cards.
  */

  const pages: any[][] = [];

  for (let i = 0; i < products.length; i += 6) {
    pages.push(products.slice(i, i + 6));
  }

  const renderCard = (
    product: any,
    size: "large" | "small"
  ) =>
    generateBentoProductCard(
      product,
      catalog.settings,
      size
    );

  const renderThree = (
    group: any[],
    reverse = false
  ) => {
    const large = renderCard(group[0], "large");

    const smallCards = group
      .slice(1)
      .map((product) =>
        renderCard(product, "small")
      )
      .join("");

    return `
      <div class="productRow bentoRow ${
        reverse ? "reverse" : ""
      }">

        ${
          reverse
            ? `
              <div class="bentoSmallColumn">
                ${smallCards}
              </div>

              ${large}
            `
            : `
              ${large}

              <div class="bentoSmallColumn">
                ${smallCards}
              </div>
            `
        }

      </div>
    `;
  };

  const renderPageProducts = (
    pageProducts: any[]
  ) => {
    const count = pageProducts.length;

    // ─────────────────────────────
    // 1 PRODUCT
    // ─────────────────────────────

    if (count === 1) {
      return `
        <div class="bentoSingleProduct">
          ${renderCard(pageProducts[0], "large")}
        </div>
      `;
    }

    // ─────────────────────────────
    // 2 PRODUCTS
    // ─────────────────────────────

    if (count === 2) {
      return `
        <div class="bentoTwoProducts">

          ${renderCard(pageProducts[0], "large")}

          ${renderCard(pageProducts[1], "large")}

        </div>
      `;
    }

    // ─────────────────────────────
    // 3 PRODUCTS
    // ─────────────────────────────

    if (count === 3) {
      return renderThree(pageProducts);
    }

    // ─────────────────────────────
    // 4 PRODUCTS
    // 2 balanced Bento rows
    // ─────────────────────────────

    if (count === 4) {
      return `
        <div class="bentoTwoProducts">
          ${renderCard(pageProducts[0], "large")}
          ${renderCard(pageProducts[1], "large")}
        </div>

        <div class="bentoTwoProducts">
          ${renderCard(pageProducts[2], "large")}
          ${renderCard(pageProducts[3], "large")}
        </div>
      `;
    }

    // ─────────────────────────────
    // 5 PRODUCTS
    // 3 Bento + 2 horizontal
    // ─────────────────────────────

    if (count === 5) {
      return `
        ${renderThree(pageProducts.slice(0, 3))}

        <div class="bentoTwoProducts">
          ${renderCard(pageProducts[3], "large")}
          ${renderCard(pageProducts[4], "large")}
        </div>
      `;
    }

    // ─────────────────────────────
    // 6 PRODUCTS
    // 2 full Bento rows
    // ─────────────────────────────

    return `
      ${renderThree(pageProducts.slice(0, 3))}

      ${renderThree(
        pageProducts.slice(3, 6),
        true
      )}
    `;
  };

  return pages
    .map((pageProducts, pageIndex) => {
      const isFirstPage = pageIndex === 0;

      return `
        <div
          class="page categoryPage bentoCategoryPage"
          ${
            isFirstPage
              ? `id="category-${safeBrand}-${safeCategory}"`
              : ""
          }
        >

          <div class="pageContent">

            <div class="bentoCategoryHeader">

              <div>

                <div class="bentoSupplierLabel">
                  ${brand}
                </div>

                <h1 class="categoryHeading">
                  ${category}
                </h1>

              </div>

              <div class="bentoCategoryCount">

                ${products.length}

                ${
                  products.length === 1
                    ? "Product"
                    : "Products"
                }

              </div>

            </div>

            <div class="productRows">

              ${renderPageProducts(pageProducts)}

            </div>

          </div>

          <div class="bentoFooter">
            <div class="bentoFooterCompany">
                ${
                catalog.companies?.logo_url
                    ? `<img
                        src="${catalog.companies.logo_url}"
                        class="bentoFooterLogo"
                    />`
                    : ""
                }

                <div>
                <strong>${catalog.companies?.name ?? ""}</strong>
                <div class="bentoFooterAddress">
                    ${catalog.companies?.address ?? ""}
                </div>
                </div>
            </div>

            <div class="bentoFooterContact">
                <span>CONTACT</span>

                ${
                catalog.companies?.phone
                    ? `<div>${catalog.companies.phone}</div>`
                    : ""
                }

                ${
                catalog.companies?.email
                    ? `<div>${catalog.companies.email}</div>`
                    : ""
                }

                ${
                catalog.companies?.website
                    ? `<div>${catalog.companies.website}</div>`
                    : ""
                }
            </div>

            ${generateFooter(catalog)}
            
            </div>

        </div>
      `;
    })
    .join("");
}