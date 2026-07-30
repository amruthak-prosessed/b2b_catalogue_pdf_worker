import { generateBentoProductCard } from "./bentoProductCard";
import { generateFooter } from "../components/Footer";

type ProductItem = any;

const PRODUCTS_PER_PAGE = 8;

/* =========================================================
   HELPERS
========================================================= */

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategory(
  item: ProductItem
): string {
  return (
    item?.products?.category?.trim() ||
    item?.products?.subcategory?.trim() ||
    item?.products?.sub_category?.trim() ||
    "Other"
  );
}

/* =========================================================
   PRODUCT CARD

   Product index controls pastel colour.
========================================================= */

function renderCard(
  product: ProductItem,
  settings: any,
  extraClass = "",
  colorIndex = 1
) {
  return `
    <div
      class="
        productTile
        ${extraClass}
      "
    >
      ${generateBentoProductCard(
        product,
        settings,
        "small",
        colorIndex
      )}
    </div>
  `;
}

/* =========================================================
   1 PRODUCT
========================================================= */

function renderOne(
  products: ProductItem[],
  settings: any
) {
  return `
    <div class="productBento productBentoOne">
      ${renderCard(
        products[0],
        settings,
        "",
        1
      )}
    </div>
  `;
}

/* =========================================================
   2 PRODUCTS
========================================================= */

function renderTwo(
  products: ProductItem[],
  settings: any
) {
  return `
    <div class="productBento productBentoTwo">

      ${renderCard(
        products[0],
        settings,
        "",
        1
      )}

      ${renderCard(
        products[1],
        settings,
        "",
        2
      )}

    </div>
  `;
}

/* =========================================================
   3 PRODUCTS
========================================================= */

function renderThree(
  products: ProductItem[],
  settings: any
) {
  return `
    <div class="productBento productBentoThree">

      ${renderCard(
        products[0],
        settings,
        "threeLarge",
        1
      )}

      ${renderCard(
        products[1],
        settings,
        "threeSmall1",
        2
      )}

      ${renderCard(
        products[2],
        settings,
        "threeSmall2",
        3
      )}

    </div>
  `;
}

/* =========================================================
   4 PRODUCTS
========================================================= */

function renderFour(
  products: ProductItem[],
  settings: any
) {
  return `
    <div class="productBento productBentoFour">

      ${products
        .map(
          (product, index) =>
            renderCard(
              product,
              settings,
              "",
              index + 1
            )
        )
        .join("")}

    </div>
  `;
}

/* =========================================================
   5 PRODUCTS
========================================================= */

function renderFive(
  products: ProductItem[],
  settings: any
) {
  return `
    <div class="productBento productBentoFive">

      ${renderCard(
        products[0],
        settings,
        "fiveLarge",
        1
      )}

      ${renderCard(
        products[1],
        settings,
        "fiveSmall1",
        2
      )}

      ${renderCard(
        products[2],
        settings,
        "fiveSmall2",
        3
      )}

      ${renderCard(
        products[3],
        settings,
        "fiveBottom1",
        4
      )}

      ${renderCard(
        products[4],
        settings,
        "fiveBottom2",
        5
      )}

    </div>
  `;
}

/* =========================================================
   6 PRODUCTS
========================================================= */

function renderSix(
  products: ProductItem[],
  settings: any
) {
  return `
    <div class="productBento productBentoSix">

      ${products
        .map(
          (product, index) =>
            renderCard(
              product,
              settings,
              "",
              index + 1
            )
        )
        .join("")}

    </div>
  `;
}

/* =========================================================
   7 PRODUCTS
========================================================= */

function renderSeven(
  products: ProductItem[],
  settings: any
) {
  return `
    <div class="productBento productBentoSeven">

      ${renderCard(
        products[0],
        settings,
        "sevenLarge",
        1
      )}

      ${renderCard(
        products[1],
        settings,
        "sevenSmall1",
        2
      )}

      ${renderCard(
        products[2],
        settings,
        "sevenSmall2",
        3
      )}

      ${renderCard(
        products[3],
        settings,
        "sevenSmall3",
        4
      )}

      ${renderCard(
        products[4],
        settings,
        "sevenSmall4",
        5
      )}

      ${renderCard(
        products[5],
        settings,
        "sevenBottom1",
        6
      )}

      ${renderCard(
        products[6],
        settings,
        "sevenBottom2",
        7
      )}

    </div>
  `;
}

/* =========================================================
   8 PRODUCTS
========================================================= */

function renderEight(
  products: ProductItem[],
  settings: any
) {
  return `
    <div class="productBento productBentoEight">

      ${renderCard(
        products[0],
        settings,
        "eightLarge",
        1
      )}

      ${renderCard(
        products[1],
        settings,
        "eightSmall1",
        2
      )}

      ${renderCard(
        products[2],
        settings,
        "eightSmall2",
        3
      )}

      ${renderCard(
        products[3],
        settings,
        "eightSmall3",
        4
      )}

      ${renderCard(
        products[4],
        settings,
        "eightSmall4",
        5
      )}

      ${renderCard(
        products[5],
        settings,
        "eightBottom1",
        6
      )}

      ${renderCard(
        products[6],
        settings,
        "eightBottom2",
        7
      )}

      ${renderCard(
        products[7],
        settings,
        "eightBottom3",
        1
      )}

    </div>
  `;
}

/* =========================================================
   SELECT LAYOUT
========================================================= */

function renderProducts(
  products: ProductItem[],
  settings: any
) {
  switch (products.length) {

    case 1:
      return renderOne(
        products,
        settings
      );

    case 2:
      return renderTwo(
        products,
        settings
      );

    case 3:
      return renderThree(
        products,
        settings
      );

    case 4:
      return renderFour(
        products,
        settings
      );

    case 5:
      return renderFive(
        products,
        settings
      );

    case 6:
      return renderSix(
        products,
        settings
      );

    case 7:
      return renderSeven(
        products,
        settings
      );

    case 8:
      return renderEight(
        products,
        settings
      );

    default:
      return "";
  }
}

/* =========================================================
   CATEGORY PAGE
========================================================= */

function renderCategoryPage(
  catalog: any,
  brand: string,
  category: string,
  products: ProductItem[],
  pageIndex: number
) {

  const safeBrand =
    slugify(brand);

  const safeCategory =
    slugify(category);

  const isFirstPage =
    pageIndex === 0;

  return `
    <section
      class="
        page
        bentoProductsPage
      "
      ${
        isFirstPage
          ? `id="category-${safeBrand}-${safeCategory}"`
          : ""
      }
    >

      <div class="pageContent">

        <div
          class="bentoProductSection"
        >

          <div class="bentoSectionHeader">

            <div>

              <div class="bentoSupplierLabel">
                ${brand}
              </div>

              <h2 class="bentoProductSectionTitle">

                ${category}

                ${
                  !isFirstPage
                    ? `
                      <span class="bentoContinued">
                        Continued
                      </span>
                    `
                    : ""
                }

              </h2>

            </div>

            <div class="bentoProductHeaderRight">

              <div class="bentoSectionProductCount">
                ${products.length}
                ${
                  products.length === 1
                    ? "Product"
                    : "Products"
                }
              </div>

              <div class="bentoProductNavigation">

                <a
                  href="#supplier-${safeBrand}"
                  class="bentoProductNavButton"
                >
                  ← Supplier
                </a>

                <a
                  href="#cover"
                  class="bentoProductNavButton bentoProductNavTop"
                >
                  ↑ Top
                </a>

              </div>

            </div>

          </div>

          ${renderProducts(
            products,
            catalog.settings
          )}

        </div>

      </div>

      ${generateFooter(catalog)}

    </section>
  `;
}

/* =========================================================
   MAIN
========================================================= */

export function generateBentoProductPages(
  catalog: any,
  brand: string,
  supplierProducts: ProductItem[]
) {

  const grouped =
    new Map<
      string,
      ProductItem[]
    >();

  supplierProducts.forEach(
    (
      catalogProduct:
        ProductItem
    ) => {

      const category =
        getCategory(
          catalogProduct
        );

      if (
        !grouped.has(category)
      ) {
        grouped.set(
          category,
          []
        );
      }

      grouped
        .get(category)!
        .push(
          catalogProduct
        );
    }
  );

  let html = "";

  for (
    const [
      category,
      categoryProducts,
    ] of grouped
  ) {

    const products =
      [...categoryProducts]
        .sort(
          (
            a: any,
            b: any
          ) =>
            (a.position ?? 0) -
            (b.position ?? 0)
        );

    /*
      STRICT PAGINATION

      1–8  => one page
      9    => 8 + 1
      14   => 8 + 6
      16   => 8 + 8
    */

    for (
      let index = 0;
      index < products.length;
      index += PRODUCTS_PER_PAGE
    ) {

      const pageProducts =
        products.slice(
          index,
          index +
            PRODUCTS_PER_PAGE
        );

      const pageIndex =
        Math.floor(
          index /
          PRODUCTS_PER_PAGE
        );

      html +=
        renderCategoryPage(
          catalog,
          brand,
          category,
          pageProducts,
          pageIndex
        );
    }
  }

  return html;
}