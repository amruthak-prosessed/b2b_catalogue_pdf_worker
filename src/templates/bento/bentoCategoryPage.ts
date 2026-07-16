import { generateBentoProductCard } from "./BentoProductCard";

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

  const groups: any[][] = [];

  for (let i = 0; i < products.length; i += 3) {
    groups.push(products.slice(i, i + 3));
  }

  const rowsHtml = groups
    .map((group, index) => {
      const reverse = index % 2 !== 0;

      const largeProduct = group[0];
      const smallProducts = group.slice(1);

      const largeCard = largeProduct
        ? generateBentoProductCard(
            largeProduct,
            catalog.settings,
            "large"
          )
        : "";

      const smallCards = smallProducts
        .map((product) =>
          generateBentoProductCard(
            product,
            catalog.settings,
            "small"
          )
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

                ${largeCard}
              `
              : `
                ${largeCard}

                <div class="bentoSmallColumn">
                  ${smallCards}
                </div>
              `
          }

        </div>
      `;
    })
    .join("");

  return `
    <div
      class="page categoryPage bentoCategoryPage"
      id="category-${safeBrand}-${safeCategory}"
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
            ${products.length === 1 ? "Product" : "Products"}
          </div>

        </div>

        <div class="productRows">
          ${rowsHtml}
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