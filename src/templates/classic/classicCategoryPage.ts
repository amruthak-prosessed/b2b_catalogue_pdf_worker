import { generateSupplierHeader } from "../components/SupplierHeader";
import { generateProductCard } from "../components/ProductCard";
import { generateFooter } from "../components/Footer";
import { chunkArray } from "../components/chunkArray";

export function generateCategoryPage(
  catalog: any,
  brand: string,
  category: string,
  products: any[],
  supplierLogoUrl: string,
  showHeader: boolean = true
) {
  const safeBrand = brand
    .replace(/\s+/g, "-")
    .toLowerCase();

  const safeCategory = category
    .replace(/\s+/g, "-")
    .toLowerCase();

  // This is NOT pagination.
  // We group by 4 only because the visual grid has 4 columns.
  const productRows = chunkArray(
    products,
    4
  );

  const rowsHtml = productRows
    .map(
      (row: any[]) => `
        <div class="productRow">
          ${row
            .map((product: any) =>
              generateProductCard(
                product,
                catalog.settings
              )
            )
            .join("")}
        </div>
      `
    )
    .join("");

  /*
   * First category is inserted directly
   * into the supplier page.
   */
  if (!showHeader) {
    return `
      <div
        class="categorySection"
        id="category-${safeBrand}-${safeCategory}"
        data-brand="${safeBrand}"
        data-category="${safeCategory}"
      >

        <div class="categoryTitleRow">

          <h2 class="categoryHeading">
            ${category}
          </h2>

          <span class="categoryCount">
            ${products.length} Items
          </span>

        </div>

        <div class="productRows">
          ${rowsHtml}
        </div>

      </div>
    `;
  }

  /*
   * Other categories begin on their own page.
   *
   * At this stage ALL rows are placed here.
   * Puppeteer will later move overflowing rows
   * onto continuation pages.
   */
  return `
    <div
      class="page categoryPage"
      id="category-${safeBrand}-${safeCategory}"
      data-brand="${safeBrand}"
      data-category="${safeCategory}"
    >

      <div class="pageContent">

        ${generateSupplierHeader(
          brand,
          supplierLogoUrl,
          products.length
        )}

        <div class="categoryTitleRow">

            <h2 class="categoryHeading">
                ${category}
            </h2>

            <span class="categoryCount">
                ${products.length} Items
            </span>

        </div>

        <div class="productRows">
          ${rowsHtml}
        </div>

      </div>

      ${generateFooter(catalog)}

    </div>
  `;
}